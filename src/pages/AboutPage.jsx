import { Link } from "react-router-dom";
import { FcGlobe } from "react-icons/fc";
import { FiMapPin, FiDatabase, FiGitBranch } from "react-icons/fi";

function AboutPage() {
  return (
    <div className="about">
      <section className="about-hero">
        <div className="about-title">
          <h1>
            CityVerse <FcGlobe style={{ verticalAlign: "middle" }} />
          </h1>
          <p className="about-subtitle">
            A React SPA to explore cities, view details, and manage data with CRUD.
          </p>
        </div>

        <p className="about-lead">
          Built as an Ironhack project to practice React Router, API integration with Axios,
          and clean component-driven UI.
        </p>

        <div className="about-actions">
          <Link className="btn primary" to="/cities">
            Explore Cities
          </Link>
          <Link className="btn ghost" to="/">
            Back Home
          </Link>
        </div>
      </section>

      <section className="about-grid">
        <div className="about-card">
          <FiMapPin size={22} />
          <h3>Routing & Navigation</h3>
          <p>
            Dynamic routes for city details, plus a clean navigation flow using React Router.
          </p>
        </div>

        <div className="about-card">
          <FiDatabase size={22} />
          <h3>API + Data Fetching</h3>
          <p>
            Axios requests with <code>.get</code>, <code>.then</code>, <code>.catch</code> and loading states.
          </p>
        </div>

        <div className="about-card">
          <FiGitBranch size={22} />
          <h3>CRUD Features</h3>
          <p>
            Create, read, update and delete cities — structured for scalability and iteration.
          </p>
        </div>
      </section>

      <section className="about-stack">
        <h2>Tech Stack</h2>
        <div className="chips">
          <span className="chip">React</span>
          <span className="chip">React Router</span>
          <span className="chip">Axios</span>
          <span className="chip">Vite</span>
          <span className="chip">CSS</span>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
