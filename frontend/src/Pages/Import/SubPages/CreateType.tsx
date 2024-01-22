import CreateTypeContainer from "../../../Components/CImport/CreateTypeContainer/CreateTypeContainer";
import Header from "../../../Components/Header/Header";
import NavBar from "../../../Components/NavBar/NavBar";

const CreateType = () => {
  return (
    <>
      <Header title="Mes types"></Header>
      <CreateTypeContainer></CreateTypeContainer>
      <NavBar></NavBar>
    </>
  );
};

export default CreateType;