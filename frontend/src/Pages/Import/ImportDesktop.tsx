import Box from "../../Utils/Box/Box";
import { CiImport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import Bouton from "../../Utils/Bouton/Bouton";
import { useNavigate } from "react-router-dom";
import Import1 from "../../assets/Import1.png"
import Import2 from "../../assets/Import2.png"

const ImportDesktop = () => {
  const navigate = useNavigate()

  return (
    <div className="import__desktop page desktop">
      <div className="import__desktop__top">
        <div className="import__desktop__top__left" style={{ backgroundImage: `url(${Import1})` }}>
          <div className="white-zone">
            <div>Impoter</div>
            <span>Ajoute des opérations pour suivre l’évolution des tes dépenses</span>
          </div>
        </div>
        <div className="import__desktop__top__right">
          <span className="title">Choisis ton mode d’import</span>
          <div className="boxes">
            <Box
              text="Import fichier"
              icon={<CiImport></CiImport>}
              action={() => navigate("/import/csv")}
              width="20rem"
              height="6rem"
            ></Box>
            <Box
              text="Saisie manuelle"
              icon={<TbHandClick></TbHandClick>}
              action={() => navigate("/import/manual")}
              width="20rem"
              height="6rem"
            ></Box>
          </div>
        </div>
      </div>
      <div className="import__desktop__bottom">
        <div className="import__desktop__bottom__left">
          <span className="title">Gestion des opérations</span>
          <span>Leo quorum me quod necem scrutabatur Gallus Gallus</span>
          <Bouton
            btnTexte="Gérer les types d'opérations"
            btnAction={() => navigate("/import/type")}
            color="pink"
            style={{ fontSize: "1.1rem" }}
          ></Bouton>
        </div>
        <div className="import__desktop__bottom__right" style={{ backgroundImage: `url(${Import2})` }}>
        </div>
      </div>
    </div >
  );
};

export default ImportDesktop;