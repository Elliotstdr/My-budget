import NavBar from "../../Components/NavBar/NavBar";
import "./Accueil.scss";
import image from "../../assets/tirelire-blue.png";
import { useSelector } from "react-redux";
import { FaUserCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Box from "../../Utils/Box/Box";
import { RiMoneyEuroCircleLine, RiBankFill } from "react-icons/ri";
import { rangeTiretDate } from "../../Services/functions";
import { fetchPost } from "../../Services/api";
import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, LabelList
} from 'recharts';
import { calculateData } from "../../Services/statistics";

type PieDataItem = {
  name: string,
  value: number
}

const Accueil = () => {
  const navigate = useNavigate()
  const auth = useSelector((state: RootState) => state.auth);
  const [expense, setExpense] = useState(0)
  const [maxExpensePercentage, setMaxExpensePercentage] = useState(0)
  const [pieData, setPieData] = useState<PieDataItem[] | undefined>(undefined)

  useEffect(() => {
    const getCurrentExpense = async () => {
      const payload = rangeTiretDate(new Date)
      if (!payload) return

      const res = await fetchPost(`/operation/byDate`, payload);
      if (res.error) return

      let newExpense = 0

      // On enlève toutes les opérations positives, on ne veut que les dépenses
      const data: Operation[] = res.data.filter((x: Operation) => x.value < 0)
      if (data.length === 0) return

      // La somme de toutes les dépenses est set
      data.forEach((x: Operation) => newExpense += x.value)
      setExpense(Math.abs(newExpense))

      // Récupère un array de PieItem, sans le total et les valeur abs, trié par value
      const calculatedData = calculateData(data)
      let tempPieData: PieDataItem[] = []
      for (const [cle, valeur] of Object.entries(calculatedData[0])) {
        if (cle !== "date" && cle !== "Total") {
          tempPieData.push({ name: cle, value: valeur as number })
        }
      }

      tempPieData = tempPieData.filter((x) => !x.name.includes("-abs"))
      tempPieData.forEach((x) => x.value = Math.abs(x.value))
      tempPieData.sort((a, b) => b.value - a.value)

      // s'il n'y a pas au moins 2 postes de dépenses on return
      if (tempPieData.length < 2) return

      // On récupère la somme de toutes les autres dépenses
      const maxExpense = tempPieData[0]

      // Additione toutes les autres dépenses
      let otherValue = 0
      tempPieData.shift()
      tempPieData.forEach((x) => otherValue += x.value)

      const maxExpensePercentage = Math.round((maxExpense.value / (otherValue + maxExpense.value)) * 100)

      setPieData([maxExpense, { name: "Autre", value: otherValue }])
      setMaxExpensePercentage(maxExpensePercentage)
    }

    getCurrentExpense()
  }, [])

  return (
    <>
      <div className="accueil page">
        <div className="blue--zone">
          <div className="blue--zone__left">
            <img src={image} alt="background home" />
            <div className="blue--zone__left__text">
              <span className="main">{`Bonjour ${auth.userConnected?.username}`}</span>
              <span className="sub">Heureux de te revoir !</span>
            </div>
          </div>
          <div
            className="blue--zone__right"
            onClick={() => navigate("/parameters")}
          >
            <FaUserCog></FaUserCog>
          </div>
        </div>
        <div className="white--zone">
          <span className="main">{`${expense}€`}</span>
          <span className="sub">Cout global du mois</span>
        </div>
        <div className="accueil__body">
          <div className="first">
            <div className="title">Accès rapide</div>
            <div className="accueil__body__boxes">
              <Box
                text="Salaire brut/net"
                icon={<RiMoneyEuroCircleLine></RiMoneyEuroCircleLine>}
                action={() => navigate("/tools/salary")}
                width="8rem"
              ></Box>
              <Box
                text="Capacité d'emprunt"
                icon={<RiBankFill></RiBankFill>}
                action={() => navigate("/tools/loan")}
                width="8rem"
              ></Box>
            </div>
          </div>
          <div className="second">
            <div className="title">Plus grosses dépenses du mois</div>
            {pieData ?
              <div className="accueil__body__pie">
                <PieChart width={300} height={300}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={pieData}
                    fill="#8884d8"
                  >
                    <LabelList
                      dataKey="name"
                      style={{ fontSize: "16px" }}
                      textAnchor="bottom"
                    />
                    {pieData &&
                      <>
                        <Cell key={pieData[0].value} fill="#3e6fd4" />
                        <Cell key={pieData[1].value} fill="#db8bb5" />
                      </>
                    }
                  </Pie>
                </PieChart>
                {pieData && <div style={{ maxWidth: "40%" }}>
                  {`Tu as dépensé ${maxExpensePercentage}% de ton budget dans le poste de dépense "${pieData[0].name}"`}
                </div>}
              </div>
              : <div className="accueil__body__noexpense">
                Tu n'as pas encore saisi de dépenses ce mois ci !
                <span onClick={() => navigate("/import")}>C'est parti ?</span>
              </div>
            }
          </div>
        </div>
      </div>
      <NavBar></NavBar>
    </>
  );
};

export default Accueil;