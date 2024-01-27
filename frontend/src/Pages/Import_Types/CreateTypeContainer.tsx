import { useForm } from "react-hook-form";
import "./CreateTypeContainer.scss";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { fetchPost, useFetchGet } from "../../Services/api";
import { Divider } from 'primereact/divider';
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { errorToast } from "../../Services/functions";
import Type from "../../Components/Type/Type";
import ReturnButton from "../../Components/UI/ReturnButton/ReturnButton";
import { useNavigate } from "react-router-dom";

type Values = {
  name: string,
}

type NewType = {
  label: string,
  keywords: string[],
  user: string
}

const CreateTypeContainer = () => {
  const navigate = useNavigate()
  const auth = useSelector((state: RootState) => state.auth);
  const typesData = useFetchGet<Type[]>("/type")
  const [types, setTypes] = useState<Type[]>([])
  const defaultValues: Values = {
    name: "",
  }

  useEffect(() => {
    typesData.loaded && typesData.data && setTypes(typesData.data)
  }, [typesData.loaded, typesData.data])

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues });

  const onSubmit = async (data: Values) => {
    if (!auth.userConnected?._id || data.name === "") return

    const payload: NewType = {
      label: data.name,
      user: auth.userConnected._id,
      keywords: []
    }

    const newType = await fetchPost("/type", payload)
    if (newType.error) {
      errorToast(newType)
      return
    }

    setTypes((prev) => [...prev, newType.data])
    reset()
  }
  return (
    <div className='createtype page'>
      <ReturnButton action={() => navigate("/import")}></ReturnButton>
      <form className="createtype__form" onSubmit={handleSubmit(onSubmit)}>
        <span>Creéz un nouveau type d'opération</span>
        <div className="createtype__form__input">
          <InputText
            {...register("name", { maxLength: 12 })}
            placeholder="Nom du type"
            className="createtype__form__field-name"
            autoFocus
          />
          {errors.name && <small className="p-error">Le nom ne doit pas dépasser 12 caractères</small>}
          <button className="createtype__form__button">
            <AiOutlinePlusCircle></AiOutlinePlusCircle>
          </button>
        </div>
      </form>
      <Divider></Divider>
      <div className="createtype__list">
        {types.map((x) =>
          <Type
            key={x._id}
            type={x}
            setType={setTypes}
            editable={x.user !== null}
          ></Type>
        )}
      </div>
    </div>
  );
};

export default CreateTypeContainer;