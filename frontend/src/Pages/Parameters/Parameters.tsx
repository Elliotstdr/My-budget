import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import "./Parameters.scss";
import { useEffect } from "react";
import { Divider } from "primereact/divider";
import EditInfos from "../../Components/CParameters/EditInfos";
import EditPassword from "../../Components/CParameters/EditPassword";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { UPDATE_AUTH } from "../../Store/Reducers/authReducer";

const Parameters = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const updateAuth = (value: Partial<AuthState>) => {
    dispatch({ type: UPDATE_AUTH, value });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header title="Paramètres"></Header>
      <div className="parameters">
        <div
          className="parameters__logout"
          onClick={() => {
            updateAuth({
              isConnected: false,
              token: null,
              userConnected: null,
              newLogTime: null,
            })
            navigate("/")
          }}>Se déconnecter</div>
        <EditInfos></EditInfos>
        <Divider></Divider>
        <EditPassword></EditPassword>
      </div>
      <NavBar></NavBar>
    </>
  );
};

export default Parameters;