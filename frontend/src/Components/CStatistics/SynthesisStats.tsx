import {
  Line, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Rectangle
} from 'recharts';

interface Props {
  synthesisData: SynthesisData[]
}

const SynthesisStats = (props: Props) => {
  // Tooltip custom
  const CustomTooltip = ({ payload }: any) => {
    return payload.map((x: any) =>
      <div className="custom__tooltip" style={{ flexDirection: "row" }}>
        <span className="name" style={{ marginRight: "0.25rem" }}>{x.name} :</span>
        <span className="value" style={{ color: x.color }}>
          {Number.isInteger(x.value) ? Math.round(x.value) : x.value.toFixed(1)}€
        </span>
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        width={500}
        height={300}
        data={props.synthesisData}
        margin={{ right: 30, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" padding={{ left: 10, right: 10 }} />
        <YAxis />
        <Tooltip content={CustomTooltip} position={{ y: 240 }} wrapperStyle={{ outline: "1px solid" }} />
        <Legend />
        <Bar
          dataKey="expense"
          fill="#BA4A00"
          fillOpacity={0.4}
          name="Dépenses"
          activeBar={<Rectangle fill="#BA4A00" fillOpacity={1} />}
        />
        <Bar
          dataKey="revenue"
          fill="#D4AC0D"
          fillOpacity={0.4}
          name="Revenus"
          activeBar={<Rectangle fill="#D4AC0D" fillOpacity={1} />}
        />
        <Bar
          dataKey="bilan"
          fill="#3498DB"
          fillOpacity={0.4}
          name="Bilan"
          activeBar={<Rectangle fill="#3498DB" fillOpacity={1} />}
        />
        <Line
          type="monotone"
          dataKey="solde"
          strokeWidth={3}
          stroke="#148F77"
          fill="#148F77"
          name="Solde"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default SynthesisStats;