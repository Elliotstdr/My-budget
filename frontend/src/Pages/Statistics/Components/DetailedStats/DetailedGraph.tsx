import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList
} from 'recharts';
import { useScreenSize } from "../../../../Services/useScreenSize";

interface Props {
  finalData: CalculatedGroupOP[] | undefined
  pieData: PieDataItem[] | undefined
  pieSynthesis: PieDataItem[] | undefined
  value: number
  resetLegends: boolean
  setResetLegends: React.Dispatch<React.SetStateAction<boolean>>
}

const DetailedGraph = (props: Props) => {
  const windowSize = useScreenSize()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [legends, setLegends] = useState<Legends | null>(null);

  const colorArray = [
    "#148F77", "#1F618D", "#D4AC0D", // Mountain Meadow, Blue Sapphire, Ochre
    "#AF601A", "#633974", "#BA4A00", // Rust, Dark Purple, Burnt Sienna
    "#3498DB", "#17A589", "#D35400", // Sky Blue, Shamrock, Pumpkin
    "#CB4335", "#7D6608", "#6C3483", // Mahogany, Olive Drab, Royal Purple
    "#1F618D", "#196F3D", "#D68910", // Blue Sapphire, Forest Green, Dark Orange
    "#922B21", "#5B2C6F", "#C27C0E"  // Sangria, Byzantine, Metallic Gold
  ]

  useEffect(() => {
    if (props.resetLegends) {
      const item = { ...legends }
      Object.keys(item).forEach(key => { item[key] = false });
      item.hover = null
      setLegends(item as Legends)
      props.setResetLegends(false)
    }
    // eslint-disable-next-line
  }, [props.resetLegends])

  // Initialisation des légendes pour pouvoir les activer / décastiver
  useEffect(() => {
    if (props.finalData && !legends) {
      const tempData = props.finalData.map((x) => { return { ...x } })
      const item = tempData.sort((a, b) => Object.keys(b).length - Object.keys(a).length)[0]

      const initialLegends: Legends = { hover: null }

      Object.keys(item).forEach(key => {
        if (key === 'date') return
        if (key === "Total") {
          initialLegends[key] = false;
        } else {
          initialLegends[key] = true;
        }
      });

      setLegends(initialLegends)
    }
    // eslint-disable-next-line
  }, [props.finalData])
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
    setLegends({
      ...legends,
      [e.dataKey]: !legends[e.dataKey],
      hover: null
    });
  };

  // Tooltip custom
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !hoveredItem) return null

    for (const element of payload) {
      if (element.dataKey === hoveredItem) {
        return <div className="custom__tooltip">
          <span className="name">{element.name}</span>
          <span className="value" style={{ color: element.color }}>
            {Number.isInteger(element.value) ? Math.round(element.value) : element.value.toFixed(1)}€
          </span>
        </div>
      }
    }
    return null
  }
  return (
    <ResponsiveContainer width="100%" height={windowSize.width > 900 ? 500 : 300} style={{ margin: "0.5rem 0" }}>
      {props.value === 3 ?
        <PieChart width={500} height={windowSize.width > 900 ? 500 : 300}>
          {props.pieSynthesis && <Pie
            data={props.pieSynthesis}
            dataKey="value"
            outerRadius={windowSize.width > 900 ? 80 : 50}
          >
            <LabelList
              dataKey="name"
              style={{ fontSize: "10px" }}
              textAnchor="bottom"
            />
            <Cell key={props.pieSynthesis[0].name} fill={'#a7a5a5'} className="revDepLabel" />
            <Cell key={props.pieSynthesis[1].name} fill={'#a7a5a5'} className="revDepLabel" />
          </Pie>}
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={props.pieData}
            innerRadius={windowSize.width > 900 ? 100 : 60}
            outerRadius={windowSize.width > 900 ? 200 : 120}
            label={(e) => {
              return e.name
            }}
          >
            <LabelList
              dataKey="value"
              style={{ fontSize: "10px" }}
              textAnchor="bottom"
            />
            {props.pieData?.map((entry, index) => (
              <Cell key={entry.value} fill={colorArray[index]} />
            ))}
          </Pie>
        </PieChart>
        : props.value === 2 ?
          <LineChart
            width={500}
            height={windowSize.width > 900 ? 500 : 300}
            data={props.finalData}
            margin={{
              top: 5,
              right: 60,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis padding={{ bottom: 10, top: 10 }} />
            <Tooltip content={CustomTooltip} />
            <Legend
              onClick={selectBar}
              onMouseOver={handleLegendMouseEnter}
              onMouseOut={handleLegendMouseLeave}
              wrapperStyle={{ width: "unset", left: "unset", margin: "0 1rem" }}
            />
            {props.finalData && Object.keys([...props.finalData].sort((a, b) => Object.keys(b).length - Object.keys(a).length)[0])
              .filter((key) => key !== "date")
              .map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colorArray[index]}
                  activeDot={{ r: 8, onMouseOver: () => setHoveredItem(key) }}
                  hide={legends && legends[key] ? true : false}
                  fillOpacity={Number(
                    !legends || legends.hover === key || !legends.hover ? 1 : 0.2
                  )}
                  strokeOpacity={Number(
                    !legends || legends.hover === key || !legends.hover ? 1 : 0.2
                  )}
                  onMouseOver={() => setHoveredItem(key)}
                  name={key}
                />
              ))}
          </LineChart>
          : <BarChart
            width={500}
            height={windowSize.width > 900 ? 500 : 300}
            data={props.finalData}
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
              wrapperStyle={{ width: "unset", left: "unset", margin: "0 1rem" }}
            />
            {props.finalData && Object.keys([...props.finalData].sort((a, b) => Object.keys(b).length - Object.keys(a).length)[0])
              .filter((key) => key !== "date")
              .map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colorArray[index]}
                  hide={legends && legends[key] ? true : false}
                  fillOpacity={Number(
                    !legends || legends.hover === key || !legends.hover ? 1 : 0.2
                  )}
                  strokeOpacity={Number(
                    !legends || legends.hover === key || !legends.hover ? 1 : 0.2
                  )}
                  onMouseOver={() => setHoveredItem(key)}
                  name={key}
                />
              ))}
          </BarChart>
      }
    </ResponsiveContainer>
  );
};

export default DetailedGraph;