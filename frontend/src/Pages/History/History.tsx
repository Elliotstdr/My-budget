import { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import "./History.scss";
import { Calendar } from 'primereact/calendar';
import { useFetchGet } from "../../Services/api";
import { literalMonthAndYear } from "../../Services/functions";
import { Divider } from "primereact/divider";
import { groupByMonth } from "../../Services/statistics";
import { useNavigate } from "react-router-dom";

import { IoExtensionPuzzle } from "react-icons/io5";
import { FaExclamation, FaHouseUser, FaRegMoneyBillAlt } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { FaScaleBalanced, FaGear } from "react-icons/fa6";
import { MdOutlinePersonAddAlt } from "react-icons/md";

const History = () => {
  const navigate = useNavigate()
  const operationsData = useFetchGet<Operation[]>("/operation")
  const typesData = useFetchGet<Type[]>("/type")
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [operations, setOperations] = useState<Operation[]>([])

  useEffect(() => {
    operationsData.loaded && operationsData.data && setOperations(operationsData.data)
    // eslint-disable-next-line
  }, [operationsData.loaded])

  const filterByDate = (date: Date) => {
    if (!operationsData.data) return
    const monthFilter = date.getMonth()
    const yearFilter = date.getFullYear()

    const tempOperations: Operation[] = operationsData.data.filter((x) => {
      const operationDate = new Date(x.datePeriod);
      if (operationDate.getFullYear() === yearFilter && operationDate.getMonth() === monthFilter) return x
    })

    setOperations(tempOperations)
  }

  const getIcon = (typeLabel: string) => {
    switch (typeLabel) {
      case "Frais Fixe":
        return <div style={{ backgroundColor: "#148F77" }} className="icon"><IoExtensionPuzzle></IoExtensionPuzzle></div>
      case "Exceptionnelles":
        return <div style={{ backgroundColor: "#1F618D" }} className="icon"><FaExclamation></FaExclamation></div>
      case "Loyer":
        return <div style={{ backgroundColor: "#D35400" }} className="icon"><FaHouseUser></FaHouseUser></div>
      case "Salaire":
        return <div style={{ backgroundColor: "#D4AC0D" }} className="icon"><FaRegMoneyBillAlt></FaRegMoneyBillAlt></div>
      case "Nourriture":
        return <div style={{ backgroundColor: "#633974" }} className="icon"><GiKnifeFork></GiKnifeFork></div>
      case "Impots":
        return <div style={{ backgroundColor: "#BA4A00" }} className="icon"><FaScaleBalanced></FaScaleBalanced></div>
      case "Autres":
        return <div style={{ backgroundColor: "#3498DB" }} className="icon"><FaGear></FaGear></div>
      default:
        return <div style={{ backgroundColor: "#17A589" }} className="icon"><MdOutlinePersonAddAlt></MdOutlinePersonAddAlt></div>
    }
  }
  return (
    <>
      <Header title="Historique"></Header>
      <div className="history page">
        <Calendar
          value={date}
          onChange={(e) => {
            if (!e.value && operationsData.data) {
              setDate(null)
              setOperations(operationsData.data)
              return
            }
            const newDate = e.value as Date;
            newDate.setHours(newDate.getHours() + 12);
            setDate(newDate)
            filterByDate(newDate)
          }}
          view="month"
          dateFormat="mm/yy"
          placeholder="Choisissez une date"
          showIcon
          showButtonBar
        />
        {operations?.length > 0 ?
          <div className="history__list">
            {groupByMonth(operations).map((groupOperation, key) =>
              <div key={key}>
                <div className="divider" style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ margin: "0 0.5rem" }}>
                    {literalMonthAndYear(new Date(groupOperation[0].datePeriod))}
                  </span>
                  <Divider style={{ width: "50%" }}></Divider>
                </div>
                {typesData.data && groupOperation.map((x, key) =>
                  <div className="history__list__item" key={key}>
                    {getIcon(x.type.label)}
                    <div style={{ width: "6rem" }}>{x.label}</div>
                    <div style={{ width: "4rem", color: x.value > 0 ? "#339c0e" : "#e03232" }}>
                      {x.value > 0 ? "+" + x.value : x.value}€
                    </div>
                    <div>{x.type.label}</div>
                  </div>
                )}
              </div>
            )}
          </div>
          : <span className="empty">
            Ton historique est vide... pour le moment ! <br />
            L'ajout des dépenses c'est par <i onClick={() => navigate("/import")}>ici</i> !
          </span>
        }
      </div>
      <NavBar></NavBar>
    </>
  );
};

export default History;