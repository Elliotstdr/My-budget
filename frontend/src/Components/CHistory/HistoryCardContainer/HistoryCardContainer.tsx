import { literalMonthAndYear } from "../../../Services/functions";
import { Divider } from "primereact/divider";
import { groupByMonth } from "../../../Services/statistics";
import { useFetchGet } from "../../../Services/api";
import HistoryCard from "./HistoryCard/HistoryCard";

interface Props {
  operations: Operation[]
}

const HistoryCardContainer = (props: Props) => {
  const typesData = useFetchGet<Type[]>("/type")

  return (
    <div className="
      history__list w-full mt-2 px-2 
      min-[500px]:flex min-[500px]:flex-col min-[500px]:items-center min-[500px]:mt-4
      md:overflow-y-scroll md:overflow-x-hidden md:px-8 md:mt-0 md:w-[45%] h-[calc(100vh-12rem)]">
      {groupByMonth(props.operations).map((groupOperation, key) =>
        <div key={key}>
          <div className="divider" style={{ display: "flex", alignItems: "center" }}>
            <span style={{ margin: "0 0.5rem" }}>
              {literalMonthAndYear(new Date(groupOperation[0].datePeriod))}
            </span>
            <Divider style={{ width: "50%" }}></Divider>
          </div>
          {typesData.data && groupOperation.map((x) =>
            <HistoryCard operation={x} key={x._id}></HistoryCard>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryCardContainer;