import { useForm } from "react-hook-form";
import "./ImportManuel.scss";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { fetchPost, fetchPut, useFetchGet } from "../../../Services/api";
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { errorToast, rangeTiretDate } from "../../../Services/functions";
import Operation from "../../Operation/Operation";
import ReturnButton from "../../../Utils/ReturnButton/ReturnButton";
import { useNavigate } from "react-router-dom";
import Header from "../../Header/Header";
import NavBar from "../../NavBar/NavBar";
import SlideIn from "../../../Utils/SlideIn/SlideIn";
import OperationsImported from "../../OperationsImported/OperationsImported";
import { UPDATE_AUTH } from "../../../Store/Reducers/authReducer";
import { InputSwitch } from "primereact/inputswitch";
import Bouton from "../../../Utils/Bouton/Bouton";
import { useScreenSize } from "../../../Services/useScreenSize";

type Values = {
  name: string,
  value: string,
  type: Type | null
}

const ImportManuel = () => {
  const navigate = useNavigate()
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const updateAuth = (value: Partial<AuthState>) => {
    dispatch({ type: UPDATE_AUTH, value });
  };
  const typesData = useFetchGet<Type[]>("/type")
  const [ddType, setDdType] = useState<Type | null>(null)
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [operations, setOperations] = useState<Operation[]>([])
  const [isProposedType, setIsProposedType] = useState(true)
  const [openPropositions, setOpenPropositions] = useState(false)
  const [redondantOperations, setRedondantOperations] = useState<ImportedOperation[]>([])
  const windowSize = useScreenSize()
  const defaultValues: Values = {
    name: "",
    value: "",
    type: null
  }

  const {
    register,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = async (type: 'positive' | 'negative') => {
    if (!ddType?._id || !auth.userConnected?._id || !date) return

    const data = getValues()

    const payload: NewOperation = {
      label: data.name,
      value: type === 'positive' ? Number(data.value) : Number(-data.value),
      type: ddType._id,
      user: auth.userConnected._id,
      datePeriod: date
    }

    const newOperation = await fetchPost("/operation", payload)
    if (newOperation.error) {
      errorToast(newOperation)
      return
    }

    setOperations((prev) => [...prev, newOperation.data])
    reset()
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!date) return

      const payload = rangeTiretDate(date)
      if (!payload) return

      const data = await fetchPost(`/operation/byDate`, payload);
      if (data.error) return

      setOperations(data.data)

      if (data.data?.length === 0 && auth.userConnected?.allowPropositions) findRedondantOperations()
    }
    // call the function
    fetchData()
    // eslint-disable-next-line
  }, [date])

  const findRedondantOperations = async () => {
    if (!auth.userConnected?._id) return
    const operations = await fetchPost(`/operation/redondant/user/${auth.userConnected._id}`, {})

    if (!operations.data) return
    setRedondantOperations(operations.data.map((x: Partial<ImportedOperation>, key: number) => {
      return {
        ...x,
        id: key
      }
    }))
    setOpenPropositions(true)
  }

  const createItem = async (item: ImportedOperation) => {
    if (!auth.userConnected || !item.type || !date) return

    const itemDate = date
    itemDate.setHours(itemDate.getHours() + 12)

    const payload: NewOperation = {
      label: item.nom,
      value: Number(item.valeur),
      type: item.type,
      user: auth.userConnected._id,
      datePeriod: itemDate
    }

    const newOperation = await fetchPost("/operation", payload)
    if (newOperation.error) {
      errorToast(newOperation)
      return
    }

    setOperations((prev) => [...prev, newOperation.data])
  }

  useEffect(() => {
    if (redondantOperations.length === 0) setOpenPropositions(false)
  }, [redondantOperations])

  const editAllowStatus = async () => {
    if (!auth.userConnected) return

    const payloadUser = {
      ...auth.userConnected,
      allowPropositions: !auth.userConnected.allowPropositions
    }

    const newUser = await fetchPut(`/user/${auth.userConnected._id}`, payloadUser)
    if (newUser.data) updateAuth({ userConnected: payloadUser })
  }
  return (
    <>
      <Header title="Saisie manuelle"></Header>
      <div className='importmanuel page'>
        <div className="importmanuel__top">
          <ReturnButton action={() => navigate("/import")}></ReturnButton>
          <div className="importmanuel__top__right">
            <InputSwitch
              checked={auth.userConnected!.allowPropositions}
              onChange={() => editAllowStatus()}
            />
            <span>Propositions</span>
          </div>
        </div>
        <Calendar
          value={date}
          onChange={(e) => {
            const newDate = e.value as Date;
            newDate.setHours(newDate.getHours() + 12);
            setDate(newDate)
          }}
          view="month"
          dateFormat="mm/yy"
          placeholder="Choisissez une date"
          showIcon={windowSize.width < 900}
          autoFocus
          inline={windowSize.width >= 900}
        />
        {date && <form className="importmanuel__form">
          <div className="importmanuel__form__input">
            <div className="field input">
              <InputText
                {...register("name", { required: true })}
                placeholder="Nom de l'opération"
                className="importmanuel__form__field-name"
                onChange={(e) => {
                  if (!typesData.data) return
                  const suggestType = typesData.data.find((x) => x.keywords.includes(e.target.value))
                  if (suggestType && isProposedType) {
                    setValue("type", suggestType)
                    setDdType(suggestType)
                    setIsProposedType(true)
                  }
                }}
              />
              {errors.name && <small className="p-error">nom obligatoire</small>}
            </div>
            <div className="field value">
              <InputText
                {...register("value", { required: true })}
                placeholder="€"
                className="importmanuel__form__field-value"
                keyfilter="pnum"
              />
              {errors.value && <small className="p-error">valeur obligatoire</small>}
            </div>
            <div className="field dropdown">
              <Dropdown
                {...register("type", { required: true })}
                value={ddType}
                options={typesData.data ?? []}
                optionLabel="label"
                placeholder="Type"
                className="importmanuel__form__field-type"
                onChange={(e) => {
                  setDdType(e.value)
                  setIsProposedType(false)
                }}
                title={ddType?.label}
              ></Dropdown>
              {errors.type && <small className="p-error">type obligatoire</small>}
            </div>
          </div>
          <div className="importmanuel__form__buttons">
            <Bouton className="revenus" btnTexte="Revenus" btnAction={(e) => {
              e.preventDefault()
              onSubmit('positive')
            }}>
              <AiOutlinePlusCircle></AiOutlinePlusCircle>
            </Bouton>
            <Bouton className="depenses" btnTexte="Dépenses" btnAction={(e) => {
              e.preventDefault()
              onSubmit('negative')
            }}>
              <AiOutlineMinusCircle></AiOutlineMinusCircle>
            </Bouton>
          </div>
          {/* <button className="importmanuel__form__button">
            <AiOutlinePlusCircle></AiOutlinePlusCircle>
          </button> */}
        </form>}
        <Divider></Divider>
        <div className="importmanuel__list">
          {operations.map((x) =>
            <Operation
              key={x._id}
              operation={x}
              setOperations={setOperations}
              types={typesData.data ?? []}
            ></Operation>
          )}
        </div>
      </div>
      <NavBar></NavBar>
      {openPropositions && <SlideIn
        visible={openPropositions}
        setVisible={setOpenPropositions}
        className="sidebar-propositions"
      >
        <h2>Propositions d'opérations</h2>
        {redondantOperations.map((x) => <OperationsImported
          key={x.id}
          operation={x}
          setImportedData={setRedondantOperations}
          createItem={createItem}
          typesData={typesData.data ?? []}
        ></OperationsImported>)}
      </SlideIn>}
    </>
  );
};

export default ImportManuel;