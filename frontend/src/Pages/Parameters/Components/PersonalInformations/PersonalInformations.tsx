import { Divider } from "primereact/divider";
import EditInfos from "./ParamForms/EditInfos";
import EditPassword from "./ParamForms/EditPassword";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateAuth } from "../../../../Store/Reducers/authReducer";

const PersonalInformations = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div className='parametersInfos'>
      <div
        className="parameters__logout"
        onClick={() => {
          dispatch(updateAuth({
            isConnected: false,
            token: null,
            userConnected: null,
            newLogTime: null,
          }))
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