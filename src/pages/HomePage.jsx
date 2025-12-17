import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiImage, FiMapPin, FiStar } from "react-icons/fi";
import { MainURL } from "../config/api";
import styles from "./HomePage.module.css";

function HomePage() {
  const [citiesCount, setCitiesCount] = useState(null);

  // Slides
  const photoSlides = useMemo(
    () => ["/images/card-photo-1.jpg", "/images/card-photo-2.jpg", "/images/card-photo-3.jpg"],
    []
  );

  const mapSlides = useMemo(
    () => ["/images/hero-cities-map.jpg", "/images/hero-countries-map.png", "/images/hero-cities-map.jpg"],
    []
  );

  const ratingSlides = useMemo(
    () => ["/images/card-rating-1.jpg", "/images/card-rating-2.jpg", "/images/card-rating-3.jpg"],
    []
  );

  // ✅ cada card con su propio index + fade
  const [photoIndex, setPhotoIndex] = useState(0);
  const [mapIndex, setMapIndex] = useState(0);
  const [ratingIndex, setRatingIndex] = useState(0);

  const [fadePhoto, setFadePhoto] = useState(false);
  const [fadeMap, setFadeMap] = useState(false);
  const [fadeRating, setFadeRating] = useState(false);

  // pill (se queda como lo tenías)
  const [pillIndex, setPillIndex] = useState(0);

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

  // ✅ helper: cambia a un index distinto (random)
  const pickNextIndex = (current, length) => {
    if (length <= 1) return current;
    let next = current;
    while (next === current) next = Math.floor(Math.random() * length);
    return next;
  };

  // ✅ interval random independiente por card (MÁS LENTO)
  useEffect(() => {
    const makeInterval = ({ setFade, setIndex, slides, minMs, maxMs }) => {
      let mainTimeoutId = null;
      let fadeTimeoutId = null;

      const tick = () => {
        setFade(true);

        fadeTimeoutId = setTimeout(() => {
          setIndex((prev) => pickNextIndex(prev, slides.length));
          setFade(false);

          const nextDelay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
          mainTimeoutId = setTimeout(tick, nextDelay);
        }, 260); // fade suave
      };

      const firstDelay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
      mainTimeoutId = setTimeout(tick, firstDelay);

      return () => {
        clearTimeout(mainTimeoutId);
        clearTimeout(fadeTimeoutId);
      };
    };

    // ✅ Rangos más “humanos” para que no cambien una tras otra
    const stopPhoto = makeInterval({
      setFade: setFadePhoto,
      setIndex: setPhotoIndex,
      slides: photoSlides,
      minMs: 9000,
      maxMs: 16000,
    });

    const stopMap = makeInterval({
      setFade: setFadeMap,
      setIndex: setMapIndex,
      slides: mapSlides,
      minMs: 11000,
      maxMs: 19000,
    });

    const stopRating = makeInterval({
      setFade: setFadeRating,
      setIndex: setRatingIndex,
      slides: ratingSlides,
      minMs: 10000,
      maxMs: 18000,
    });

    // pill change aparte (suave)
    const pillTimer = setInterval(() => {
      setPillIndex((prev) => (prev + 1) % 3);
    }, 2600);

    return () => {
      stopPhoto();
      stopMap();
      stopRating();
      clearInterval(pillTimer);
    };
  }, [photoSlides, mapSlides, ratingSlides]);

  const photoBg = photoSlides[photoIndex % photoSlides.length];
  const mapBg = mapSlides[mapIndex % mapSlides.length];
  const ratingBg = ratingSlides[ratingIndex % ratingSlides.length];

  return (
    <div className={styles.page}>
      <div className={styles.home}>
        <section className={styles.hero}>
          <div className={styles.heroBg} aria-hidden="true" />

          <div className={styles.heroText}>
            <div className={styles.topRow}>
              <p className={styles.badge}>Travel Journal • Personal Memories</p>

              <span className={styles.stat}>
                {citiesCount === null ? "Loading..." : `${citiesCount} cities saved`}
              </span>
            </div>

            <h1 className={styles.title}>CityVerse</h1>

            <p className={styles.subtitle}>
              Your personal travel collection — save cities, photos and experiences from your journeys.
            </p>

            <p className={styles.lead}>
              Capture the places you’ve been, what you felt, and what you’d recommend — all in one clean space.
            </p>

            <div className={styles.actions}>
              <Link className="btn primary" to="/countries">
                Start Exploring
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
                  <span className={`${styles.pill} ${pillIndex === 0 ? styles.pillActive : ""}`}>Photos</span>
                  <span className={`${styles.pill} ${pillIndex === 1 ? styles.pillActive : ""}`}>Notes</span>
                  <span className={`${styles.pill} ${pillIndex === 2 ? styles.pillActive : ""}`}>Rating</span>
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
          <article
            className={`${styles.card} ${fadePhoto ? styles.cardFading : ""}`}
            style={{ backgroundImage: `url("${photoBg}")` }}
          >
            <div className={`${styles.iconBadge} ${styles.iconPhoto}`}>
              <FiImage size={28} />
            </div>
            <h3>Photo-first memories</h3>
            <p>Attach an image and keep your trips visual — like a personal album.</p>
          </article>

          <article
            className={`${styles.card} ${fadeMap ? styles.cardFading : ""}`}
            style={{ backgroundImage: `url("${mapBg}")` }}
          >
            <div className={`${styles.iconBadge} ${styles.iconMap}`}>
              <FiMapPin size={28} />
            </div>
            <h3>Places you’ve lived</h3>
            <p>Explore destinations and jump to Google Maps from the city details.</p>
          </article>

          <article
            className={`${styles.card} ${fadeRating ? styles.cardFading : ""}`}
            style={{ backgroundImage: `url("${ratingBg}")` }}
          >
            <div className={`${styles.iconBadge} ${styles.iconStar}`}>
              <FiStar size={28} />
            </div>
            <h3>Your rating, your story</h3>
            <p>Rate each city to remember what you loved (or what you’d skip next time).</p>
          </article>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
