import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { useState } from "react";
import { useScreenSize } from "../../../Services/useScreenSize";
import { decilesStartData } from "../../../Services/tools";

type Props = {
  myDecile: Decile
}

const SalaryGraph = (props: Props) => {
  const windowSize = useScreenSize()
  const [infosVisible, setInfosVisible] = useState(false)

  const deciles: Decile[] = decilesStartData

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          {payload[0].payload.mine
            ? <span>Vous êtes ici ! Vous gagnez plus que {payload[0].payload.mine}% des employés du privé</span>
            : <>
              <span style={{ color: "var(--third-color)" }}>
                Décile : {`${payload[0].payload.percile.toFixed(0)}%`}
              </span>
              <span style={{ color: "var(--second-color)" }}>
                Salaire : {`${payload[0].payload.value.toFixed(0)}€`}
              </span>
            </>
          }
        </div>
      );
    }

    return null;
  };

  return (
    <div className="salary__graph">
      <h3 style={{ margin: 0, marginBottom: "0.5rem" }} >
        Comparaison nationale :
        <span onClick={() => setInfosVisible(!infosVisible)}><HiOutlineInformationCircle /></span>
      </h3>
      <ResponsiveContainer width="100%" height={windowSize.width > 900 ? 400 : 300}>
        <BarChart
          width={500}
          height={windowSize.width > 900 ? 400 : 300}
          data={[...deciles, props.myDecile].filter((x) => x.value !== 0).sort((a, b) => a.value - b.value)}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="percile" padding={{ left: 10, right: 10 }} />
          <YAxis padding={{ bottom: 10, top: 10 }} dataKey="value" />
          <Tooltip content={CustomTooltip} />
          <Bar dataKey="value">
            {[...deciles, props.myDecile]
              .sort((a, b) => a.value - b.value)
              .filter((x) => x.value !== 0)
              .map((entry, key) => (
                <Cell
                  fill={entry.mine ? "rgb(20, 143, 119)" : "var(--main-color)"}
                  fillOpacity={entry.mine ? 1 : 0.6}
                  key={key}
                />
              ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {infosVisible && <div style={{ fontSize: "0.7rem", color: "black" }}>
        Résultats basés sur le rapport de l'Observatoire des inégalités de 2023 <br />
        Le salaire est la valeur net perçue après impot pour un salarié du privé
      </div>}
    </div>
  );
};

export default SalaryGraph;