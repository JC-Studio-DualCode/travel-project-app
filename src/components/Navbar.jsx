import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";
import { useAuth } from "../components/AuthContext.jsx";
import LoginModal from "./LoginModal.jsx";


function Navbar() {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on route change
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Click outside / Escape listeners for dropdown
  useEffect(() => {
    if (!open) return;

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
  }, [open]);

  const toggleMenu = () => setOpen((v) => !v);

  return (
    <>
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
                onClick={toggleMenu}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setOpen(false);
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleMenu();
                  }
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
            <NavLink to="/" className={styles.brand}>
              CityVerse
            </NavLink>
          </div>

          {/* RIGHT */}
          <div className={styles.right}>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>

            {user ? (
              <div className={styles.userBox}>
                <img
                  src={user.photoURL || userIcon}  
                  alt={user.displayName || "User"}
                  className={styles.avatar}
                />
                <span className={styles.userName}>
                  {user.displayName || "User"}
                </span>
                <button className={styles.logoutBtn} onClick={logout}>
                  Logout
                </button>
              </div>
            ) : (
              <button
                className={styles.loginBtn}
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default Navbar;
