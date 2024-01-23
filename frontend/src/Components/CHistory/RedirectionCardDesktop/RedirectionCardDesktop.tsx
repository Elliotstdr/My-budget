import Import3 from "../../../assets/Import3.jpg"
import Bouton from "../../UI/Bouton/Bouton";
import { useNavigate } from "react-router-dom";

const RedirectionCardDesktop = () => {
  const navigate = useNavigate()

  return (
    <div
      className="hidden md:flex shadow-lg rounded-2xl h-72 w-full max-w-[600px] mt-4 relative bg-cover"
      style={{ backgroundImage: `url(${Import3})` }}
    >
      <div className="absolute-center bg-white flex flex-col text-center gap-4 py-4 px-12 rounded-2xl w-80">
        <span className="font-bold text-xl">Importer de nouvelles opérations !</span>
        <Bouton
          btnTexte="Mes opérations"
          btnAction={() => navigate("/import")}
          color="pink"
          style={{ fontSize: "1.1rem" }}
        ></Bouton>
      </div>
    </div>
  );
};

export default RedirectionCardDesktop;