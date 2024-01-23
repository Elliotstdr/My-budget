import './AccueilDesktop.scss'
import image from "../../../assets/tirelire-blue.png";
import { useNavigate } from "react-router-dom";
import Box from "../../../Components/UI/Box/Box";
import { CiImport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import Accueil1 from "../../../assets/Accueil1.jpg"
import Accueil2 from "../../../assets/Accueil2.png"
import Bouton from "../../../Components/UI/Bouton/Bouton";
import PieAccueil from "../../../Components/CAccueil/PieAccueil/PieAccueil";
import { useSelector } from 'react-redux';

const AccueilDesktop = () => {
  const navigate = useNavigate()
  const auth = useSelector((state: RootState) => state.auth);
  const dashboard = useSelector((state: RootState) => state.dashboard);

  return (
    <div className="accueil__desktop page">
      <div
        className="accueil__desktop__bandeau"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${Accueil1})` }}
      >
        <div className="accueil__desktop__bandeau__encart">
          <img className="logo" src={image} alt="" />
          <div className="block white-block">
            <div>{`Bonjour ${auth.userConnected?.username},`}</div>
            <span>Heureux de te revoir !</span>
          </div>
        </div>
      </div>
      <div className="accueil__desktop__body">
        <div className="white--zone white-block">
          <div className="sentence">Fais le point sur tes dépenses du mois </div>
          <span className="main">{`${dashboard.newExpense}€`}</span>
          <span className="sub">dépensés ce mois ci !</span>
          <Bouton
            btnTexte="Accéder aux statistiques"
            btnAction={() => navigate("/statistics")}
            color="pink"
          ></Bouton>
        </div>
        <div className="accueil__desktop__body__right">
          <div className="title">Accès rapide</div>
          <div className="accueil__desktop__body__right__boxes">
            <Box
              text="Import fichier"
              icon={<CiImport></CiImport>}
              action={() => navigate("/import/csv")}
              width="100%"
              height="120px"
            ></Box>
            <Box
              text="Saisie manuelle"
              icon={<TbHandClick></TbHandClick>}
              action={() => navigate("/import/manual")}
              width="100%"
              height="120px"
            ></Box>
          </div>
        </div>
      </div>
      <div className="accueil__desktop__bottom" style={{ backgroundImage: `url(${Accueil2})` }}>
        <PieAccueil></PieAccueil>
      </div>
    </div>
  );
};

export default AccueilDesktop;