import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import "./Statistics.scss";
import { useEffect, useState } from "react";
import { useFetchGet } from "../../Services/api";
import { calculateData, getSynthesisData, toAbsolute } from "../../Services/statistics";
import { orderByDate } from "../../Services/functions";
import { SelectButton } from 'primereact/selectbutton';
import Bouton from "../../Utils/Bouton/Bouton";
import { useNavigate } from "react-router-dom";
import DetailedStats from "../../Components/CStatistics/DetailedStats";
import SynthesisStats from "../../Components/CStatistics/SynthesisStats";
import { Divider } from "primereact/divider";
import StatsCalendar from "../../Components/CStatistics/StatsCalendar";

const Statistics = () => {
  const items = [
    { name: 'Barres', value: 1 },
    { name: 'Lignes', value: 2 },
    { name: 'Camembert', value: 3 }
  ];

  const operationsData = useFetchGet<Operation[]>("/operation")
  const navigate = useNavigate()
  const [data, setData] = useState<CalculatedGroupOP[] | undefined>(undefined)
  const [synthesisData, setSynthesisData] = useState<SynthesisData[] | undefined>(undefined)
  const [finalData, setFinalData] = useState<CalculatedGroupOP[] | undefined>(undefined)
  const [value, setValue] = useState<1 | 2 | 3>(1);
  const [legends, setLegends] = useState<Legends | null>(null);
  const [pieData, setPieData] = useState<PieDataItem[] | undefined>(undefined)
  const [absolute, setAbsolute] = useState(true)

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

  // Change la valeur en fonction de si on est en valeur absolue ou relative
  useEffect(() => {
    if (!data) return

    setFinalData(absolute ? toAbsolute(data) : data)

    const synth = getSynthesisData(data)
    setSynthesisData(synth)
  }, [data, absolute])

  // Si la data a une taille 1 = Un seul mois sélectionné on ajout le pie
  useEffect(() => {
    if (pieData && data?.length !== 1) {
      setValue(1)
    }
    if (!data || data.length !== 1) {
      setPieData(undefined)
      return
    }
    const tempPieData: PieDataItem[] = []
    for (const [cle, valeur] of Object.entries(data[0])) {
      if (cle !== "date" && cle !== "Total") {
        tempPieData.push({ name: cle, value: valeur as number })
      }
    }
    tempPieData.sort((a, b) => b.value - a.value)
    tempPieData.forEach((x) => x.value = Math.abs(x.value))
    setValue(3)
    setPieData(tempPieData)
    // eslint-disable-next-line
  }, [data])

  return (
    <>
      <Header title="Statistiques"></Header>
      <div className="statistics page">
        <StatsCalendar
          operationsData={operationsData.data}
          updateData={(items: Operation[]) => updateData(items)}
        ></StatsCalendar>
        {synthesisData && finalData && finalData?.length > 0 ?
          <>
            <span className="titre first">Graphique de synthèse</span>
            <SynthesisStats synthesisData={synthesisData}></SynthesisStats>
            <Divider></Divider>
            <SelectButton
              value={value}
              onChange={(e) => setValue(e.value)}
              optionLabel="name"
              options={pieData ? items : items.filter((x) => x.value !== 3)}
            />
            <span className="titre second">Graphique détaillé</span>
            <DetailedStats
              pieData={pieData}
              finalData={finalData}
              value={value}
              legends={legends}
              setLegends={setLegends}
            ></DetailedStats>
            <div className="statistics__buttons">
              <Bouton
                btnTexte="Activer tout"
                btnAction={() => {
                  const item = { ...legends }
                  Object.keys(item).forEach(key => { item[key] = false });
                  item.hover = null
                  setLegends(item as Legends)
                }}
              ></Bouton>
              <Bouton
                btnTexte={absolute ? "Valeur relative" : "Valeur absolue"}
                btnAction={() => setAbsolute(!absolute)}
              // color="pink"
              ></Bouton>
            </div>
          </>
          : operationsData.loaded && finalData?.length === 0 && <span className="empty">
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