import "./ReturnButton.scss";
import { IoIosArrowBack } from "react-icons/io";

interface Props {
  action?: React.MouseEventHandler<HTMLButtonElement>
}

const ReturnButton = (props: Props) => {
  return (
    <button
      className="returnbutton"
      onClick={props.action}
    >
      <div>
        <IoIosArrowBack />
        <span>Retour</span>
      </div>
    </button>
  );
};

export default ReturnButton;