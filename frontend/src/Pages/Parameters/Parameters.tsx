import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import "./Parameters.scss";
import { useEffect, useState } from "react";
import { Divider } from "primereact/divider";
import EditInfos from "../../Components/CParameters/Params/EditInfos";
import EditPassword from "../../Components/CParameters/Params/EditPassword";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { UPDATE_AUTH } from "../../Store/Reducers/authReducer";
import { SelectButton } from "primereact/selectbutton";
import Debt from "../../Components/CParameters/Debt/Debt";
import Goal from "../../Components/CParameters/Goal/Goal";

const Parameters = () => {
  const items = [
    { name: 'Paramètres', value: 1 },
    { name: 'Créances', value: 2 },
    { name: 'Objectifs', value: 3 }
  ];

  const [value, setValue] = useState<1 | 2 | 3>(1);
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
        <SelectButton
          value={value}
          onChange={(e) => e.value && setValue(e.value)}
          optionLabel="name"
          options={items}
        />
        {value === 1 && <>
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
            }}>Se déconnecter
          </div>
          <EditInfos></EditInfos>
          <Divider></Divider>
          <EditPassword></EditPassword>
        </>}
        {value === 2 && <Debt></Debt>}
        {value === 3 && <Goal></Goal>}
      </div>
      <NavBar></NavBar>
    </>
  );
};

export default Parameters;