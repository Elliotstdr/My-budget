import { Calendar } from "primereact/calendar";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import "./Statistics.scss";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList
} from 'recharts';
import { useEffect, useState } from "react";
import { fetchPost, useFetchGet } from "../../Services/api";
import { calculateData } from "../../Services/statistics";
import { orderByDate } from "../../Services/functions";
import { SelectButton } from 'primereact/selectbutton';
import Bouton from "../../Utils/Bouton/Bouton";

type PieDataItem = {
  name: string,
  value: number
}

const Statistics = () => {
  const items = [
    { name: 'Lignes', value: 1 },
    { name: 'Barres', value: 2 },
    { name: 'Camembert', value: 3 }
  ];

  const colorArray = [
    "#1F618D", "#148F77", "#D4AC0D", // Blue Sapphire, Mountain Meadow, Ochre
    "#AF601A", "#633974", "#BA4A00", // Rust, Dark Purple, Burnt Sienna
    "#3498DB", "#17A589", "#D35400", // Sky Blue, Shamrock, Pumpkin
    "#CB4335", "#7D6608", "#6C3483", // Mahogany, Olive Drab, Royal Purple
    "#1F618D", "#196F3D", "#D68910", // Blue Sapphire, Forest Green, Dark Orange
    "#922B21", "#5B2C6F", "#C27C0E"  // Sangria, Byzantine, Metallic Gold
  ]

  const operationsData = useFetchGet<Operation[]>("/operation")
  const [date, setDate] = useState<Date | Date[] | null>(null)
  const [data, setData] = useState<CalculatedGroupOP[] | undefined>(undefined)
  const [value, setValue] = useState<1 | 2 | 3>(1);
  const [legends, setLegends] = useState<any>(null);
  const [pieData, setPieData] = useState<PieDataItem[] | undefined>(undefined)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [absolute, setAbsolute] = useState(false)

  // Set des données au début du processus
  useEffect(() => {
    if (operationsData.loaded && operationsData.data) {
      updateData(operationsData.data)
    }
    // eslint-disable-next-line
  }, [operationsData.loaded])

  // Filtre par Date du Calendar
  const filterByDate = async (rangeDate: Date[]) => {
    if (!rangeDate || !rangeDate[0] || !rangeDate[1]) return
    const body = {
      startDate: rangeDate[0],
      endDate: rangeDate[1]
    }

    const rangeData = await fetchPost('/operation/byDate', body)
    if (rangeData.error) return

    updateData(rangeData.data)
  }

  // Sous-fonction qui ordonne par date et formatte la donnée pour créer la donnée finale
  const updateData = (data: Operation[]) => {
    const newData = orderByDate(data)
    const calculatedData = calculateData(newData)
    setData(calculatedData)
  }

  // Initialisation des légendes pour pouvoir les activer / décastiver
  useEffect(() => {
    if (data && !legends) {
      const item: any = { ...data[0] }
      delete item.date

      Object.keys(item).forEach(key => {
        if (key === "Total" || key === "Total-abs") {
          item[key] = false;
        } else {
          item[key] = true;
        }
      });

      item.hover = null
      setLegends(item)
    }
    // eslint-disable-next-line
  }, [data])

  // Permet de mettre en évidence la data liée à la légende que l'on survole
  const handleLegendMouseEnter = (e: any) => {
    if (!legends) return
    if (!legends[e.dataKey]) {
      setLegends({ ...legends, hover: e.dataKey });
    }
  };

  // Stoppe la mise en évidence de la légende
  const handleLegendMouseLeave = () => {
    if (!legends) return
    setLegends({ ...legends, hover: null });
  };

  // Ajoute ou retire une légende à celles visibles dans le graph
  const selectBar = (e: any) => {
    if (!legends) return
    const key = e.dataKey.split("-abs")[0]
    setLegends({
      ...legends,
      [key]: !legends[key],
      [`${key}-abs`]: !legends[`${key}-abs`],
      hover: null
    });
  };

  // Si la data a une taille 1 = Un seul mois sélectionné on ajout le pie
  useEffect(() => {
    if (pieData && data?.length !== 1) {
      setValue(1)
    }
    if (!data || data.length !== 1) {
      setPieData(undefined)
      return
    }
    let tempPieData: PieDataItem[] = []
    for (const [cle, valeur] of Object.entries(data[0])) {
      if (cle !== "date" && cle !== "Total") {
        tempPieData.push({ name: cle, value: valeur as number })
      }
    }
    tempPieData.sort((a, b) => b.value - a.value)
    tempPieData.forEach((x) => x.value = Math.abs(x.value))
    tempPieData = tempPieData.filter((x) => !x.name.includes("-abs"))
    setValue(3)
    setPieData(tempPieData)
    // eslint-disable-next-line
  }, [data])

  // Tooltip custom
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !hoveredItem) return null

    for (const element of payload) {
      if (element.dataKey === hoveredItem) {
        return <div className="custom__tooltip">
          <span className="name">{element.name}</span>
          <span className="value" style={{ color: element.color }}>{element.value.toFixed(2)}</span>
        </div>
      }
    }
    return null
  }
  return (
    <>
      <Header title="Statistiques"></Header>
      <div className="statistics page">
        <Calendar
          value={date}
          onChange={(e) => {
            if (!e.value || !Array.isArray(e.value)) return

            const startDate = e.value[0] as Date;
            const endDate = e.value[1]
              ? new Date(e.value[1].getFullYear(), e.value[1].getMonth() + 1, 0)
              : null;

            startDate.setHours(startDate.getHours() + 6);
            endDate?.setHours(endDate.getHours() + 18);

            const rangeDates = endDate ? [startDate, endDate] : [startDate]

            setDate(rangeDates)
            filterByDate(rangeDates)
          }}
          onClearButtonClick={() => {
            setDate(null)
            if (!operationsData.data) return
            updateData(operationsData.data)
          }}
          view="month"
          dateFormat="mm/yy"
          placeholder="Choisissez une date"
          showIcon
          selectionMode="range"
          showButtonBar
        />
        <SelectButton
          value={value}
          onChange={(e) => setValue(e.value)}
          optionLabel="name"
          options={pieData ? items : items.filter((x) => x.value !== 3)}
        />
        <ResponsiveContainer width="100%" height={300}>
          {value === 3 ?
            <PieChart width={500} height={500}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label={(e) => {
                  return e.name
                }}
              >
                <LabelList
                  dataKey="value"
                  style={{ fontSize: "10px" }}
                  textAnchor="bottom"
                />
                {pieData?.map((entry, index) => (
                  <Cell key={entry.value} fill={colorArray[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            : value === 2 ?
              <BarChart
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
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={CustomTooltip} />
                <Legend
                  onClick={selectBar}
                  onMouseOver={handleLegendMouseEnter}
                  onMouseOut={handleLegendMouseLeave}
                />
                {data && Object.keys(data[0])
                  .filter((key) => key !== "date")
                  .filter((key) => absolute ? key.includes("-abs") : !key.includes("-abs"))
                  .map((key, index) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={colorArray[index]}
                      hide={legends && legends[key] === true}
                      fillOpacity={Number(
                        !legends || legends.hover === key || !legends.hover ? 1 : 0.2
                      )}
                      strokeOpacity={Number(
                        !legends || legends.hover === key || !legends.hover ? 1 : 0.2
                      )}
                      onMouseOver={() => setHoveredItem(key)}
                      name={key.split("-abs")[0]}
                    />
                  ))}
              </BarChart>
              : <LineChart
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
                <XAxis dataKey="date" />
                <YAxis padding={{ bottom: 10, top: 10 }} />
                <Tooltip content={CustomTooltip} /> {/* // position={{ x: 0, y: 225 }} */}
                <Legend
                  onClick={selectBar}
                  onMouseOver={handleLegendMouseEnter}
                  onMouseOut={handleLegendMouseLeave}
                />
                {data && data?.length > 0 && Object.keys(data[0])
                  .filter((key) => key !== "date")
                  .filter((key) => absolute ? key.includes("-abs") : !key.includes("-abs"))
                  .map((key, index) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={colorArray[index]}
                      activeDot={{ r: 8, onMouseOver: () => setHoveredItem(key) }}
                      hide={legends && legends[key] === true}
                      fillOpacity={Number(
                        !legends || legends.hover === key || !legends.hover ? 1 : 0.2
                      )}
                      strokeOpacity={Number(
                        !legends || legends.hover === key || !legends.hover ? 1 : 0.2
                      )}
                      onMouseOver={() => setHoveredItem(key)}
                      name={key.split("-abs")[0]}
                    />
                  ))}
              </LineChart>
          }
        </ResponsiveContainer>
        <div className="statistics__buttons">
          <Bouton
            type="normal"
            btnTexte="Activer tout"
            btnAction={() => {
              const item = { ...legends }
              Object.keys(item).forEach(key => { item[key] = false });
              item.hover = null
              setLegends(item)
            }}
          ></Bouton>
          <Bouton
            type="normal"
            btnTexte={absolute ? "Valeur relative" : "Valeur absolue"}
            btnAction={() => setAbsolute(!absolute)}
          ></Bouton>
        </div>
      </div>
      <NavBar></NavBar>
    </>
  );
};

export default Statistics;