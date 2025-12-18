import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Página no encontrada</h1>

        <p className={styles.text}>La ruta que buscas no existe o fue movida.</p>

        <div className={styles.actions}>
          <Link to="/" className="btn primary">Ir al inicio</Link>
          <Link to="/cities" className="btn ghost">Ver ciudades</Link>
        </div>
      </section>
    </div>
  );
}

export default NotFoundPage;
