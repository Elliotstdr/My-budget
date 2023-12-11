import { useState } from "react";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import Box from "../../Utils/Box/Box";
import "./Import.scss";
import { CiImport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import ReturnButton from "../../Utils/ReturnButton/ReturnButton";
import ImportCSV from "../../Components/CImport/ImportCSV/ImportCSV";
import ImportManuel from "../../Components/CImport/ImportManuel/ImportManuel";
import Bouton from "../../Utils/Bouton/Bouton";
import CreateType from "../../Components/CImport/CreateType/CreateType";

const Import = () => {
  const [importType, setImportType] = useState<0 | 1 | 2 | 3>(0)
  const homeStyle = {
    height: "var(--screen-size)",
    justifyContent: "center"
  }

  return (
    <>
      <Header title="Ajouter des opérations"></Header>
      <div className="import page" style={importType === 0 ? homeStyle : {}}>
        {importType !== 0 && <ReturnButton action={() => setImportType(0)}></ReturnButton>}
        {importType === 0 && <div className="import__zero">
          <Box
            text="Import CSV"
            icon={<CiImport></CiImport>}
            action={() => setImportType(1)}
            width="8rem"
          ></Box>
          <Box
            text="Manuel"
            icon={<TbHandClick></TbHandClick>}
            action={() => setImportType(2)}
            width="8rem"
          ></Box>
          <Bouton
            btnTexte="Gérer les types d'opérations"
            btnAction={() => setImportType(3)}
          ></Bouton>
        </div>}
        {importType === 1 && <div className="import__one"><ImportCSV></ImportCSV></div>}
        {importType === 2 && <div className="import__two"><ImportManuel></ImportManuel></div>}
        {importType === 3 && <div className="import__three"><CreateType></CreateType></div>}
      </div>
      <NavBar></NavBar>
    </>
  );
};

export default Import;