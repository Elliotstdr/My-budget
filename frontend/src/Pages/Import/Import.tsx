import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import Box from "../../Utils/Box/Box";
import "./Import.scss";
import { CiImport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import Bouton from "../../Utils/Bouton/Bouton";
import { useNavigate } from "react-router-dom";
import image from "../../assets/tirelire-blue.png";

const Import = () => {
  const navigate = useNavigate()

  return (
    <>
      <Header title="Importer"></Header>
      <div className="import page">
        <div className="import__top">
          <img src={image} alt="background home" />
          <span className="text">Ajoute des opérations pour suivre l’évolution des tes dépenses</span>
        </div>
        <span className="title">Choisis ton mode d’import</span>
        <div className="boxes">
          <Box
            text="Import fichier"
            icon={<CiImport></CiImport>}
            action={() => navigate("/import/csv")}
            width="9rem"
            height="9rem"
          ></Box>
          <Box
            text="Saisie manuelle"
            icon={<TbHandClick></TbHandClick>}
            action={() => navigate("/import/manual")}
            width="9rem"
            height="9rem"
          ></Box>
        </div>
        <span className="title">Gestion des opérations</span>
        <Bouton
          btnTexte="Gérer les types d'opérations"
          btnAction={() => navigate("/import/type")}
          color="pink"
          style={{ fontSize: "1.1rem" }}
        ></Bouton>
      </div>
      <NavBar></NavBar>
    </>
  );
};

export default Import;