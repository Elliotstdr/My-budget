import { useState } from "react";
import Bouton from "../../Utils/Bouton/Bouton";
import "./Login.scss";
import ModalLogin from "../../Components/Modal/ModalLogin/ModalLogin";
import ModalRegister from "../../Components/Modal/ModalRegister/ModalRegister";
import image from "../../assets/accueilHC.jpg";
import ModalForgotPassword from "../../Components/Modal/ModalForgotPassword/ModalForgotPassword";

const Login = () => {
  const [visibleModalLogin, setVisibleModalLogin] = useState(false);
  const [visibleModalRegister, setVisibleModalRegister] = useState(false);
  const [visibleModalForgot, setVisibleModalForgot] = useState(false);

  return (
    <div className="login">
      <img src={image} alt="background home" />
      <div className="login__box">
        <Bouton
          btnTexte={"Se connecter"}
          btnAction={() => setVisibleModalLogin(true)}
        ></Bouton>
        <Bouton
          btnTexte={"Créer un compte"}
          btnAction={() => setVisibleModalRegister(true)}
        ></Bouton>
      </div>

      {visibleModalLogin && (
        <ModalLogin
          visible={visibleModalLogin}
          setVisible={setVisibleModalLogin}
          setVisibleForgot={setVisibleModalForgot}
          header={"Se connecter"}
        ></ModalLogin>
      )}
      {visibleModalRegister && (
        <ModalRegister
          visible={visibleModalRegister}
          setVisible={setVisibleModalRegister}
          header={"Créer un compte"}
        ></ModalRegister>
      )}
      {visibleModalForgot && (
        <ModalForgotPassword
          visible={visibleModalForgot}
          setVisible={setVisibleModalForgot}
        ></ModalForgotPassword>
      )}
    </div>
  );
};

export default Login;
