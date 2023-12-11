import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import "./Accueil.scss";

const Accueil = () => {
  return (
    <>
      <Header title="Accueil"></Header>
      <div className="accueil page"></div>
      <NavBar></NavBar>
    </>
  );
};

export default Accueil;