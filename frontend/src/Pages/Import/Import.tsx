import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import Box from "../../Utils/Box/Box";
import "./Import.scss";
import { CiImport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import Bouton from "../../Utils/Bouton/Bouton";
import { useNavigate } from "react-router-dom";

const Import = () => {
  const navigate = useNavigate()

  return (
    <>
      <Header title="Ajouter des opérations"></Header>
      <div className="import page" style={{ height: "var(--screen-size)", justifyContent: "center" }}>
        <Box
          text="Import CSV"
          icon={<CiImport></CiImport>}
          action={() => navigate("/import/csv")}
          width="8rem"
        ></Box>
        <Box
          text="Manuel"
          icon={<TbHandClick></TbHandClick>}
          action={() => navigate("/import/manual")}
          width="8rem"
        ></Box>
        <Bouton
          btnTexte="Gérer les types d'opérations"
          btnAction={() => navigate("/import/type")}
        ></Bouton>
      </div>
      <NavBar></NavBar>
    </>
  );
};

export default Import;