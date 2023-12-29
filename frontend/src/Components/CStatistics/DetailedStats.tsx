import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList
} from 'recharts';

interface Props {
  finalData: CalculatedGroupOP[]
  pieData: PieDataItem[] | undefined
  value: number
  legends: any
  setLegends: React.Dispatch<React.SetStateAction<any>>
}

const DetailedStats = (props: Props) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const colorArray = [
    "#148F77", "#1F618D", "#D4AC0D", // Mountain Meadow, Blue Sapphire, Ochre
    "#AF601A", "#633974", "#BA4A00", // Rust, Dark Purple, Burnt Sienna
    "#3498DB", "#17A589", "#D35400", // Sky Blue, Shamrock, Pumpkin
    "#CB4335", "#7D6608", "#6C3483", // Mahogany, Olive Drab, Royal Purple
    "#1F618D", "#196F3D", "#D68910", // Blue Sapphire, Forest Green, Dark Orange
    "#922B21", "#5B2C6F", "#C27C0E"  // Sangria, Byzantine, Metallic Gold
  ]

  // Initialisation des légendes pour pouvoir les activer / décastiver
  useEffect(() => {
    if (props.finalData && !props.legends) {
      const tempData = props.finalData.map((x) => { return { ...x } })
      const item: any = tempData.sort((a, b) => Object.keys(b).length - Object.keys(a).length)[0]
      delete item.date

      Object.keys(item).forEach(key => {
        if (key === "Total") {
          item[key] = false;
        } else {
          item[key] = true;
        }
      });

      item.hover = null
      props.setLegends(item)
    }
    // eslint-disable-next-line
  }, [props.finalData])
  // Permet de mettre en évidence la data liée à la légende que l'on survole
  const handleLegendMouseEnter = (e: any) => {
    if (!props.legends) return
    if (!props.legends[e.dataKey]) {
      props.setLegends({ ...props.legends, hover: e.dataKey });
    }
  };

  // Stoppe la mise en évidence de la légende
  const handleLegendMouseLeave = () => {
    if (!props.legends) return
    props.setLegends({ ...props.legends, hover: null });
  };

  // Ajoute ou retire une légende à celles visibles dans le graph
  const selectBar = (e: any) => {
    if (!props.legends) return
    props.setLegends({
      ...props.legends,
      [e.dataKey]: !props.legends[e.dataKey],
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
    <ResponsiveContainer width="100%" height={300} style={{ margin: "0.5rem 0" }}>
      {props.value === 3 ?
        <PieChart width={500} height={500}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={props.pieData}
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
            {props.pieData?.map((entry, index) => (
              <Cell key={entry.value} fill={colorArray[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        : props.value === 2 ?
          <LineChart
            width={500}
            height={300}
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
            {Object.keys([...props.finalData].sort((a, b) => Object.keys(b).length - Object.keys(a).length)[0])
              .filter((key) => key !== "date")
              .map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colorArray[index]}
                  activeDot={{ r: 8, onMouseOver: () => setHoveredItem(key) }}
                  hide={props.legends && props.legends[key] === true}
                  fillOpacity={Number(
                    !props.legends || props.legends.hover === key || !props.legends.hover ? 1 : 0.2
                  )}
                  strokeOpacity={Number(
                    !props.legends || props.legends.hover === key || !props.legends.hover ? 1 : 0.2
                  )}
                  onMouseOver={() => setHoveredItem(key)}
                  name={key}
                />
              ))}
          </LineChart>
          : <BarChart
            width={500}
            height={300}
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
            {Object.keys([...props.finalData].sort((a, b) => Object.keys(b).length - Object.keys(a).length)[0])
              .filter((key) => key !== "date")
              .map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colorArray[index]}
                  hide={props.legends && props.legends[key] === true}
                  fillOpacity={Number(
                    !props.legends || props.legends.hover === key || !props.legends.hover ? 1 : 0.2
                  )}
                  strokeOpacity={Number(
                    !props.legends || props.legends.hover === key || !props.legends.hover ? 1 : 0.2
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

export default DetailedStats;