import "./RedirectionCardDesktop.scss";
import Import3 from "src/assets/Import3.jpg"
import Bouton from "../../../../Components/UI/Bouton/Bouton";
import { useNavigate } from "react-router-dom";

const RedirectionCardDesktop = () => {
  const navigate = useNavigate()

  return (
    <div
      className="history__calendar__desktop"
      style={{ backgroundImage: `url(${Import3})`, display: "none" }}
    >
      <div className="history__calendar__desktop__child">
        <span className="title">Importer de nouvelles opérations !</span>
        <Bouton
          btnTexte="Mes opérations"
          btnAction={() => navigate("/import")}
          color="pink"
          style={{ fontSize: "1.1rem" }}
        ></Bouton>
      </div>
    </div>
  );
};

export default RedirectionCardDesktop;