import "./HistoryCard.scss";
import { IoExtensionPuzzle } from "react-icons/io5";
import { FaExclamation, FaHouseUser, FaRegMoneyBillAlt } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { FaScaleBalanced, FaGear } from "react-icons/fa6";
import { MdOutlinePersonAddAlt } from "react-icons/md";

interface Props {
  operation: Operation
}

const HistoryCard = (props: Props) => {
  const getIcon = (typeLabel: string) => {
    switch (typeLabel) {
      case "Frais fixe":
        return <div style={{ backgroundColor: "#148F77" }} className="icon"><IoExtensionPuzzle></IoExtensionPuzzle></div>
      case "Exceptionnel":
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
    <div className="history__list__item">
      {getIcon(props.operation.type.label)}
      <div style={{ width: "6rem" }}>{props.operation.label}</div>
      <div style={{ width: "4rem", color: props.operation.value > 0 ? "#339c0e" : "#e03232" }}>
        {props.operation.value > 0 ? "+" + props.operation.value : props.operation.value}€
      </div>
      <div>{props.operation.type.label}</div>
    </div>
  );
};

export default HistoryCard;