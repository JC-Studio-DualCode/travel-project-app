import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <header className={styles.navWrap}>
      <nav className={styles.navbar}>
        {/* LEFT */}
        <div className={styles.left}>
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/countries" className={styles.cta}>
            Start Exploring
          </NavLink>
        </div>

        {/* CENTER */}
        <div className={styles.center} aria-label="Brand">
          <NavLink to="/" className={styles.brand}>
            CityVerse
          </NavLink>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
