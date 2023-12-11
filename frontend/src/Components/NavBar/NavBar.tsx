import "./NavBar.scss";
import { IoHomeOutline } from "react-icons/io5";
import { CiImport } from "react-icons/ci";
import { GoGraph } from "react-icons/go";
import { VscTools } from "react-icons/vsc";
import { MdHistory } from "react-icons/md";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar">
      <NavLink className={(nav) => (nav.isActive ? "nav-active" : "")} to="/">
        <IoHomeOutline />
        <span>Accueil</span>
      </NavLink>
      <NavLink className={(nav) => (nav.isActive ? "nav-active" : "")} to="/import">
        <CiImport />
        <span>Importer</span>
      </NavLink>
      <NavLink className={(nav) => (nav.isActive ? "nav-active" : "")} to="/statistics">
        <GoGraph />
        <span>Statistiques</span>
      </NavLink>
      <NavLink className={(nav) => (nav.isActive ? "nav-active" : "")} to="/tools">
        <VscTools />
        <span>Outils</span>
      </NavLink>
      <NavLink className={(nav) => (nav.isActive ? "nav-active" : "")} to="/history">
        <MdHistory />
        <span>Historique</span>
      </NavLink>
    </nav>
  );
};

export default NavBar;