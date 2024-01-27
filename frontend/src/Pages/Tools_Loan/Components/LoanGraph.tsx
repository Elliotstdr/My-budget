import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useScreenSize } from "../../../Services/useScreenSize";

type Props = {
  data: LoanElement[] | undefined
}

const LoanGraph = (props: Props) => {
  const windowSize = useScreenSize()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <span>Durée : {`${label} ${label > 1 ? "ans" : "an"}`}</span>
          <span>Mensualités : {`${payload[1].value}€`}</span>
          <span>Coût : {`${payload[0].value}€`}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={windowSize.width > 900 ? 400 : 300}>
      <ComposedChart
        width={500}
        height={windowSize.width > 900 ? 400 : 300}
        data={props.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="temps" padding={{ left: 10, right: 10 }} />
        <YAxis padding={{ bottom: 10, top: 10 }} dataKey="value" yAxisId={1} />
        <YAxis dataKey="cost" yAxisId={2} orientation="right" />
        <Tooltip content={CustomTooltip} />
        <Legend />
        <Bar
          dataKey="cost"
          yAxisId={2}
          fillOpacity={0.4}
          fill="var(--third-color)"
          name="coût total"
        />
        <Line
          type="monotone"
          dataKey="value"
          yAxisId={1}
          strokeWidth={3}
          stroke="#6366F1"
          name="mensualités"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default LoanGraph;