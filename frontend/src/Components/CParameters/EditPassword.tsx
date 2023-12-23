import "../../Pages/Parameters/Parameters.scss";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Bouton from "../../Utils/Bouton/Bouton";
import { useSelector } from "react-redux";
import { errorToast, successToast } from "../../Services/functions";
import { fetchPost } from "../../Services/api";
import { Password } from "primereact/password";
import { MdLockOutline } from "react-icons/md";

type Values = {
  password: string,
  oldPassword: string
}
const EditPassword = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [isModifying, setIsModifying] = useState(false);

  const defaultValues: Values = {
    password: "",
    oldPassword: "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({ defaultValues });

  const editPassword = async () => {
    if (!auth.userConnected) return;
    setIsModifying(true);
    const values = getValues();

    if (!values.password || !values.oldPassword) return

    const response = await fetchPost(`/user/${auth.userConnected._id}/edit_password`, values)

    setIsModifying(false);
    if (response.error || !response.data) {
      errorToast(response);
      return;
    }

    reset({ password: "", oldPassword: "" })
    successToast("Votre mot de passe a bien été mis à jour");
  }

  return (
    <form className="param__form" onSubmit={handleSubmit(editPassword)}>
      <div className="param__form__field">
        <h4>Précédent mot de passe</h4>
        <Controller
          name="oldPassword"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <div className="box">
              <MdLockOutline></MdLockOutline>
              <Password
                autoComplete="new-password"
                {...field}
                placeholder={"Ancien mot de passe"}
                className="param__form__field-oldPassword"
                feedback={false}
                toggleMask
              />
            </div>
          )}
        />
        {errors.oldPassword && <small className="p-error">L'ancien mot de passe est obligatoire</small>}
      </div>
      <div className="param__form__field">
        <h4>Nouveau mot de passe</h4>
        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <div className="box">
              <MdLockOutline></MdLockOutline>
              <Password
                autoComplete="new-password"
                {...field}
                placeholder={"Mot de passe"}
                className="param__form__field-password"
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                toggleMask
              />
            </div>
          )}
        />
      </div>
      <Bouton
        disable={isModifying}
        btnTexte={isModifying ? "Waiting" : "Modifier"}
      ></Bouton>
    </form>
  );
};

export default EditPassword;