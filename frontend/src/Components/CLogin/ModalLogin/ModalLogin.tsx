import React from "react";
import { InputText } from "primereact/inputtext";
import Modal from "../../UI/Modal/Modal";
import { useDispatch } from "react-redux";
import { Password } from "primereact/password";
import { Controller, useForm } from "react-hook-form";
import Bouton from "../../UI/Bouton/Bouton";
import { errorToast } from "../../../Services/functions";
import { UPDATE_AUTH } from "../../../Store/Reducers/authReducer";
import { fetchGet, fetchPost } from "../../../Services/api";
import { MdMailOutline, MdLockOutline } from "react-icons/md";

type Props = {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setVisibleForgot: React.Dispatch<React.SetStateAction<boolean>>,
  header: string
}

const ModalLogin = (props: Props) => {
  const dispatch = useDispatch();
  const updateAuth = (value: Partial<AuthState>) => {
    dispatch({ type: UPDATE_AUTH, value });
  };

  const defaultValues = {
    email: "",
    password: "",
  };

  // variables du formulaire
  const {
    control,
    getValues,
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm({ defaultValues });

  const onSubmit = async () => {
    const data = getValues();

    const response = await fetchPost(`/auth/login`, data);
    if (response.error || !response.data?.token) {
      errorToast("L'authentification a échoué");
      return;
    }

    const user = await fetchGet(`/user/${response.data.userId}`, response.data.token);
    if (user.error) {
      errorToast("L'authentification a échoué");
      return;
    }
    updateAuth({
      isConnected: true,
      token: response.data.token,
      userConnected: user.data,
      newLogTime: new Date().getTime(),
    });
  };

  return (
    <Modal
      header="Connexion"
      visible={props.visible}
      setVisible={props.setVisible}
      className={"modal modal-login"}
      width={"20rem"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <h4>Adresse email</h4>
          <div className="box">
            <MdMailOutline></MdMailOutline>
            <InputText
              type="email"
              {...register("email", { required: true })}
              placeholder={"Adresse email"}
            ></InputText>
          </div>
          {errors.email && <small className="p-error">L'email est obligatoire</small>}
        </div>
        <div className="form-field">
          <h4>Mot de passe</h4>
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Le mot de passe est obligatoire",
            }}
            render={({ field }) => (
              <div className="box">
                <MdLockOutline></MdLockOutline>
                <Password
                  {...field}
                  placeholder="Mot de passe"
                  feedback={false}
                />
              </div>
            )}
          />
          {errors.password && <small className="p-error">{errors.password.message}</small>}
        </div>
        {/* <div
          className="cursor-pointer underline text-right text-sm p-2"
          onClick={() => {
            props.setVisible(false);
            props.setVisibleForgot(true);
          }}
        >
          Mot de passe oublié ?
        </div> */}
        <div className="mt-8 flex justify-center">
          <Bouton
            disable={isSubmitting}
            className="w-full"
          >{isSubmitting ? "En cours..." : "Se connecter"}</Bouton>
        </div>
        <div
          className="third-color text-xl font-bold text-center mt-4 cursor-pointer"
          onClick={() => props.setVisible(false)}
        >Annuler</div>
      </form>
    </Modal>
  );
};

export default ModalLogin;
