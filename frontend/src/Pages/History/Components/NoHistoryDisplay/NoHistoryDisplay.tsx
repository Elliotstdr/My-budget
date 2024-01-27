import { useNavigate } from "react-router-dom";
import './NoHistoryDisplay.scss'

const NoHistoryDisplay = () => {
  const navigate = useNavigate()

  return (
    <span className="empty">
      Ton historique est vide... pour le moment ! <br />
      L'ajout des dépenses c'est par <i onClick={() => navigate("/import")}>ici</i> !
    </span>
  );
};

export default NoHistoryDisplay;