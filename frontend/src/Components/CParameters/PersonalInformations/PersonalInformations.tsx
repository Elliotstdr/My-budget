import { Divider } from "primereact/divider";
import EditInfos from "./ParamForms/EditInfos";
import EditPassword from "./ParamForms/EditPassword";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { UPDATE_AUTH } from "../../../Store/Reducers/authReducer";

const PersonalInformations = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const updateAuth = (value: Partial<AuthState>) => {
    dispatch({ type: UPDATE_AUTH, value });
  };

  return (
    <div className='parametersInfos'>
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
    </div>
  );
};

export default PersonalInformations;