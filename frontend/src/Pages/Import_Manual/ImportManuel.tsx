import "./ImportManuel.scss";
import { useEffect, useState } from "react";
import { fetchPost, fetchPut, useFetchGet } from "../../Services/api";
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { useDispatch, useSelector } from "react-redux";
import { errorToast, rangeTiretDate } from "../../Services/functions";
import Operation from "../../Components/Operation/Operation";
import ReturnButton from "../../Components/UI/ReturnButton/ReturnButton";
import { useNavigate } from "react-router-dom";
import SlideIn from "../../Components/UI/SlideIn/SlideIn";
import OperationsImported from "../../Components/OperationsImported/OperationsImported";
import { InputSwitch } from "primereact/inputswitch";
import { useScreenSize } from "../../Services/useScreenSize";
import OperationCreationForm from "./Components/OperationCreationForm/OperationCreationForm";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import { updateUserConnected } from "../../Store/Reducers/authReducer";

const ImportManuelContainer = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useSelector((state: RootState) => state.auth);
  const typesData = useFetchGet<Type[]>("/type")
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [operations, setOperations] = useState<Operation[]>([])
  const [openPropositions, setOpenPropositions] = useState(false)
  const [redondantOperations, setRedondantOperations] = useState<ImportedOperation[]>([])
  const windowSize = useScreenSize()

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

    const payloadUser = { allowPropositions: !auth.userConnected.allowPropositions }

    const newUser = await fetchPut(`/user/${auth.userConnected._id}`, payloadUser)
    if (newUser.data) dispatch(updateUserConnected(payloadUser))
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
        {date &&
          <OperationCreationForm
            typeData={typesData.data}
            date={date}
            setOperations={setOperations}
          ></OperationCreationForm>
        }
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
        {openPropositions &&
          <SlideIn
            visible={openPropositions}
            setVisible={setOpenPropositions}
            className="sidebar-propositions"
          >
            <h2>Propositions d'opérations</h2>
            {redondantOperations.map((x) =>
              <OperationsImported
                key={x.id}
                operation={x}
                setImportedData={setRedondantOperations}
                createItem={createItem}
                typesData={typesData.data ?? []}
              ></OperationsImported>)
            }
          </SlideIn>
        }
      </div>
      <NavBar></NavBar>
    </>
  );
};

export default ImportManuelContainer;