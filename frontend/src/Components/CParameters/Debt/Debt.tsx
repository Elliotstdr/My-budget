import "./Debt.scss";
import image from "../../../assets/tirelire-blue.png";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import Bouton from "../../../Utils/Bouton/Bouton";
import { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { Divider } from "primereact/divider";
import { fetchPost, useFetchGet } from "../../../Services/api";
import { errorToast } from "../../../Services/functions";
import { useSelector } from "react-redux";
import DebtCard from "./DebtCard/DebtCard";
import { useScreenSize } from "../../../Services/useScreenSize";

type Values = {
  target: string
  title: string,
  value: number | null,
  dueDate?: Date | null,
  user: string
}

const Debt = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const debtData = useFetchGet<Debt[]>("/debt")
  const [date, setDate] = useState<Date | null>(null)
  const [visibleForm, setVisibleForm] = useState(false)
  const [debts, setDebts] = useState<Debt[]>([])
  const windowSize = useScreenSize()

  useEffect(() => {
    if (debtData.loaded && debtData.data) {
      setDebts(debtData.data)
      debtData.data.length === 0 && setVisibleForm(true)
    }
    // eslint-disable-next-line
  }, [debtData.loaded])

  const defaultValues: Values = {
    target: "",
    title: "",
    value: null,
    dueDate: null,
    user: auth.userConnected?._id || ""
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({ defaultValues });

  const createDebt = async () => {
    const data = getValues()
    data.dueDate = date

    const newDebt = await fetchPost("/debt", data)
    if (newDebt.error) {
      errorToast(newDebt)
      return
    }

    setDebts((prev) => [...prev, newDebt.data])
    reset()
  }

  return (
    <div className='debt'>
      <div>
        <div className="import__top">
          <img src={image} alt="background home" />
          <span className="text">Renseigne ici tes différentes créances avec tes proches</span>
        </div>
        <div className={`debt__showForm ${visibleForm}`} onClick={() => setVisibleForm(!visibleForm)}>
          <FaAngleRight /> Ajouter une créance
        </div>
        <form
          className={`debt__form editinfos ${visibleForm ? 'visible' : 'hidden'}`}
          onSubmit={handleSubmit(createDebt)}
        >
          <div className="debt__form__field">
            <label>Qui ?<i className="star">*</i></label>
            <InputText
              {...register("target", { required: true })}
              placeholder="Fanny"
              className="debt__form__field-target"
            />
            {errors.target && <small className="p-error">Le nom est obligatoire</small>}
          </div>
          <div className="debt__form__field">
            <label>Quoi ?<i className="star">*</i></label>
            <InputText
              {...register("title", { required: true })}
              placeholder="Restaurant"
              className="debt__form__field-title"
            />
            {errors.title && <small className="p-error">L&apos;intitulé est obligatoire</small>}
          </div>
          <div className="debt__form__field">
            <label>Combien ?<i className="star">*</i></label>
            <InputText
              {...register("value", { required: true })}
              placeholder="20€"
              className="param__form__field-value"
              keyfilter="num"
            />
            {errors.value && <small className="p-error">Le montant est obligatoire</small>}
          </div>
          <div className="debt__form__field">
            <label>Quand ?</label>
            <Calendar
              value={date}
              onChange={(e) => {
                const newDate = e.value as Date;
                newDate.setHours(newDate.getHours() + 48);
                setDate(newDate)
              }}
              className="param__form__field-dueDate"
              view="month"
              dateFormat="mm/yy"
              placeholder="Choisissez une date"
              showButtonBar
            />
          </div>
          <Bouton
            btnTexte={"Ajouter"}
            style={{ marginTop: "1rem" }}
          ></Bouton>
        </form>
      </div>
      <Divider layout={windowSize.width > 900 ? "vertical" : "horizontal"}></Divider>
      <div className="debt__container">
        {debts.map((x) =>
          <DebtCard
            key={x._id}
            debt={x}
            setDebts={setDebts}
          ></DebtCard>
        )}
      </div>
    </div>
  );
};

export default Debt;