import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";

function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // ✅ Cierra dropdown si cambias de ruta (consistencia total)
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

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
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          {/* CTA Dropdown */}
          <div className={styles.dropdownWrap} ref={menuRef}>
            <button
              type="button"
              className={styles.ctaBtn}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls="start-exploring-menu"
              onClick={() => setOpen((v) => !v)}
              onKeyDown={(e) => {
                // ✅ Enter / Space abre/cierra, Escape cierra
                if (e.key === "Escape") setOpen(false);
              }}
            >
              Start Exploring
            </button>

            {open && (
              <div
                id="start-exploring-menu"
                className={styles.dropdown}
                role="menu"
              >
                <NavLink
                  to="/cities"
                  className={styles.dropdownItem}
                  role="menuitem"
                >
                  All Cities
                </NavLink>

                <NavLink
                  to="/countries"
                  className={styles.dropdownItem}
                  role="menuitem"
                >
                  Countries
                </NavLink>
              </div>
            )}
          </div>
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

