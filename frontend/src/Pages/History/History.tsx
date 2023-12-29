import { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import "./History.scss";
import { Calendar } from 'primereact/calendar';
import { useFetchGet } from "../../Services/api";
import Operation from "../../Components/Operation/Operation";
import { literalMonthAndYear } from "../../Services/functions";
import { Divider } from "primereact/divider";
import { groupByMonth } from "../../Services/statistics";
import { useNavigate } from "react-router-dom";

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
                {typesData.data && groupOperation.map((x) =>
                  <Operation
                    key={x._id}
                    operation={x}
                    setOperations={setOperations}
                    types={typesData.data ?? []}
                  ></Operation>
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