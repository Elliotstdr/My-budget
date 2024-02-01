import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useScreenSize } from '../../../../Services/useScreenSize';
import { colorArray, handleLegendMouseEnter, handleLegendMouseLeave, isClear, selectBar } from '../../../../Services/legends';
import { useSelector } from 'react-redux';
import { useState } from 'react';

type Props = {
  finalData: CalculatedGroupOP[] | undefined
}

const LineGraph = (props: Props) => {
  const windowSize = useScreenSize()
  const stats = useSelector((state: RootState) => state.stats);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

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
    <LineChart
      width={windowSize.width}
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
            hide={stats.legends && stats.legends[key] ? true : false}
            fillOpacity={isClear(key) ? 1 : 0.2}
            strokeOpacity={isClear(key) ? 1 : 0.2}
            onMouseOver={() => setHoveredItem(key)}
            name={key}
          />
        ))}
    </LineChart>
  );
};

export default LineGraph;