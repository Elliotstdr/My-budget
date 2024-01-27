import "./HistoryCardContainer.scss";
import { literalMonthAndYear } from "../../../../Services/functions";
import { Divider } from "primereact/divider";
import { groupByMonth } from "../../../../Services/statistics";
import { useFetchGet } from "../../../../Services/api";
import HistoryCard from "./HistoryCard/HistoryCard";

interface Props {
  operations: Operation[]
}

const HistoryCardContainer = (props: Props) => {
  const typesData = useFetchGet<Type[]>("/type")

  return (
    <div className="history__list">
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