import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import "./Statistics.scss";
import { useEffect, useState } from "react";
import { useFetchGet } from "../../Services/api";
import { calculateData } from "../../Services/statistics";
import { orderByDate } from "../../Services/functions";
import { useNavigate } from "react-router-dom";
import DetailedStats from "./Components/DetailedStats/DetailedStats";
import SynthesisStats from "./Components/SynthesisStats/SynthesisStats";
import { Divider } from "primereact/divider";
import StatsCalendar from "./Components/StatsCalendar/StatsCalendar";

const Statistics = () => {
  const operationsData = useFetchGet<Operation[]>("/operation")
  const navigate = useNavigate()
  const [data, setData] = useState<CalculatedGroupOP[] | undefined>(undefined)

  // Set des données au début du processus
  useEffect(() => {
    if (operationsData.loaded && operationsData.data) {
      updateData(operationsData.data)
    }
    // eslint-disable-next-line
  }, [operationsData.loaded])

  // Sous-fonction qui ordonne par date et formatte la donnée pour créer la donnée finale
  const updateData = (data: Operation[]) => {
    const newData = orderByDate(data)
    const calculatedData = calculateData(newData)
    setData(calculatedData)
  }

  return (
    <>
      <Header title="Statistiques"></Header>
      <div className="statistics page">
        <StatsCalendar
          operationsData={operationsData.data}
          updateData={(items: Operation[]) => updateData(items)}
        ></StatsCalendar>
        {operationsData.loaded && operationsData.data!.length > 0 && data && data.length > 0 ?
          <>
            <SynthesisStats data={data}></SynthesisStats>
            <Divider></Divider>
            <DetailedStats data={data}></DetailedStats>
          </>
          : <span className="empty">
            N'ayant pas encore de dépenses renseignées, je n'ai pas de statistiques à afficher ! <br />
            Je t'invite à rentrer tes prémières dépenses <i onClick={() => navigate("/import")}>ici</i> !
          </span>
        }
      </div>
      <NavBar></NavBar>
    </>
  );
};

export default Statistics;