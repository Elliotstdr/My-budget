import { colorArray } from "../../../../Services/legends";
import { useScreenSize } from "../../../../Services/useScreenSize";
import { PieChart, Pie, Cell, LabelList } from 'recharts';

type Props = {
  pieSynthesis: PieDataItem[] | undefined
  pieData: PieDataItem[] | undefined
}

const PieGraph = (props: Props) => {
  const windowSize = useScreenSize()

  return (
    <PieChart width={windowSize.width} height={windowSize.width > 900 ? 500 : 300}>
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
          formatter={(e: number) => { return e.toFixed(1) }}
        />
        {props.pieData?.map((entry, index) => (
          <Cell key={entry.value} fill={colorArray[index]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default PieGraph;