import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { FaUserCog } from "react-icons/fa";

type Props = {
  title: string,
}

const Header = (props: Props) => {
  const navigate = useNavigate()

  return (
    <div className='header'>
      <h1>{props.title}</h1>
      <span onClick={() => navigate("/parameters")}>
        <FaUserCog></FaUserCog>
      </span>
    </div>
  );
};

export default Header;