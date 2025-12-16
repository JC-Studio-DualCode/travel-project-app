import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <NavLink className={styles.navLink} to="/">Home</NavLink>
      <NavLink className={styles.navLink} to="/about">About</NavLink>
      <NavLink className={styles.navLink} to="/cities/add">Add New City</NavLink>
    </nav>
  );
}

export default Navbar;
