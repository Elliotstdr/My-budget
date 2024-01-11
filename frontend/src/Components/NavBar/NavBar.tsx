import "./NavBar.scss";
import { FaHome, FaUserCog, FaUpload, FaTools, FaHistory } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar">
      <NavLink className={(nav) => (nav.isActive ? "nav-active" : "")} to="/">
        <FaHome />
        <span>Accueil</span>
      </NavLink>
      <NavLink className={(nav) => (nav.isActive ? "nav-active" : "")} to="/import">
        <FaUpload />
        <span>Importer</span>
      </NavLink>
      <NavLink className={(nav) => (nav.isActive ? "nav-active" : "")} to="/statistics">
        <FaChartLine />
        <span>Statistiques</span>
      </NavLink>
      <NavLink className={(nav) => (nav.isActive ? "nav-active" : "")} to="/tools">
        <FaTools />
        <span>Outils</span>
      </NavLink>
      <NavLink className={(nav) => (nav.isActive ? "nav-active" : "")} to="/history">
        <FaHistory />
        <span>Historique</span>
      </NavLink>
      <NavLink className={(nav) => (nav.isActive ? "nav-active param" : "param")} to="/parameters">
        <FaUserCog />
      </NavLink>
    </nav>
  );
};

export default NavBar;