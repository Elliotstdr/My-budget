import { Divider } from "primereact/divider";
import EditInfos from "./ParamForms/EditInfos";
import EditPassword from "./ParamForms/EditPassword";
import { useNavigate } from "react-router-dom";
import { updateAuth } from "../../../../Store/Actions/authActions";

const PersonalInformations = () => {
  const navigate = useNavigate()

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