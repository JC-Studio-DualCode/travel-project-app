import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FcGlobe } from "react-icons/fc";
import { FiImage, FiMapPin, FiStar } from "react-icons/fi";
import { MainURL } from "../config/api";
import styles from "./HomePage.module.css";

function HomePage() {
  const [citiesCount, setCitiesCount] = useState(null);

  useEffect(() => {
    axios
      .get(`${MainURL}/cities.json`)
      .then((res) => {
        const data = res.data;
        const count = data ? Object.keys(data).length : 0;
        setCitiesCount(count);
      })
      .catch((err) => {
        console.log("Error fetching cities count:", err);
        setCitiesCount(0);
      });
  }, []);

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <div className={styles.topRow}>
            <p className={styles.badge}>Travel Journal • Personal Memories</p>

            <span className={styles.stat}>
              {citiesCount === null ? "Loading..." : `${citiesCount} cities saved`}
            </span>
          </div>

          <h1 className={styles.title}>
            CityVerse <FcGlobe style={{ verticalAlign: "middle" }} />
          </h1>

          <p className={styles.subtitle}>
            Your personal travel collection — save cities, photos and experiences from your journeys.
          </p>

          <p className={styles.lead}>
            Capture the places you’ve been, what you felt, and what you’d recommend — all in one clean space.
          </p>

          <div className={styles.actions}>
            <Link className="btn primary" to="/cities">
              Explore Cities
            </Link>
          
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.memoryCard}>
            <div className={styles.memoryTop}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>

            <div className={styles.memoryBody}>
              <div className={styles.memoryLineLg} />
              <div className={styles.memoryLine} />
              <div className={styles.memoryLineSm} />

              <div className={styles.pills}>
                <span className={styles.pill}>Photos</span>
                <span className={styles.pill}>Notes</span>
                <span className={styles.pill}>Rating</span>
              </div>

              <div className={styles.stamp}>
                <span className={styles.stampLabel}>MEMORY</span>
                <span className={styles.stampValue}>Saved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.grid}>
        
        <article className={styles.card}>
          <div className={`${styles.card} ${styles.cardPhoto}`}>
            <FiImage size={22} />
          </div>
          <h3>Photo-first memories</h3>
          <p>Attach an image and keep your trips visual — like a personal album.</p>
        </article>

        <article className={`${styles.card} ${styles.cardMap}`}>
          <div className={styles.iconBadge}>
            <FiMapPin size={22} />
          </div>
          <h3>Places you’ve lived</h3>
          <p>Explore destinations and jump to Google Maps from the city details.</p>
        </article>

        <article className={`${styles.card} ${styles.cardRating}`}>
          <div className={styles.iconBadge}>
            <FiStar size={22} />
          </div>
          <h3>Your rating, your story</h3>
          <p>Rate each city to remember what you loved (or what you’d skip next time).</p>
        </article>
      </section>
    </div>
  );
}

export default HomePage;
