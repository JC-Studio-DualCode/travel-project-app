// AboutPage.jsx
import { Link } from "react-router-dom";
import styles from "./AboutPage.module.css";

import {
  FiMapPin,
  FiDatabase,
  FiGitBranch,
  FiChevronRight,
  FiHome,
  FiGithub,
  FiLinkedin,
} from "react-icons/fi";
import { FaReact } from "react-icons/fa";
import { SiReactrouter, SiAxios, SiVite, SiCss3 } from "react-icons/si";

function AboutPage() {
  return (
    <div className={styles.pageBg}>
      <div className={styles.about}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link className={styles.crumbLink} to="/">
            Home
          </Link>
          <span className={styles.crumbSep} aria-hidden="true">
            <FiChevronRight />
          </span>
          <span className={styles.crumbCurrent}>About</span>
        </nav>

        <div className={styles.pills}>
          <p className={styles.pill}>
            A React SPA to explore cities, view details, and manage data with CRUD.
          </p>

          <p className={styles.pill}>
            Built as an Ironhack project to practice React Router, API integration with Axios,
            and clean component-driven UI.
          </p>
        </div>

        <div className={styles.heroDivider} aria-hidden="true" />

        <section className={styles.aboutGrid}>
          <div className={styles.aboutCard}>
            <div className={styles.iconBadge}>
              <FiMapPin size={22} />
            </div>
            <h3>Routing & Navigation</h3>
            <p>
              Dynamic routes for city details, plus a clean navigation flow using React Router.
            </p>
          </div>

          <div className={styles.aboutCard}>
            <div className={styles.iconBadge}>
              <FiDatabase size={22} />
            </div>
            <h3>API + Data Fetching</h3>
            <p>
              Axios requests with <code>.get</code>, <code>.then</code>, <code>.catch</code> and loading states.
            </p>
          </div>

          <div className={styles.aboutCard}>
            <div className={styles.iconBadge}>
              <FiGitBranch size={22} />
            </div>
            <h3>CRUD Features</h3>
            <p>
              Create, read, update and delete cities — structured for scalability and iteration.
            </p>
          </div>
        </section>

        {/* =========================
            Meet the Team
        ========================= */}
        <section className={styles.team}>
          <h2 className={styles.sectionTitle}>Meet the Team</h2>

          <div className={styles.teamGrid}>
            {/* Carlos */}
            <article className={styles.profileCard}>
              <div className={styles.profileTop}>
                <div className={styles.avatar}>C</div>

                <div className={styles.profileText}>
                  <h3 className={styles.profileName}>Carlos Alfonzo</h3>
                  <p className={styles.role}>Frontend Developer · UI & Pages</p>
                </div>
              </div>

              <ul className={styles.bullets}>
                <li>Designed and polished the UI (hero cards, glass layout, spacing).</li>
                <li>Implemented Home interactions and visual consistency across pages.</li>
                <li>Worked with Axios fetching + loading states and reusable components.</li>
              </ul>

              <div className={styles.skillChips}>
                <span>React</span>
                <span>React Router</span>
                <span>Axios</span>
                <span>CSS Modules</span>
              </div>

              <div className={styles.links}>
                <a href="https://github.com/carliitosway-collab" target="_blank" rel="noreferrer">
                  <FiGithub style={{ verticalAlign: "middle", marginRight: 6 }} />
                  GitHub
                </a>
                <a href="https://linkedin.com/in/YOUR_LINKEDIN" target="_blank" rel="noreferrer">
                  <FiLinkedin style={{ verticalAlign: "middle", marginRight: 6 }} />
                  LinkedIn
                </a>
              </div>
            </article>

            {/* Compañero */}
            <article className={styles.profileCard}>
              <div className={styles.profileTop}>
                <div className={styles.avatarAlt}>T</div>

                <div className={styles.profileText}>
                  <h3 className={styles.profileName}>Joan Jiménez</h3>
                  <p className={styles.role}>Frontend Developer · Data & Navigation</p>
                </div>
              </div>

              <ul className={styles.bullets}>
                <li>Built Countries/Cities navigation flow and routing structure.</li>
                <li>Implemented data mapping, filtering and list rendering.</li>
                <li>Improved integration patterns and app structure for iteration.</li>
              </ul>

              <div className={styles.skillChips}>
                <span>React</span>
                <span>React Router</span>
                <span>Axios</span>
                <span>Components</span>
              </div>

              <div className={styles.links}>
                <a href="https://github.com/Jimix91" target="_blank" rel="noreferrer">
                  <FiGithub style={{ verticalAlign: "middle", marginRight: 6 }} />
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/joan-jim%C3%A9nez-camps-4084a8226/" target="_blank" rel="noreferrer">
                  <FiLinkedin style={{ verticalAlign: "middle", marginRight: 6 }} />
                  LinkedIn
                </a>
              </div>
            </article>
          </div>

          <div className={styles.teamNote}>
            <p>
              Collaboration focused on clean commits, consistent UI, and iterative improvements
              based on feedback and testing.
            </p>
          </div>
        </section>

        {/* =========================
            Tech Stack
        ========================= */}
        <section className={styles.aboutStack}>
          <h2>Tech Stack</h2>

          <div className={styles.stackGrid}>
            <div className={styles.stackItem}>
              <div className={styles.iconBadge}>
                <FaReact size={22} />
              </div>
              <span>React</span>
            </div>

            <div className={styles.stackItem}>
              <div className={styles.iconBadge}>
                <SiReactrouter size={22} />
              </div>
              <span>React Router</span>
            </div>

            <div className={styles.stackItem}>
              <div className={styles.iconBadge}>
                <SiAxios size={22} />
              </div>
              <span>Axios</span>
            </div>

            <div className={styles.stackItem}>
              <div className={styles.iconBadge}>
                <SiVite size={22} />
              </div>
              <span>Vite</span>
            </div>

            <div className={styles.stackItem}>
              <div className={styles.iconBadge}>
                <SiCss3 size={22} />
              </div>
              <span>CSS</span>
            </div>
          </div>

          <div className={styles.stackActions}>
            <Link className={`btn ghost ${styles.btnSm}`} to="/">
              <FiHome style={{ marginRight: 8, verticalAlign: "middle" }} />
              Back Home
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
