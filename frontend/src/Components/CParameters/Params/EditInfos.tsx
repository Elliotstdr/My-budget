import "../../../Pages/Parameters/Parameters.scss";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import Bouton from "../../../Utils/Bouton/Bouton";
import { useDispatch, useSelector } from "react-redux";
import { errorToast, successToast } from "../../../Services/functions";
import { UPDATE_AUTH } from "../../../Store/Reducers/authReducer";
import { fetchPut } from "../../../Services/api";
import { MdMailOutline, MdPersonOutline } from "react-icons/md";

type Values = {
  email: string,
  username: string,
}
const EditInfos = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const updateAuth = (value: Partial<AuthState>) => {
    dispatch({ type: UPDATE_AUTH, value });
  };

  const [isModifying, setIsModifying] = useState(false);

  const defaultValues: Values = {
    username: auth.userConnected?.username || "",
    email: auth.userConnected?.email || "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({ defaultValues });

  const editInfos = async () => {
    if (!auth.userConnected) return;
    setIsModifying(true);
    const values = getValues();

    const response = await fetchPut(`/user/${auth.userConnected._id}`, values)

    setIsModifying(false);
    if (response.error || !response.data) {
      errorToast(response);
      return;
    }

    reset({ username: values.username, email: values.email })
    successToast("Votre profil a bien été mis à jour");

    updateAuth({
      userConnected: { ...auth.userConnected, email: values.email, username: values.username }
    });
  };

  return (
    <form className="param__form editinfos" onSubmit={handleSubmit(editInfos)}>
      <div className="param__form__field">
        <h4>Nom</h4>
        <div className="box">
          <MdPersonOutline></MdPersonOutline>
          <InputText
            {...register("username", { required: true })}
            placeholder="Fanny"
            className="param__form__field-username"
          />
        </div>
        {errors.username && <small className="p-error">Le nom est obligatoire</small>}
      </div>
      <div className="param__form__field">
        <h4>Adresse email</h4>
        <div className="box">
          <MdMailOutline></MdMailOutline>
          <InputText
            type="email"
            {...register("email", { required: true })}
            placeholder="Adresse email"
            className="param__form__field-email"
          />
        </div>
        {errors.email && <small className="p-error">L'email est obligatoire</small>}
      </div>
      <Bouton
        disable={isModifying}
        btnTexte={isModifying ? "Waiting" : "Modifier"}
      ></Bouton>
    </form>
  );
};

export default EditInfos;