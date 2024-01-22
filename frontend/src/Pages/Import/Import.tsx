import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import { useScreenSize } from "../../Services/useScreenSize";
import ImportDesktop from "./ImportDesktop/ImportDesktop";
import ImportMobile from "./ImportMobile/ImportMobile";

const Import = () => {
  const windowSize = useScreenSize()

  return (
    <>
      <Header title="Importer"></Header>
      {windowSize.width < 1000
        ? <ImportMobile></ImportMobile>
        : <ImportDesktop></ImportDesktop>
      }
      <NavBar></NavBar>
    </>
  );
};

export default Import;