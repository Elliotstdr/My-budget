import { useEffect, useState } from "react";
import Header from "../../Header/Header";
import NavBar from "../../NavBar/NavBar";
import "./Loan.scss";
import { Slider } from 'primereact/slider';
import { calculateLoan } from "../../../Services/tools";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import ReturnButton from "../../../Utils/ReturnButton/ReturnButton";
import { useNavigate } from "react-router-dom";

type dataElement = {
  temps: number,
  value: number,
  cost: number
}

interface Props {
  isComponent?: boolean
}

const Loan = (props: Props) => {
  const navigate = useNavigate()
  const [capital, setCapital] = useState(100000)
  const [time, setTime] = useState(15)
  const [interest, setInterest] = useState(5)
  const [monthCost, setMonthCost] = useState(0)
  const [fullCost, setFullCost] = useState(0)
  const [data, setData] = useState<dataElement[] | undefined>(undefined)

  useEffect(() => {
    const loan = calculateLoan(capital, time, interest)
    setMonthCost(loan[0])
    setFullCost(loan[1])

    const loan5 = calculateLoan(capital, 5, interest)
    const loan10 = calculateLoan(capital, 10, interest)
    const loan15 = calculateLoan(capital, 15, interest)
    const loan20 = calculateLoan(capital, 20, interest)
    const loan25 = calculateLoan(capital, 25, interest)

    const startData = [
      {
        temps: 5,
        value: loan5[0],
        cost: loan5[1]
      },
      {
        temps: 10,
        value: loan10[0],
        cost: loan10[1]
      },
      {
        temps: 15,
        value: loan15[0],
        cost: loan15[1]
      },
      {
        temps: 20,
        value: loan20[0],
        cost: loan20[1]
      },
      {
        temps: 25,
        value: loan25[0],
        cost: loan25[1]
      }
    ]

    if (!startData.some((x) => x.temps === time)) {
      startData.push({
        temps: time, value: loan[0], cost: loan[1]
      })
    }

    setData(startData.sort((a, b) => a.temps - b.temps))
  }, [capital, time, interest])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <span>Durée : {`${label} ${label > 1 ? "ans" : "an"}`}</span>
          <span>Mensualités : {`${payload[1].value}€`}</span>
          <span>Coût : {`${payload[0].value}€`}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {!props.isComponent && <Header title="Mon emprunt"></Header>}
      <div className='loan'>
        {!props.isComponent && <ReturnButton action={() => navigate("/tools")}></ReturnButton>}
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
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="temps" padding={{ left: 10, right: 10 }} />
            <YAxis padding={{ bottom: 10, top: 10 }} dataKey="value" yAxisId={1} />
            <YAxis dataKey="cost" yAxisId={2} orientation="right" />
            <Tooltip content={CustomTooltip} />
            <Legend />
            <Bar
              dataKey="cost"
              yAxisId={2}
              fillOpacity={0.4}
              fill="var(--third-color)"
              name="coût total"
            />
            <Line
              type="monotone"
              dataKey="value"
              yAxisId={1}
              strokeWidth={3}
              stroke="#6366F1"
              name="mensualités"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {!props.isComponent && <NavBar></NavBar>}
    </>
  );
};

export default Loan;