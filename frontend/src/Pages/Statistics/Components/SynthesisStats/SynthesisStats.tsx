import { useSelector } from 'react-redux';
import {
  Line, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Rectangle
} from 'recharts';
import { useScreenSize } from '../../../../Services/useScreenSize';
import GoalLine from './GoalLine';
import { useEffect, useState } from 'react';
import { getSynthesisData } from '../../../../Services/statistics';

interface Props {
  data: CalculatedGroupOP[] | undefined
}

const SynthesisStats = (props: Props) => {
  const auth = useSelector((state: RootState) => state.auth);
  const windowSize = useScreenSize()
  const [synthesisData, setSynthesisData] = useState<SynthesisData[] | undefined>(undefined)

  // Change la valeur en fonction de si on est en valeur absolue ou relative
  useEffect(() => {
    if (!props.data) return
    setSynthesisData(getSynthesisData(props.data))
    // eslint-disable-next-line
  }, [props.data])

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

  const getMonthGoal = () => {
    if (!auth.userConnected?.goal || !auth.userConnected?.goalPeriod) return 1
    const goal = auth.userConnected.goal
    const dates = auth.userConnected.goalPeriod

    if (!dates || dates.length !== 2) return 1

    const start = new Date(dates[0])
    const end = new Date(dates[1])

    let months = 1;
    months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();

    return months <= 1 ? Number(goal) : Number(goal) / (months + 1);
  }

  return (
    <>
      <span className="titre first">Graphique de synthèse</span>
      <ResponsiveContainer width="100%" height={windowSize.width > 900 ? 500 : 300}>
        <ComposedChart
          width={500}
          height={windowSize.width > 900 ? 500 : 300}
          data={synthesisData}
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
          {auth.userConnected?.allowGoal && auth.userConnected.goal &&
            (auth.userConnected.goalPeriod
              ? <GoalLine
                y={getMonthGoal()}
                labelValue={`Objectif mensuel (${getMonthGoal().toFixed(0)}€)`}
              ></GoalLine>
              : <GoalLine
                y={auth.userConnected.goal}
                labelValue={`Objectif (${Number(auth.userConnected.goal).toFixed(0)}€)`}
              ></GoalLine>)}
        </ComposedChart>
      </ResponsiveContainer >
    </>
  );
};

export default SynthesisStats;