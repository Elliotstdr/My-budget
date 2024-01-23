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
    <div className="page overflow-hidden relative">
      <div className="w-full rounded-b-[10%] min-h-32 flex items-center justify-between px-6 main-bg">
        <div className="flex gap-4 mb-4 items-center">
          <img className="w-14" src={image} alt="background home" />
          <div className="flex flex-col font-bold">
            <span className="text-2xl">{`Bonjour ${auth.userConnected?.username || ''}`}</span>
            <span className="text-base">Heureux de te revoir !</span>
          </div>
        </div>
        <div
          className="h-6 mb-4"
          onClick={() => navigate("/parameters")}
        >
          <FaUserCog style={{ cursor: 'pointer', fontSize: "1.5rem" }}></FaUserCog>
        </div>
      </div>
      <div className="white-block w-80 top-24 shadow-lg absolute h-32">
        <span className="text-3xl">{`${dashboard.newExpense}€`}</span>
        <span className="text-xl">dépensés ce mois ci !</span>
      </div>
      <div className="accueil__body flex flex-col px-6 w-full main-color mt-28">
        <div className="first">
          <div className="title my-2 text-base font-[500]">Accès rapide</div>
          <div className="text-white flex justify-center gap-4 mb-4">
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