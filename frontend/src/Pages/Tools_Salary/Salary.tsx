import { useState } from "react";
import "./Salary.scss";
import Bouton from "../../Components/UI/Bouton/Bouton";
import { Checkbox } from 'primereact/checkbox';
import { Slider } from "primereact/slider";
import ReturnButton from "../../Components/UI/ReturnButton/ReturnButton";
import { useNavigate } from "react-router-dom";
import { decilesStartData } from "../../Services/tools";
import SalaryGraph from "./Components/SalaryGraph";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import { updateSalary } from "../../Store/Reducers/salaryReducer";

interface Props {
  isDesktop?: boolean
}

const SalaryContainer = (props: Props) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const salary = useSelector((state: RootState) => state.salary);
  const [salaireNetAvantImpot, setSalaireNetAvantImpot] = useState<number>(0);
  const [salaireNetApresImpot, setSalaireNetApresImpot] = useState<number>(0);
  const [tauxImpot, setTauxImpot] = useState(0)

  const [myDecile, setMyDecile] = useState<Decile>({
    percile: 0,
    value: 0,
    mine: 0
  })

  const deciles: Decile[] = decilesStartData

  const calculerSalaireNet = () => {
    const tauxCotisations = salary.estCadre ? 0.235 : 0.22
    const tranche1 = 10777
    const tranche2 = 27478
    const tranche3 = 78570

    if (typeof salary.salaireBrut !== 'number') {
      return;
    }

    const cotisationsSociales = tauxCotisations * salary.salaireBrut;
    const salaireNetAvantImpot = salary.salaireBrut - cotisationsSociales;
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

  return (
    <>
      {!props.isDesktop && <Header title="Mon salaire"></Header>}
      <div className="salary">
        {props.isDesktop
          ? <h1 className="salary__title">Salaire brut / net</h1>
          : <ReturnButton action={() => navigate("/tools")}></ReturnButton>
        }
        <div>
          <div style={{ marginBottom: "0.75rem" }}>{`Salaire Brut Mensuel : ${salary.salaireBrut}`}</div>
          <Slider
            value={salary.salaireBrut}
            onChange={(e) => dispatch(updateSalary({ salaireBrut: e.value as number }))}
            min={100}
            max={7000}
            step={10}
          />
        </div>
        <label>
          <Checkbox
            type="checkbox"
            checked={salary.estCadre}
            onChange={() => dispatch(updateSalary({ estCadre: !salary.estCadre }))}
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
        <SalaryGraph myDecile={myDecile}></SalaryGraph>
      </div>
      {!props.isDesktop && <NavBar></NavBar>}
    </>
  );
};

export default SalaryContainer;