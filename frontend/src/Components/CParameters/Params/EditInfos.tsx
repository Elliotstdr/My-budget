import "../../../Pages/Parameters/Parameters.scss";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import Bouton from "../../../Utils/Bouton/Bouton";
import { useDispatch, useSelector } from "react-redux";
import { errorToast, successToast } from "../../../Services/functions";
import { UPDATE_USER_CONNECTED } from "../../../Store/Reducers/authReducer";
import { fetchPut } from "../../../Services/api";
import { MdMailOutline, MdPersonOutline } from "react-icons/md";

const EditInfos = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const updateUserConnected = (value: Partial<User>) => {
    dispatch({ type: UPDATE_USER_CONNECTED, value });
  };

  const defaultValues = {
    username: auth.userConnected?.username || "",
    email: auth.userConnected?.email || "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm({ defaultValues });

  const editInfos = async () => {
    if (!auth.userConnected) return;
    const values = getValues();

    const response = await fetchPut(`/user/${auth.userConnected._id}`, values)
    if (response.error || !response.data) {
      errorToast(response);
      return;
    }

    reset({ username: values.username, email: values.email })
    successToast("Votre profil a bien été mis à jour");

    updateUserConnected({ email: values.email, username: values.username });
  };

  return (
    <form className="param__form editinfos" onSubmit={handleSubmit(editInfos)}>
      <div className="param__form__field form-field">
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
      <div className="param__form__field form-field">
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
        disable={isSubmitting}
        btnTexte={isSubmitting ? "En cours..." : "Modifier"}
      ></Bouton>
    </form>
  );
};

export default EditInfos;