import SalaryContainer from "./SalaryContainer";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";

const Salary = () => {
  return (
    <>
      <Header title="Mon salaire"></Header>
      <SalaryContainer></SalaryContainer>
      <NavBar></NavBar>
    </>
  );
};

export default Salary;