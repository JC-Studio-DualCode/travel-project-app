import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";

function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };

    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <header className={styles.navWrap}>
      <nav className={styles.navbar}>
        {/* LEFT */}
        <div className={styles.left}>
          <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
            Home
          </NavLink>

          {/* CTA Dropdown */}
          <div className={styles.dropdownWrap} ref={menuRef}>
            <button
              type="button"
              className={styles.ctaBtn}
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              Start Exploring
            </button>

            {open && (
              <div className={styles.dropdown} role="menu">
                <NavLink
                  to="/cities"
                  className={styles.dropdownItem}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  All Cities
                </NavLink>

                <NavLink
                  to="/countries"
                  className={styles.dropdownItem}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  Countries
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* CENTER */}
        <div className={styles.center} aria-label="Brand">
          <NavLink to="/" className={styles.brand} onClick={() => setOpen(false)}>
            CityVerse
          </NavLink>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
            About
          </NavLink>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
