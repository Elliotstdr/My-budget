import { useForm } from "react-hook-form";
import "./ImportManuel.scss";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { fetchPost, useFetchGet } from "../../../Services/api";
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { errorToast, rangeTiretDate } from "../../../Services/functions";
import Operation from "../../Operation/Operation";
import ReturnButton from "../../../Utils/ReturnButton/ReturnButton";
import { useNavigate } from "react-router-dom";
import Header from "../../Header/Header";
import NavBar from "../../NavBar/NavBar";

interface Values {
  name: string,
  value: string,
  type: Type | null
}

const ImportManuel = () => {
  const navigate = useNavigate()
  const auth = useSelector((state: RootState) => state.auth);
  const typesData = useFetchGet<Type[]>("/type")
  const [ddType, setDdType] = useState<Type | null>(null)
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [operations, setOperations] = useState<Operation[]>([])
  const [isProposedType, setIsProposedType] = useState(true)
  const defaultValues: Values = {
    name: "",
    value: "",
    type: null
  }

  const {
    register,
    reset,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const onSubmit = async (data: Values) => {
    if (!ddType?._id || !auth.userConnected?._id || !date) return

    const payload: NewOperation = {
      label: data.name,
      value: Number(data.value),
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
    }
    // call the function
    fetchData()
  }, [date])
  return (
    <>
      <Header title="Import manuel"></Header>
      <div className='importmanuel page'>
        <ReturnButton action={() => navigate("/import")}></ReturnButton>
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
          showIcon
          autoFocus
        />
        {date && <form className="importmanuel__form" onSubmit={handleSubmit(onSubmit)}>
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
                keyfilter="num"
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
          <button className="importmanuel__form__button">
            <AiOutlinePlusCircle></AiOutlinePlusCircle>
          </button>
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
    </>
  );
};

export default ImportManuel;