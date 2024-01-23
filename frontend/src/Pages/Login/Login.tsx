import { useState } from "react";
import Bouton from "../../Components/UI/Bouton/Bouton";
import ModalLogin from "../../Components/CLogin/ModalLogin/ModalLogin";
import ModalRegister from "../../Components/CLogin/ModalRegister/ModalRegister";
import image from "../../assets/tirelire-high.png";
import ModalForgotPassword from "../../Components/CLogin/ModalForgotPassword/ModalForgotPassword";

const Login = () => {
  const [visibleModalLogin, setVisibleModalLogin] = useState(false);
  const [visibleModalRegister, setVisibleModalRegister] = useState(false);
  const [visibleModalForgot, setVisibleModalForgot] = useState(false);

  return (
    <div className="w-full h-full flex items-center justify-center flex-col main-bg text-white text-center">
      <img className="w-52" src={image} alt="background home" />
      <span className="font-bold text-4xl mt-4">Mes comptes</span>
      <span className="text-base mb-4">
        Mon application personnelle pour gérer mes comptes en toute simplicité
      </span>
      <div className="flex items-center flex-col p-12 w-full">
        <Bouton
          btnTexte={"Se connecter"}
          btnAction={() => setVisibleModalLogin(true)}
          className="my-2 w-full max-w-80"
          style={{ border: 'none' }}
        ></Bouton>
        <Bouton
          btnTexte={"Créer un compte"}
          btnAction={() => setVisibleModalRegister(true)}
          color="pink"
          className="my-2 w-full max-w-80"
          style={{ border: 'none' }}
        ></Bouton>
      </div>
      <span className="text-sm">By Elliot Saint-André</span>
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
