import { useEffect, useState } from "react";
import "./Loan.scss";
import { Slider } from 'primereact/slider';
import { calculateLoan, loanStartData } from "../../Services/tools";
import ReturnButton from "../../Components/UI/ReturnButton/ReturnButton";
import { useNavigate } from "react-router-dom";
import LoanGraph from "./Components/LoanGraph";
import { useSelector } from "react-redux";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import { updateLoan } from "../../Store/Actions/loanActions";

interface Props {
  isDesktop?: boolean
}

const LoanContainer = (props: Props) => {
  const navigate = useNavigate()
  const loan = useSelector((state: RootState) => state.loan);
  const [data, setData] = useState<LoanElement[] | undefined>(undefined)

  useEffect(() => {
    const calculatedLoan = calculateLoan(loan.capital, loan.time, loan.interest)
    updateLoan({
      monthCost: calculatedLoan[0],
      fullCost: calculatedLoan[1]
    })

    const startData = loanStartData(loan.capital, loan.interest)

    if (!startData.some((x) => x.temps === loan.time)) {
      startData.push({
        temps: loan.time, value: calculatedLoan[0], cost: calculatedLoan[1]
      })
    }

    setData(startData.sort((a, b) => a.temps - b.temps))
    // eslint-disable-next-line
  }, [loan.capital, loan.time, loan.interest])

  return (
    <>
      {!props.isDesktop && <Header title="Mon emprunt"></Header>}
      <div className='loan'>
        {props.isDesktop && <h1 className="loan__title">Capacité d'emprunt</h1>}
        {!props.isDesktop && <ReturnButton action={() => navigate("/tools")}></ReturnButton>}
        <div className="loan__top">
          <div className="loan__capital label">
            <span>J'emprunte :</span>
            <span className="important">{loan.capital}€</span>
          </div>
          <Slider
            value={loan.capital}
            onChange={(e) => updateLoan({ capital: e.value as number })}
            min={5000}
            max={1000000}
            step={5000}
          ></Slider>
          <div className="loan__top__time label">
            <span>Durée :</span>
            <span className="important">{loan.time}{loan.time === 1 ? "an" : "ans"}</span>
          </div>
          <Slider
            value={loan.time}
            onChange={(e) => updateLoan({ time: e.value as number })}
            min={1}
            max={25}
            step={1}
          ></Slider>
          <div className="loan__top__interest label">
            <span>Taux d'intérêt :</span>
            <span className="important">{loan.interest}%</span>
          </div>
          <Slider
            value={loan.interest}
            onChange={(e) => updateLoan({ interest: e.value as number })}
            min={0}
            max={10}
            step={0.02}
          ></Slider>
          <div className="loan__top__result">
            <div className="loan__top__result__month label">
              <span>Votre mensualité</span>
              <span className="important">{loan.monthCost}€</span>
            </div>
            <div className="loan__top__result__cost label">
              <span>Coût total de l'emprunt</span>
              <span className="important">{loan.fullCost}€</span>
            </div>
          </div>
        </div>
        <LoanGraph data={data}></LoanGraph>
      </div>
      {!props.isDesktop && <NavBar></NavBar>}
    </>
  );
};

export default LoanContainer;