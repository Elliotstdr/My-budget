import React, { useEffect } from "react";
import { InputText } from "primereact/inputtext";
import Modal from "../../../../Components/UI/Modal/Modal";
import { Password } from "primereact/password";
import "./ModalForgotPassword.scss";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import Bouton from "../../../../Components/UI/Bouton/Bouton";
import { errorToast, successToast } from "../../../../Services/functions";
import { fetchPost } from "../../../../Services/api";
import { useDispatch } from "react-redux";
import { updateAuth } from "../../../../Store/Reducers/authReducer";

type Props = {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
}

type Values = {
  email: string
  secretKey: string,
  resetKey: string,
  newPassword: string
}

const ModalForgotPassword = (props: Props) => {
  const dispatch = useDispatch()
  const [error, setError] = useState("");
  const [isloging, setIsLoging] = useState(false);
  const [isSendingMail, setIsSendingMail] = useState(true);
  const [oldValues, setOldValues] = useState<Partial<Values> | null>(null);

  const defaultValues: Values = {
    email: "",
    secretKey: "",
    resetKey: "",
    newPassword: "",
  };

  useEffect(() => {
    !props.visible && setIsLoging(false);
  }, [props.visible]);
  // variables du formulaire
  const { getValues, handleSubmit, control, register, reset } = useForm({
    defaultValues,
  });

  const onSubmit = () => {
    const data = getValues();

    if (isSendingMail && data.email !== "") {
      setIsLoging(true);
      const sendMailData = {
        email: data.email,
        secretKey: data.secretKey,
      };
      sendMail(sendMailData);
      setError("");
    } else if (
      !isSendingMail &&
      oldValues &&
      data.resetKey !== "" &&
      data.newPassword !== ""
    ) {
      setIsLoging(true);
      const dataForReset = {
        resetKey: data.resetKey,
        newPassword: data.newPassword,
        email: oldValues.email,
      };
      resetPassword(dataForReset);
      setError("");
    } else {
      setError("Certaines informations ne sont pas remplies");
    }
  };

  const sendMail = async (data: Partial<Values>) => {
    const response = await fetchPost(`/users/mailReset`, data);
    setIsLoging(false);
    if (response.error) {
      errorToast(response);
      return;
    }
    setOldValues(data);
    reset();
    setIsSendingMail(false);
    successToast(response.data ?? "");
  };

  const resetPassword = async (data: Partial<Values>) => {
    const response = await fetchPost(`/users/resetPassword`, data);
    setIsLoging(false);
    if (response.error || !response.data) {
      errorToast(response);
      return;
    }
    reset();
    setIsSendingMail(true);
    props.setVisible(false);
    dispatch(updateAuth({
      isConnected: true,
      token: response.data.token ?? null,
      userConnected: response.data.user ?? null,
      newLogTime: new Date().getTime(),
    }));
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
        {isSendingMail ? (
          <>
            <div className="login__form__field">
              <h4>Adresse email</h4>
              <InputText
                type="email"
                {...register("email")}
                placeholder="Adresse email"
                className="login__form__field-email"
              />
            </div>
            <h5>
              Renseignez l'email de votre compte, un email avec la clé de
              réinitialisation de votre mot de passe va vous être envoyé
            </h5>
            <div className="login__form__button">
              <Bouton disable={isloging}>{isloging ? "Waiting..." : "Envoyer"}</Bouton>
            </div>
          </>
        ) : (
          <>
            <div className="login__form__field">
              <h4>Clé de réinitialisation :</h4>
              <Controller
                name="resetKey"
                control={control}
                render={({ field }) => (
                  <Password
                    {...field}
                    feedback={false}
                    autoComplete="new-password"
                    placeholder="Clé de réinitialisation"
                    className="login__form__field-resetKey"
                  />
                )}
              />
            </div>
            <div className="login__form__field">
              <h4>Nouveau mot de passe</h4>
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <Password
                    {...field}
                    autoComplete="new-password"
                    placeholder="mot de passe"
                    className={"login__form__field-newPassword"}
                  />
                )}
              />
            </div>
            <div
              className="send_new_mail"
              onClick={() => oldValues && sendMail(oldValues)}
            >
              Renvoyer le mail
            </div>
            {error && <small className="p-error">{error}</small>}
            <div className="login__form__button">
              <Bouton disable={isloging}>{isloging ? "Waiting..." : "Changer de mot de passe"}</Bouton>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};

export default ModalForgotPassword;
