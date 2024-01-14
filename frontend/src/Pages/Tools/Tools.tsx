import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import Box from "../../Utils/Box/Box";
import "./Tools.scss";
import { RiMoneyEuroCircleLine, RiBankFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import image from "../../assets/tirelire-blue.png";
import Loan from "../../Components/CTools/Loan/Loan";
import Salary from "../../Components/CTools/Salary/Salary";
import { Divider } from "primereact/divider";

const Tools = () => {
  const navigate = useNavigate()
  return (
    <>
      <Header title="Outils"></Header>
      <div className="tools page">
        <div className="tools__top">
          <img src={image} alt="background home" />
          <span className="text">Quelques outils pour faire tes calculs et mieux gérer ton budget !</span>
        </div>
        <Box
          text="Salaire brut/net"
          icon={<RiMoneyEuroCircleLine></RiMoneyEuroCircleLine>}
          action={() => navigate("/tools/salary")}
          width="9rem"
          height="9rem"
        ></Box>
        <Box
          text="Capacité d'emprunt"
          icon={<RiBankFill></RiBankFill>}
          action={() => navigate("/tools/loan")}
          width="9rem"
          height="9rem"
        ></Box>
        <Loan isComponent></Loan>
        <Divider></Divider>
        <Salary isComponent></Salary>
      </div>
      <NavBar></NavBar>
    </>
  );
};

export default Tools;