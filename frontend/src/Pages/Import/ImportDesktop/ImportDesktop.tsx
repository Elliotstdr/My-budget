import './ImportDesktop.scss'
import Box from "../../../Components/UI/Box/Box";
import { CiImport } from "react-icons/ci";
import { TbHandClick } from "react-icons/tb";
import Bouton from "../../../Components/UI/Bouton/Bouton";
import { useNavigate } from "react-router-dom";
import Import1 from "src/assets/Import4.jpg"
import Import2 from "src/assets/Import2.png"
import { useState } from "react";
import Modal from "../../../Components/UI/Modal/Modal";
import CreateTypeContainer from '../../Import_Types/CreateTypeContainer';

const ImportDesktop = () => {
  const navigate = useNavigate()
  const [visibleTypes, setVisibleTypes] = useState(false)

  return (
    <div className="import__desktop page desktop">
      <div className="import__desktop__top">
        <div className="import__desktop__top__left" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(${Import1})` }}>
          <div className="white-zone white-block">
            <div>Importer</div>
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
              width="25rem"
              height="6rem"
            ></Box>
            <Box
              text="Saisie manuelle"
              icon={<TbHandClick></TbHandClick>}
              action={() => navigate("/import/manual")}
              width="25rem"
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
            btnAction={() => setVisibleTypes(true)}
            color="pink"
            style={{ fontSize: "1.1rem" }}
          ></Bouton>
        </div>
        <div className="import__desktop__bottom__right" style={{ backgroundImage: `url(${Import2})` }}>
        </div>
      </div>
      {visibleTypes &&
        <Modal
          visible={visibleTypes}
          setVisible={setVisibleTypes}
          className="modal-types"
          header="Mes types"
          closable
        >
          <CreateTypeContainer></CreateTypeContainer>
        </Modal>}
    </div >
  );
};

export default ImportDesktop;