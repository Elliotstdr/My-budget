import { useState } from "react";
import Header from "../../Header/Header";
import NavBar from "../../NavBar/NavBar";
import "./Salary.scss";
import Bouton from "../../../Utils/Bouton/Bouton";
import { Checkbox } from 'primereact/checkbox';
import { Slider } from "primereact/slider";
import ReturnButton from "../../../Utils/ReturnButton/ReturnButton";
import { useNavigate } from "react-router-dom";

const Salary = () => {
  const navigate = useNavigate()
  const [salaireBrut, setSalaireBrut] = useState<number>(100);
  const [estCadre, setEstCadre] = useState<boolean>(false);
  const [salaireNetAvantImpot, setSalaireNetAvantImpot] = useState<number>(0);
  const [salaireNetApresImpot, setSalaireNetApresImpot] = useState<number>(0);

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

    setSalaireNetAvantImpot(salaireNetAvantImpot);
    setSalaireNetApresImpot(salaireNetApresImpot);
  };

  return (
    <>
      <Header title="Mon salaire"></Header>
      <ReturnButton action={() => navigate("/tools")}></ReturnButton>
      <div className="salary">
        <div>
          <div style={{ marginBottom: "0.75rem" }}>{`Salaire Brut Mensuel : ${salaireBrut}`}</div>
          <Slider
            value={salaireBrut}
            onChange={(e) => setSalaireBrut(e.value as number)}
            min={100}
            max={7000}
            step={5}
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
        <Bouton btnAction={calculerSalaireNet} btnTexte="Calculer Salaire Net"></Bouton>

        {salaireNetAvantImpot !== 0 && salaireNetApresImpot !== 0 && (
          <div>
            <h3>Résultats :</h3>
            <p>Salaire Net Avant Impôt : {salaireNetAvantImpot.toFixed(2)}</p>
            <p>Salaire Net Après Impôt : {salaireNetApresImpot.toFixed(2)}</p>
          </div>
        )}
      </div>
      <NavBar></NavBar>
    </>
  );
};

export default Salary;