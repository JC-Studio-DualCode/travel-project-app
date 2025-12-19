import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Page Not Found</h1>

        <p className={styles.text}>The route you are looking for does not exist or has been moved.</p>

        <div className={styles.actions}>
          <Link to="/" className="btn primary">Go to Home</Link>
          <Link to="/cities" className="btn ghost">View Cities</Link>
        </div>
      </section>
    </div>
  );
}

export default NotFoundPage;