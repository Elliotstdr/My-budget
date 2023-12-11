import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { HiOutlineCog6Tooth } from "react-icons/hi2";

interface Props {
  title: string,
}

const Header = (props: Props) => {
  const navigate = useNavigate()

  return (
    <div className='header'>
      <h1>{props.title}</h1>
      <span onClick={() => navigate("/parameters")}>
        <HiOutlineCog6Tooth></HiOutlineCog6Tooth>
      </span>
    </div>
  );
};

export default Header;