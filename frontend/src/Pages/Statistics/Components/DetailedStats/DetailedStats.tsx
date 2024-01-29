import DetailedGraph from "./DetailedGraph"
import { SelectButton } from 'primereact/selectbutton';
import Bouton from "../../../../Components/UI/Bouton/Bouton";
import { useEffect, useState } from "react";
import { toAbsolute } from "../../../../Services/statistics";

type Props = {
  data: CalculatedGroupOP[] | undefined
}
const DetailedStats = (props: Props) => {
  const items = [
    { name: 'Barres', value: 1 },
    { name: 'Lignes', value: 2 },
    { name: 'Camembert', value: 3 }
  ];

  const [detailedData, setDetailedData] = useState<CalculatedGroupOP[] | undefined>(undefined)
  const [value, setValue] = useState<1 | 2 | 3>(1);
  const [pieData, setPieData] = useState<PieDataItem[] | undefined>(undefined)
  const [absolute, setAbsolute] = useState(true)
  const [resetLegends, setResetLegends] = useState(false)
  const [pieSynthesis, setPieSynthesis] = useState<PieDataItem[] | undefined>(undefined)

  // Change la valeur en fonction de si on est en valeur absolue ou relative
  useEffect(() => {
    if (!props.data) return
    setDetailedData(absolute ? toAbsolute(props.data) : props.data)
    // eslint-disable-next-line
  }, [props.data, absolute])

  // Si la data a une taille 1 = Un seul mois sélectionné on ajout le pie
  useEffect(() => {
    if (pieData && props.data?.length !== 1) {
      setValue(1)
    }
    if (!props.data || props.data.length !== 1) {
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
      {
        name: 'revenus',
        value: totalPositive
      },
      {
        name: 'dépenses',
        value: totalNegative
      }
    ])

    tempPieData.forEach((x) => x.value = Math.abs(x.value))
    setValue(3)
    setPieData(tempPieData)
    // eslint-disable-next-line
  }, [props.data])

  return (
    <div className="detailedStats__container">
      <SelectButton
        value={value}
        onChange={(e) => setValue(e.value)}
        optionLabel="name"
        options={pieData ? items : items.filter((x) => x.value !== 3)}
      />
      <span className="titre second">Graphique détaillé</span>
      <DetailedGraph
        pieData={pieData}
        pieSynthesis={pieSynthesis}
        finalData={detailedData}
        value={value}
        resetLegends={resetLegends}
        setResetLegends={setResetLegends}
      ></DetailedGraph>
      <div className="statistics__buttons">
        <Bouton
          btnTexte="Activer tout"
          btnAction={() => setResetLegends(true)}
        ></Bouton>
        <Bouton
          btnTexte={absolute ? "Valeur relative" : "Valeur absolue"}
          btnAction={() => setAbsolute(!absolute)}
        ></Bouton>
      </div>
    </div>
  );
};

export default DetailedStats;