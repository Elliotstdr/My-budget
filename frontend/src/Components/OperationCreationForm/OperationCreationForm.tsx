import "./OperationCreationForm.scss";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import Bouton from "../../Utils/Bouton/Bouton";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { fetchPost } from "../../Services/api";
import { errorToast } from "../../Services/functions";
import { useSelector } from "react-redux";

type Values = {
  name: string,
  value: string,
  type: Type | null
}

type Props = {
  typeData: Type[] | null,
  date: Date | null | undefined,
  setOperations: React.Dispatch<React.SetStateAction<Operation[]>>
}

const OperationCreationForm = (props: Props) => {
  const auth = useSelector((state: RootState) => state.auth);
  const [isProposedType, setIsProposedType] = useState(true)
  const [ddType, setDdType] = useState<Type | null>(null)

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
    if (!ddType?._id || !auth.userConnected?._id || !props.date) return

    const data = getValues()

    const payload: NewOperation = {
      label: data.name,
      value: type === 'positive' ? Number(data.value) : Number(-data.value),
      type: ddType._id,
      user: auth.userConnected._id,
      datePeriod: props.date
    }

    const newOperation = await fetchPost("/operation", payload)
    if (newOperation.error) {
      errorToast(newOperation)
      return
    }

    props.setOperations((prev) => [...prev, newOperation.data])
    reset()
  }

  return (
    <form className="importmanuel__form">
      <div className="importmanuel__form__input">
        <div className="field input">
          <InputText
            {...register("name", { required: true })}
            placeholder="Nom de l'opération"
            className="importmanuel__form__field-name"
            onChange={(e) => {
              if (!props.typeData) return
              const suggestType = props.typeData.find((x) => x.keywords.includes(e.target.value))
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
            options={props.typeData ?? []}
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
    </form>
  );
};

export default OperationCreationForm;