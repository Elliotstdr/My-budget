import { useState } from "react";
import Header from "../../Header/Header";
import NavBar from "../../NavBar/NavBar";
import "./Salary.scss";
import Bouton from "../../../Utils/Bouton/Bouton";
import { Checkbox } from 'primereact/checkbox';
import { Slider } from "primereact/slider";
import ReturnButton from "../../../Utils/ReturnButton/ReturnButton";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { decilesStartData } from "../../../Services/tools";

interface Props {
  isComponent?: boolean
}

type Decile = {
  percile: number,
  value: number,
  mine?: number
}

const Salary = (props: Props) => {
  const navigate = useNavigate()
  const [salaireBrut, setSalaireBrut] = useState<number>(2000);
  const [estCadre, setEstCadre] = useState<boolean>(false);
  const [salaireNetAvantImpot, setSalaireNetAvantImpot] = useState<number>(0);
  const [salaireNetApresImpot, setSalaireNetApresImpot] = useState<number>(0);
  const [tauxImpot, setTauxImpot] = useState(0)

  const [infosVisible, setInfosVisible] = useState(false)
  const [myDecile, setMyDecile] = useState<Decile>({
    percile: 0,
    value: 0,
    mine: 0
  })

  const deciles: Decile[] = decilesStartData

  const calculerSalaireNet = () => {
    const tauxCotisations = estCadre ? 0.235 : 0.22
    const tranche1 = 10777
    const tranche2 = 27478
    const tranche3 = 78570

    if (typeof salaireBrut !== 'number') {
      return;
    }

    const cotisationsSociales = tauxCotisations * salaireBrut;
    const salaireNetAvantImpot = salaireBrut - cotisationsSociales;
    const annuelImposable = salaireNetAvantImpot * 12
    let impot = 0

    if (annuelImposable > tranche1 && annuelImposable < tranche2) {
      impot = (annuelImposable - tranche1) * 0.11
    } else if (annuelImposable > tranche2 && annuelImposable < tranche3) {
      impot = tranche1 * 0.11 + (annuelImposable - tranche2) * 0.30
    } else if (annuelImposable > tranche3) {
      impot = tranche1 * 0.11 + tranche2 * 0.30 + (annuelImposable - tranche3) * 0.41
    }

    const salaireNetApresImpot = salaireNetAvantImpot - impot / 12;
    const tauxImpotTemp = ((impot / 12) / salaireNetAvantImpot) * 100

    setTauxImpot(tauxImpotTemp)
    setSalaireNetAvantImpot(salaireNetAvantImpot);
    setSalaireNetApresImpot(salaireNetApresImpot);

    calculateDecile(salaireNetApresImpot)
  };

  const calculateDecile = (salaire: number) => {
    const decileSuperieur = deciles.find((x) => salaire < x.value)?.percile || 1
    deciles.reverse()
    const decileInferieur = deciles.find((x) => salaire > x.value)?.percile || 1

    setMyDecile({
      percile: (decileInferieur + decileSuperieur) / 2,
      value: salaire,
      mine: decileInferieur
    })
  }

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
                Salaire : {`${payload[0].payload.value.toFixed(2)}€`}
              </span>
            </>
          }
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {!props.isComponent && <Header title="Mon salaire"></Header>}
      <div className="salary">
        {!props.isComponent && <ReturnButton action={() => navigate("/tools")}></ReturnButton>}
        <div>
          <div style={{ marginBottom: "0.75rem" }}>{`Salaire Brut Mensuel : ${salaireBrut}`}</div>
          <Slider
            value={salaireBrut}
            onChange={(e) => setSalaireBrut(e.value as number)}
            min={100}
            max={7000}
            step={10}
          />
        </div>
        <label>
          <Checkbox
            type="checkbox"
            checked={estCadre}
            onChange={() => setEstCadre(!estCadre)}
          />
          {" "}Cadre
        </label>
        <Bouton btnAction={calculerSalaireNet} btnTexte="Calculer mon salaire net"></Bouton>

        {salaireNetAvantImpot !== 0 && salaireNetApresImpot !== 0 && (
          <div>
            <h3>Résultats :</h3>
            <p>Salaire Net Avant Impôt : {salaireNetAvantImpot.toFixed(2)}</p>
            <p>Salaire Net Après Impôt : {salaireNetApresImpot.toFixed(2)}</p>
            <p>Taux d'imposition estimé : {tauxImpot.toFixed(1)}%</p>
          </div>
        )}

        <div className="salary__graph">
          <h3 style={{ margin: 0, marginBottom: "0.5rem" }} >
            Comparaison nationale :
            <span onClick={() => setInfosVisible(!infosVisible)}><HiOutlineInformationCircle /></span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              width={500}
              height={300}
              data={[...deciles, myDecile].filter((x) => x.value !== 0).sort((a, b) => a.value - b.value)}
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
                {[...deciles, myDecile]
                  .sort((a, b) => a.value - b.value)
                  .filter((x) => x.value !== 0)
                  .map((entry) => (
                    <Cell
                      fill={entry.mine ? "rgb(20, 143, 119)" : "var(--main-color)"}
                      fillOpacity={entry.mine ? 1 : 0.6}
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
      </div>
      {!props.isComponent && <NavBar></NavBar>}
    </>
  );
};

export default Salary;