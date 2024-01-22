import { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import "./History.scss";
import { Calendar } from 'primereact/calendar';
import { useFetchGet } from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { useScreenSize } from "../../Services/useScreenSize";
import RedirectionCardDesktop from "../../Components/CHistory/RedirectionCardDesktop/RedirectionCardDesktop";
import HistoryCardContainer from "../../Components/CHistory/HistoryCardContainer/HistoryCardContainer";

const History = () => {
  const navigate = useNavigate()
  const operationsData = useFetchGet<Operation[]>("/operation")
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [operations, setOperations] = useState<Operation[]>([])
  const windowSize = useScreenSize()

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
        <div className="history__calendar">
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
            showIcon={windowSize.width < 900}
            showButtonBar
            inline={windowSize.width >= 900}
          />
          <RedirectionCardDesktop></RedirectionCardDesktop>
        </div>
        {operations?.length > 0
          ? <HistoryCardContainer operations={operations}></HistoryCardContainer>
          : operationsData.loaded && <span className="empty">
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