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
    <div className="accueil__desktop page p-0 main-color bg-gray-50">
      <div
        className="w-full h-80 bg-no-repeat bg-cover flex justify-center items-center"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${Accueil1})` }}
      >
        <div className="flex flex-col items-center">
          <img className="z-40 w-24" src={image} alt="" />
          <div className="white-block mt-[-1.25rem] py-4 px-32">
            <div className='font-bold text-[2rem]'>{`Bonjour ${auth.userConnected?.username},`}</div>
            <span className='font-bold text-xl'>Heureux de te revoir !</span>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full p-8 gap-16">
        <div className="white-block shadow-lg rounded-lg w-1/2 py-8 px-20">
          <div className="mb-2 text-xl">Fais le point sur tes dépenses du mois </div>
          <span className="text-3xl">{`${dashboard.newExpense}€`}</span>
          <span className="text-xl">dépensés ce mois ci !</span>
          <Bouton
            btnTexte="Accéder aux statistiques"
            btnAction={() => navigate("/statistics")}
            color="pink"
            className='mt-4 text-base py-2 px-4 w-fit'
          ></Bouton>
        </div>
        <div className="flex flex-col items-center w-1/2 gap-4">
          <div className="font-bold">Accès rapide</div>
          <div className="flex flex-col items-center gap-4 text-white w-11/12">
            <Box
              text="Import fichier"
              icon={<CiImport style={{ fontSize: "2rem" }}></CiImport>}
              action={() => navigate("/import/csv")}
              width="100%"
              height="120px"
            ></Box>
            <Box
              text="Saisie manuelle"
              icon={<TbHandClick style={{ fontSize: "2rem" }}></TbHandClick>}
              action={() => navigate("/import/manual")}
              width="100%"
              height="120px"
            ></Box>
          </div>
        </div>
      </div>
      <div className="m-8 min-w-[768px] w-10/12 rounded-2xl bg-repeat bg-cover p-8" style={{ backgroundImage: `url(${Accueil2})` }}>
        <PieAccueil></PieAccueil>
      </div>
    </div>
  );
};

export default AccueilDesktop;