import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import Box from "../../Utils/Box/Box";
import "./Tools.scss";
import { RiMoneyEuroCircleLine, RiBankFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Tools = () => {
  const navigate = useNavigate()
  return (
    <>
      <Header title="Outils"></Header>
      <div className="tools page">
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
      <NavBar></NavBar>
    </>
  );
};

export default Tools;