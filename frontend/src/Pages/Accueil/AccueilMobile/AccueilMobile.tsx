import "./AccueilMobile.scss";
import image from "../../../assets/tirelire-blue.png";
import { FaUserCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Box from "../../../Components/UI/Box/Box";
import { RiMoneyEuroCircleLine, RiBankFill } from "react-icons/ri";
import PieAccueil from "../../../Components/CAccueil/PieAccueil/PieAccueil";
import { useSelector } from "react-redux";

const AccueilMobile = () => {
  const navigate = useNavigate()
  const auth = useSelector((state: RootState) => state.auth);
  const dashboard = useSelector((state: RootState) => state.dashboard);

  return (
    <div className="accueil page">
      <div className="blue--zone">
        <div className="blue--zone__left">
          <img src={image} alt="background home" />
          <div className="blue--zone__left__text">
            <span className="main">{`Bonjour ${auth.userConnected?.username || ''}`}</span>
            <span className="sub">Heureux de te revoir !</span>
          </div>
        </div>
        <div
          className="blue--zone__right"
          onClick={() => navigate("/parameters")}
        >
          <FaUserCog></FaUserCog>
        </div>
      </div>
      <div className="white--zone white-block">
        <span className="main">{`${dashboard.newExpense}€`}</span>
        <span className="sub">dépensés ce mois ci !</span>
      </div>
      <div className="accueil__body">
        <div className="first">
          <div className="title">Accès rapide</div>
          <div className="accueil__body__boxes">
            <Box
              text="Salaire brut/net"
              icon={<RiMoneyEuroCircleLine></RiMoneyEuroCircleLine>}
              action={() => navigate("/tools/salary")}
              width="8rem"
            ></Box>
            <Box
              text="Capacité d'emprunt"
              icon={<RiBankFill></RiBankFill>}
              action={() => navigate("/tools/loan")}
              width="8rem"
            ></Box>
          </div>
        </div>
        <PieAccueil></PieAccueil>
      </div>
    </div>
  );
};

export default AccueilMobile;