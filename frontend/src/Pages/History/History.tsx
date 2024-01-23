import { useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import NavBar from "../../Components/NavBar/NavBar";
import { useFetchGet } from "../../Services/api";
import RedirectionCardDesktop from "../../Components/CHistory/RedirectionCardDesktop/RedirectionCardDesktop";
import HistoryCardContainer from "../../Components/CHistory/HistoryCardContainer/HistoryCardContainer";
import HistoryCalendar from "../../Components/CHistory/HistoryCalendar/HistoryCalendar";
import NoHistoryDisplay from "../../Components/CHistory/NoHistoryDisplay/NoHistoryDisplay";

const History = () => {
  const operationsData = useFetchGet<Operation[]>("/operation")
  const [operations, setOperations] = useState<Operation[]>([])

  useEffect(() => {
    operationsData.loaded && operationsData.data && setOperations(operationsData.data)
    // eslint-disable-next-line
  }, [operationsData.loaded])

  return (
    <>
      <Header title="Historique"></Header>
      <div className="page main-color md:flex-row md:justify-center md:items-start md:my-8 md:text-base">
        <div className="md:px-8 md:flex-grow md:max-w-[768px] md:w-1/2">
          <HistoryCalendar setOperations={setOperations}></HistoryCalendar>
          <RedirectionCardDesktop></RedirectionCardDesktop>
        </div>
        {operations?.length > 0
          ? <HistoryCardContainer operations={operations}></HistoryCardContainer>
          : operationsData.loaded && <NoHistoryDisplay></NoHistoryDisplay>
        }
      </div>
      <NavBar></NavBar>
    </>
  );
};

export default History;