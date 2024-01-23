import { useNavigate } from "react-router-dom";

const NoHistoryDisplay = () => {
  const navigate = useNavigate()

  return (
    <span className="main-color px-4 top-1/2 max-[768px]:absolute max-[768px]:translate-y-1/2 md:text-center">
      Ton historique est vide... pour le moment ! <br />
      L'ajout des dépenses c'est par
      <i className="underline cursor-pointer third-color" onClick={() => navigate("/import")}>ici</i> !
    </span>
  );
};

export default NoHistoryDisplay;