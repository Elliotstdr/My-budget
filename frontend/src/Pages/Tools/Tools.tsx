import { useState } from "react";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import Box from "../../Utils/Box/Box";
import "./Tools.scss";
import { RiMoneyEuroCircleLine, RiBankFill } from "react-icons/ri";

const Tools = () => {
  const [toolPage, setToolPage] = useState<0 | 1 | 2>(0)
  const homeStyle = {
    height: "var(--screen-size)",
    justifyContent: "center"
  }
  return (
    <>
      <Header title="Outils"></Header>
      <div className="tools page" style={toolPage === 0 ? homeStyle : {}}>
        {toolPage === 0 && <div className="tools__zero">
          <Box
            text="Salaire brut/net"
            icon={<RiMoneyEuroCircleLine></RiMoneyEuroCircleLine>}
            action={() => setToolPage(1)}
            width="8rem"
          ></Box>
          <Box
            text="Capacité d'emprunt"
            icon={<RiBankFill></RiBankFill>}
            action={() => setToolPage(2)}
            width="8rem"
          ></Box>
        </div>}
      </div>
      <NavBar></NavBar>
    </>
  );
};

export default Tools;