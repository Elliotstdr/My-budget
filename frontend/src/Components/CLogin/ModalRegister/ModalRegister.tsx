import React from "react";
import { InputText } from "primereact/inputtext";
import Modal from "../../UI/Modal/Modal";
import { useDispatch } from "react-redux";
import { Password } from "primereact/password";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import Bouton from "../../UI/Bouton/Bouton";
import { errorToast } from "../../../Services/functions";
import { UPDATE_AUTH } from "../../../Store/Reducers/authReducer";
import { fetchGet, fetchPost } from "../../../Services/api";
import { MdMailOutline, MdLockOutline, MdPersonOutline } from "react-icons/md";
import { useScreenSize } from "../../../Services/useScreenSize";

type Props = {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  header: string
}

const ModalLogin = (props: Props) => {
  const windowSize = useScreenSize()
  const dispatch = useDispatch();
  const updateAuth = (value: Partial<AuthState>) => {
    dispatch({ type: UPDATE_AUTH, value });
  };
  const [isEqualPassword, setIsEqualPassword] = useState(false);

  const defaultValues = {
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
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

    const res = await fetchPost(`/auth/signup`, data);
    if (res.error) {
      errorToast(res);
      return;
    }

    const dataForToken = {
      email: data.email,
      password: data.password,
    };
    const authentification = await fetchPost(`/auth/login`, dataForToken);
    if (authentification.error) {
      errorToast(authentification);
      return;
    }

    const user = await fetchGet(`/user/${authentification.data.userId}`, authentification.data.token);
    if (user.error) {
      errorToast("L'authentification a échoué");
      return;
    }
    updateAuth({
      isConnected: true,
      userConnected: user.data,
      token: authentification.data.token,
      newLogTime: new Date().getTime(),
    });
  };

  return (
    <Modal
      header="Création de compte"
      visible={props.visible}
      setVisible={props.setVisible}
      className={"modal modal-login"}
      width={windowSize.width > 768 ? "30rem" : '90%'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <h4>Nom</h4>
          <div className="box">
            <MdPersonOutline></MdPersonOutline>
            <InputText
              {...register("username", { required: true })}
              placeholder="Nom"
            />
          </div>
          {errors.username && <small className="p-error">Le nom est obligatoire</small>}
        </div>
        <div className="form-field">
          <h4>Adresse email</h4>
          <div className="box">
            <MdMailOutline></MdMailOutline>
            <InputText
              type="email"
              {...register("email", { required: true })}
              placeholder="Adresse email"
            />
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
              minLength: {
                value: 4,
                message: "Le mot de passe doit faire au moins 4 caractères",
              },
            }}
            render={({ field }) => (
              <div className="box">
                <MdLockOutline></MdLockOutline>
                <Password
                  {...field}
                  placeholder="Mot de passe"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setIsEqualPassword(
                      getValues("confirmpassword").length > 0 &&
                      e.target.value === getValues("confirmpassword")
                    );
                  }}
                />
              </div>
            )}
          />
          {errors.password && <small className="p-error">{errors.password.message}</small>}
        </div>
        <div className="form-field">
          <h4>Confirmer le mot de passe</h4>
          <Controller
            name="confirmpassword"
            control={control}
            rules={{
              required: "Veuillez confirmer le mot de passe",
              validate: (value) => {
                return value === getValues("password");
              },
            }}
            render={({ field }) => (
              <div className="box">
                <MdLockOutline></MdLockOutline>
                <Password
                  {...field}
                  placeholder={"Mot de passe"}
                  className={
                    isEqualPassword
                      ? "login__form__field-confirmpassword equal"
                      : "login__form__field-confirmpassword nonequal"
                  }
                  feedback={false}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setIsEqualPassword(
                      getValues("password").length > 0 &&
                      e.target.value === getValues("password")
                    );
                  }}
                />
              </div>
            )}
          />
          {errors.confirmpassword && <small className="p-error">{errors.confirmpassword.message}</small>}
        </div>
        <div className="mt-8 flex justify-center">
          <Bouton
            disable={isSubmitting}
            className="w-full"
          >{isSubmitting ? "En cours..." : "Créer un compte"}</Bouton>
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
