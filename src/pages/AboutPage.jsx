import { Link } from "react-router-dom";
import { FcGlobe } from "react-icons/fc";
import { FiMapPin, FiDatabase, FiGitBranch } from "react-icons/fi";
import styles from "./AboutPage.module.css";
import { FaReact } from "react-icons/fa";
import { SiReactrouter, SiAxios, SiVite, SiCss3 } from "react-icons/si";


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
        </div>
      </section>

      <section className={styles.aboutGrid}>
        <div className={styles.aboutCard}>
          <div className={styles.iconBadge}>
            <FiMapPin size={22} />
          </div>
          <h3>Routing & Navigation</h3>
          <p>Dynamic routes for city details, plus a clean navigation flow using React Router.</p>
        </div>

        <div className={styles.aboutCard}>
          <div className={styles.iconBadge}>
            <FiDatabase size={22} />
          </div>
          <h3>API + Data Fetching</h3>
          <p>
            Axios requests with <code>.get</code>,{" "}
            <code>.then</code>,{" "}
            <code>.catch</code> and loading states.
          </p>
        </div>

        <div className={styles.aboutCard}>
          <div className={styles.iconBadge}>
            <FiGitBranch size={22} />
          </div>
          <h3>CRUD Features</h3>
          <p>Create, read, update and delete cities — structured for scalability and iteration.</p>
        </div>
      </section>
        <section className={styles.aboutStack}>
          <h2>Tech Stack</h2>

          <div className={styles.stackGrid}>
            <div className={styles.stackItem}>
              <div className={styles.iconBadge}><FaReact size={22} /></div>
              <span>React</span>
            </div>

            <div className={styles.stackItem}>
              <div className={styles.iconBadge}><SiReactrouter size={22} /></div>
              <span>React Router</span>
            </div>

            <div className={styles.stackItem}>
              <div className={styles.iconBadge}><SiAxios size={22} /></div>
              <span>Axios</span>
            </div>

            <div className={styles.stackItem}>
              <div className={styles.iconBadge}><SiVite size={22} /></div>
              <span>Vite</span>
            </div>

            <div className={styles.stackItem}>
              <div className={styles.iconBadge}><SiCss3 size={22} /></div>
              <span>CSS</span>
            </div>
          </div>
        </section>
    </div>
  );
}

export default AboutPage;
