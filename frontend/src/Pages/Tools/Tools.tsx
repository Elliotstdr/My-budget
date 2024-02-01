import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import Box from "../../Components/UI/Box/Box";
import "./Tools.scss";
import { RiMoneyEuroCircleLine, RiBankFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import image from "src/assets/tirelire-blue.png";
import { Divider } from "primereact/divider";
import Salary from "../Tools_Salary/Salary";
import { useScreenSize } from "../../Services/useScreenSize";
import Loan from "../Tools_Loan/Loan";

const Tools = () => {
  const navigate = useNavigate()
  const windowSize = useScreenSize()

  return (
    <>
      <Header title="Outils"></Header>
      <div className="tools page">
        {windowSize.width < 900 ?
          <>
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
          </>
          : <>
            <Loan isDesktop></Loan>
            <Divider></Divider>
            <Salary isDesktop></Salary>
          </>
        }
      </div>
      <NavBar></NavBar>
    </>
  );
};

export default Tools;