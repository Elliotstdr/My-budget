import "./DebtForm.scss";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import Bouton from "../../../../Utils/Bouton/Bouton";
import { RadioButton } from 'primereact/radiobutton';
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSelector } from "react-redux";
import { fetchPost } from "../../../../Services/api";
import { errorToast } from "../../../../Services/functions";

type Values = {
  target: string
  title: string,
  value: number | null,
  dueDate?: Date | null,
  user: string
}

interface Props {
  visibleForm: boolean,
  setDebts: React.Dispatch<React.SetStateAction<Debt[]>>
}

const DebtForm = (props: Props) => {
  const auth = useSelector((state: RootState) => state.auth);
  const [date, setDate] = useState<Date | null>(null)
  const [way, setWay] = useState<'in' | 'out'>('out')

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

    if (way === 'out' && data.value) data.value = -Math.abs(data.value)
    if (way === 'in' && data.value) data.value = Math.abs(data.value)

    const newDebt = await fetchPost("/debt", data)
    if (newDebt.error) {
      errorToast(newDebt)
      return
    }

    props.setDebts((prev) => [...prev, newDebt.data])
    reset()
  }

  return (
    <form
      className={`debt__form editinfos ${props.visibleForm ? 'visible' : 'hidden'}`}
      onSubmit={handleSubmit(createDebt)}
    >
      <div className="debt__form__field radios">
        <div className="radio">
          <RadioButton
            value="out"
            onChange={(e) => setWay(e.value)}
            checked={way === 'out'}
          />
          <div>Je dois</div>
        </div>
        <div className="radio">
          <RadioButton
            value="in"
            onChange={(e) => setWay(e.value)}
            checked={way === 'in'}
          />
          <div>On me doit</div>
        </div>
      </div>
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
          placeholder="20"
          className="param__form__field-value"
          keyfilter="pnum"
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
  );
};

export default DebtForm;