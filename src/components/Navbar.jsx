import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
      >
        About
      </NavLink>

      {/* CTA — no necesita estado activo */}
      <NavLink
        to="/cities/add"
        className={`${styles.link} ${styles.cta}`}
      >
        Add New City
      </NavLink>
    </nav>
  );
}

export default Navbar;

