import CityListPage from "./CityListPage";
import { FcGlobe } from "react-icons/fc";
import styles from "./HomePage.module.css";

function HomePage() {
  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          CityVerse <FcGlobe />
        </h1>

        <p className={styles.subtitle}>
          Explora ciudades, mira fotos y guarda tus favoritas.
        </p>

        <p className={styles.hint}>
          Selecciona una ciudad para comenzar
        </p>
      </header>

      <CityListPage />
    </div>
  );
}

export default HomePage;
