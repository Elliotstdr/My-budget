import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import "./Parameters.scss";
import { useEffect, useState } from "react";
import { SelectButton } from "primereact/selectbutton";
import Debt from "./Components/Debt/Debt";
import Goal from "./Components/Goal/Goal";
import Params from "./Components/PersonalInformations/PersonalInformations";

const Parameters = () => {
  const items = [
    { name: 'Paramètres', value: 1 },
    { name: 'Créances', value: 2 },
    { name: 'Objectifs', value: 3 }
  ];

  const [value, setValue] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header title="Paramètres"></Header>
      <div className="parameters">
        <SelectButton
          value={value}
          onChange={(e) => e.value && setValue(e.value)}
          optionLabel="name"
          options={items}
        />
        {value === 1 && <Params></Params>}
        {value === 2 && <Debt></Debt>}
        {value === 3 && <Goal></Goal>}
      </div>
      <NavBar></NavBar>
    </>
  );
};

export default Parameters;