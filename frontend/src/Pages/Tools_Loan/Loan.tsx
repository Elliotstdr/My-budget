import LoanContainer from "./LoanContainer";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";

const Loan = () => {
  return (
    <>
      <Header title="Mon emprunt"></Header>
      <LoanContainer></LoanContainer>
      <NavBar></NavBar>
    </>
  );
};

export default Loan;