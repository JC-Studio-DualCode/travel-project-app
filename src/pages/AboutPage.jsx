import { Link } from "react-router-dom";
import { FcGlobe } from "react-icons/fc";
import { FiMapPin, FiDatabase, FiGitBranch } from "react-icons/fi";
import styles from "./AboutPage.module.css";

function AboutPage() {
  return (
    <div className={styles.about}>
      <section className={styles.aboutHero}>
        <div className={styles.aboutTitle}>
          <h1>
            CityVerse <FcGlobe style={{ verticalAlign: "middle" }} />
          </h1>
          <p className={styles.aboutSubtitle}>
            A React SPA to explore cities, view details, and manage data with CRUD.
          </p>
          <p className={styles.aboutLead}>
            Built as an Ironhack project to practice React Router, API integration with Axios,
            and clean component-driven UI.
          </p>

          <div className={styles.aboutActions}>
            <Link className="btn primary" to="/cities">Explore Cities</Link>
            <Link className="btn ghost" to="/">Back Home</Link>
          </div>
        </div>
      </section>

      <section className={styles.aboutGrid}>
        <div className={styles.aboutCard}>
          <FiMapPin size={22} />
          <h3>Routing & Navigation</h3>
          <p>Dynamic routes for city details, plus a clean navigation flow using React Router.</p>
        </div>

        <div className={styles.aboutCard}>
          <FiDatabase size={22} />
          <h3>API + Data Fetching</h3>
          <p>
            Axios requests with <span className={styles.code}>.get</span>,{" "}
            <span className={styles.code}>.then</span>,{" "}
            <span className={styles.code}>.catch</span> and loading states.
          </p>
        </div>

        <div className={styles.aboutCard}>
          <FiGitBranch size={22} />
          <h3>CRUD Features</h3>
          <p>Create, read, update and delete cities — structured for scalability and iteration.</p>
        </div>
      </section>

      <section className={styles.aboutStack}>
        <h2>Tech Stack</h2>
        <div className={styles.chips}>
          <span className={styles.chip}>React</span>
          <span className={styles.chip}>React Router</span>
          <span className={styles.chip}>Axios</span>
          <span className={styles.chip}>Vite</span>
          <span className={styles.chip}>CSS</span>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
