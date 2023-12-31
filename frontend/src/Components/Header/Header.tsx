import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { FaUserCog } from "react-icons/fa";
import image from "../../assets/tirelire-blue.png";

type Props = {
  title: string,
}

const Header = (props: Props) => {
  const navigate = useNavigate()

  return (
    <div className='header'>
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