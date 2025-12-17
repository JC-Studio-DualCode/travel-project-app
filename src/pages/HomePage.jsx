import { Link } from "react-router-dom";
import { FcGlobe } from "react-icons/fc";
import styles from "./HomePage.module.css";

function HomePage() {
  return (
    <div className={styles.home}>
      <section className={styles.homeHero}>
        <div className={styles.homeTitle}>
          <h1>
            CityVerse <FcGlobe style={{ verticalAlign: "middle" }} />
          </h1>

          <p className={styles.homeSubtitle}>
            Your personal travel collection — save cities, photos and experiences from your journeys.
          </p>

          <p className={styles.homeLead}>
            Explore your saved destinations or add a new one to keep your travel memories organized.
          </p>

          <div className={styles.homeActions}>
            <Link className="btn primary" to="/cities">
              Explore Cities
            </Link>

            <Link className="btn ghost" to="/cities/add">
              Add New City
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

