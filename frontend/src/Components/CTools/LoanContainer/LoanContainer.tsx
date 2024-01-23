import { useEffect, useState } from "react";
import "./LoanContainer.scss";
import { Slider } from 'primereact/slider';
import { calculateLoan, loanStartData } from "../../../Services/tools";
import ReturnButton from "../../UI/ReturnButton/ReturnButton";
import { useNavigate } from "react-router-dom";
import LoanGraph from "./LoanGraph/LoanGraph";

interface Props {
  isDesktop?: boolean
}

const LoanContainer = (props: Props) => {
  const navigate = useNavigate()
  const [capital, setCapital] = useState(100000)
  const [time, setTime] = useState(15)
  const [interest, setInterest] = useState(5)
  const [monthCost, setMonthCost] = useState(0)
  const [fullCost, setFullCost] = useState(0)
  const [data, setData] = useState<LoanElement[] | undefined>(undefined)

  useEffect(() => {
    const loan = calculateLoan(capital, time, interest)
    setMonthCost(loan[0])
    setFullCost(loan[1])

    const startData = loanStartData(capital, interest)

    if (!startData.some((x) => x.temps === time)) {
      startData.push({
        temps: time, value: loan[0], cost: loan[1]
      })
    }

    setData(startData.sort((a, b) => a.temps - b.temps))
  }, [capital, time, interest])

  return (
    <div className='loan'>
      {props.isDesktop && <h1 className="loan__title">Capacité d'emprunt</h1>}
      {!props.isDesktop && <ReturnButton action={() => navigate("/tools")}></ReturnButton>}
      <div className="loan__top">
        <div className="loan__capital label">
          <span>J'emprunte :</span>
          <span className="important">{capital}€</span>
        </div>
        <Slider
          value={capital}
          onChange={(e) => setCapital(e.value as number)}
          min={5000}
          max={1000000}
          step={5000}
        ></Slider>
        <div className="loan__top__time label">
          <span>Durée :</span>
          <span className="important">{time}{time === 1 ? "an" : "ans"}</span>
        </div>
        <Slider
          value={time}
          onChange={(e) => setTime(e.value as number)}
          min={1}
          max={25}
          step={1}
        ></Slider>
        <div className="loan__top__interest label">
          <span>Taux d'intérêt :</span>
          <span className="important">{interest}%</span>
        </div>
        <Slider
          value={interest}
          onChange={(e) => setInterest(e.value as number)}
          min={0}
          max={10}
          step={0.02}
        ></Slider>
        <div className="loan__top__result">
          <div className="loan__top__result__month label">
            <span>Votre mensualité</span>
            <span className="important">{monthCost}€</span>
          </div>
          <div className="loan__top__result__cost label">
            <span>Coût total de l'emprunt</span>
            <span className="important">{fullCost}€</span>
          </div>
        </div>
      </div>
      <LoanGraph data={data}></LoanGraph>
    </div>
  );
};

export default LoanContainer;