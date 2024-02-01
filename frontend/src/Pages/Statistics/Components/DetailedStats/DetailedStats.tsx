import { SelectButton } from 'primereact/selectbutton';
import Bouton from "../../../../Components/UI/Bouton/Bouton";
import { useEffect, useState } from "react";
import { toAbsolute } from "../../../../Services/statistics";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_STATS } from "../../../../Store/Reducers/statsReducer";
import { activeAllLegends, checkIfStillShowAll, initializeLegends } from "../../../../Services/legends";
import { useScreenSize } from "../../../../Services/useScreenSize";
import { ResponsiveContainer } from "recharts";
import PieGraph from "./PieGraph";
import LineGraph from "./LineGraph";
import BarGraph from "./BarGraph";

type Props = {
  data: CalculatedGroupOP[] | undefined
}
const DetailedStats = (props: Props) => {
  const items = [
    { name: 'Barres', value: 1 },
    { name: 'Lignes', value: 2 },
    { name: 'Camembert', value: 3 }
  ];

  const windowSize = useScreenSize()
  const stats = useSelector((state: RootState) => state.stats);
  const dispatch = useDispatch();
  const updateStats = (value: Partial<StatsState>) => {
    dispatch({ type: UPDATE_STATS, value });
  };

  const [detailedData, setDetailedData] = useState<CalculatedGroupOP[] | undefined>(undefined)
  const [pieData, setPieData] = useState<PieDataItem[] | undefined>(undefined)
  const [pieSynthesis, setPieSynthesis] = useState<PieDataItem[] | undefined>(undefined)

  // Change la valeur en fonction de si on est en valeur absolue ou relative
  useEffect(() => {
    if (!props.data) return
    setDetailedData(stats.absolute ? toAbsolute(props.data) : props.data)
    // eslint-disable-next-line
  }, [props.data, stats.absolute])

  // Si une légende est désactivée le booleen showAllLegends passe à false
  useEffect(() => {
    checkIfStillShowAll()
    // eslint-disable-next-line
  }, [stats.legends])

  // Initialisation des légendes pour pouvoir les activer / décastiver
  useEffect(() => {
    if (!detailedData) return
    initializeLegends(detailedData)
    // eslint-disable-next-line
  }, [detailedData])

  // Si la data a une taille 1 = Un seul mois sélectionné on ajout le pie
  useEffect(() => {
    if (!props.data || props.data?.length !== 1) {
      updateStats({ detailSelectValue: 1 })
      setPieData(undefined)
      return
    }

    const tempPieData: PieDataItem[] = []
    for (const [cle, valeur] of Object.entries(props.data[0])) {
      if (cle !== "date" && cle !== "Total") {
        tempPieData.push({ name: cle, value: valeur as number })
      }
    }
    tempPieData.sort((a, b) => b.value - a.value)

    let totalPositive = 0
    let totalNegative = 0
    tempPieData.forEach((x) => {
      if (x.value > 0) totalPositive += x.value
      else totalNegative += Math.abs(x.value)
    })

    setPieSynthesis([
      { name: 'revenus', value: totalPositive },
      { name: 'dépenses', value: totalNegative }
    ])

    tempPieData.forEach((x) => x.value = Math.abs(x.value))
    updateStats({ detailSelectValue: 3 })
    setPieData(tempPieData)
    // eslint-disable-next-line
  }, [props.data])

  return (
    <div className="detailedStats__container">
      <SelectButton
        value={stats.detailSelectValue}
        onChange={(e) => updateStats({ detailSelectValue: e.value })}
        optionLabel="name"
        options={pieData ? items : items.filter((x) => x.value !== 3)}
      />
      <span className="titre second">Graphique détaillé</span>
      <ResponsiveContainer width="100%" height={windowSize.width > 900 ? 500 : 300} style={{ margin: "0.5rem 0" }}>
        {stats.detailSelectValue === 3
          ? <PieGraph pieSynthesis={pieSynthesis} pieData={pieData}></PieGraph>
          : stats.detailSelectValue === 2
            ? <LineGraph finalData={detailedData}></LineGraph>
            : <BarGraph finalData={detailedData}></BarGraph>
        }
      </ResponsiveContainer>
      <div className="statistics__buttons">
        <Bouton
          btnTexte="Activer tout"
          btnAction={() => activeAllLegends()}
        ></Bouton>
        <Bouton
          btnTexte={stats.absolute ? "Valeur relative" : "Valeur absolue"}
          btnAction={() => updateStats({ absolute: !stats.absolute })}
        ></Bouton>
      </div>
    </div>
  );
};

export default DetailedStats;