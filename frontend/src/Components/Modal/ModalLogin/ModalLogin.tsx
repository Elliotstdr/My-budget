import React, { useEffect } from "react";
import { InputText } from "primereact/inputtext";
import Modal from "../Modal";
import { useDispatch } from "react-redux";
import { Password } from "primereact/password";
import "./ModalLogin.scss";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import Bouton from "../../../Utils/Bouton/Bouton";
import { errorToast } from "../../../Services/functions";
import { UPDATE_AUTH } from "../../../Store/Reducers/authReducer";
import { fetchGet, fetchPost } from "../../../Services/api";

type Props = {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setVisibleForgot: React.Dispatch<React.SetStateAction<boolean>>,
  header: string
}

type Values = {
  email: string
  password: string,
}

const ModalLogin = (props: Props) => {
  const dispatch = useDispatch();
  const updateAuth = (value: Partial<AuthState>) => {
    dispatch({ type: UPDATE_AUTH, value });
  };
  const [isloging, setIsLoging] = useState(false);

  const defaultValues: Values = {
    email: "",
    password: "",
  };

  useEffect(() => {
    !props.visible && setIsLoging(false);
  }, [props.visible]);
  // variables du formulaire
  const {
    control,
    getValues,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const onSubmit = async () => {
    setIsLoging(true);
    const data = getValues();

    const response = await fetchPost(`/auth/login`, data);
    if (response.error || !response.data?.token) {
      setIsLoging(false);
      errorToast("L'authentification a échoué");
      return;
    }

    const user = await fetchGet(`/user/${response.data.userId}`, response.data.token);
    setIsLoging(false);
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
      <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="login__form__field">
          <h4>Adresse email</h4>
          <InputText
            type="email"
            {...register("email", { required: true })}
            placeholder="Adresse email"
            className="login__form__field-email"
          ></InputText>
          {errors.email && <small className="p-error">L'email est obligatoire</small>}
        </div>
        <div className="login__form__field">
          <h4>Mot de passe</h4>
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Le mot de passe est obligatoire",
            }}
            render={({ field }) => (
              <Password
                {...field}
                placeholder="Mot de passe"
                className="login__form__field-password"
                feedback={false}
              />
            )}
          />
          {errors.password && <small className="p-error">{errors.password.message}</small>}
        </div>
        {/* <div
          className="forgot_password"
          onClick={() => {
            props.setVisible(false);
            props.setVisibleForgot(true);
          }}
        >
          Mot de passe oublié ?
        </div> */}
        <div className="login__form__button">
          <Bouton disable={isloging}>{isloging ? "Waiting..." : "Se connecter"}</Bouton>
        </div>
      </form>
    </Modal>
  );
};

export default ModalLogin;
