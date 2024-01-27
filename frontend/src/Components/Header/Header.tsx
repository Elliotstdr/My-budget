import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { FaUserCog } from "react-icons/fa";
import image from "src/assets/tirelire-blue.png";

type Props = {
  title: string,
  className?: string
}

const Header = (props: Props) => {
  const navigate = useNavigate()

  return (
    <div className={`header ${props.className || ""}`}>
      <h1>
        <img src={image} alt="background home" />
        {props.title}
      </h1>
      <span onClick={() => navigate("/parameters")}>
        <FaUserCog></FaUserCog>
      </span>
    </div>
  );
};

export default Header;