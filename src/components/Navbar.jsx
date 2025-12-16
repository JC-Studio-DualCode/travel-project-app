import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>






      <NavLink 
      to="/"
      className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` :styles.link)}
      >
        Home
      </NavLink>

      <NavLink
      to="/about"
      className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` :styles.link)}
      >
        About
      </NavLink>

      <NavLink
      to="/cities/add"
      className={({ isActive }) => isActive ? `${styles.link} ${styles.cta}` : `${styles.link} ${styles.cta}`}
      >
        Add New City
      </NavLink>
    </nav>
  );
}

export default Navbar;
