import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { FiImage, FiMapPin, FiStar } from "react-icons/fi";
import { MainURL } from "../config/api";
import styles from "./HomePage.module.css";

function HomePage() {
  /* =========================
     DATA
  ========================= */
  const [citiesCount, setCitiesCount] = useState(null);

  useEffect(() => {
    axios
      .get(`${MainURL}/cities.json`)
      .then((res) => {
        const data = res.data;
        setCitiesCount(data ? Object.keys(data).length : 0);
      })
      .catch(() => setCitiesCount(0));
  }, []);

  /* =========================
     SLIDES
  ========================= */
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

  const [photoIndex, setPhotoIndex] = useState(0);
  const [mapIndex, setMapIndex] = useState(0);
  const [ratingIndex, setRatingIndex] = useState(0);

  const [fadePhoto, setFadePhoto] = useState(false);
  const [fadeMap, setFadeMap] = useState(false);
  const [fadeRating, setFadeRating] = useState(false);

  const pickNextIndex = (current, length) => {
    if (length <= 1) return current;
    let next = current;
    while (next === current) next = Math.floor(Math.random() * length);
    return next;
  };

  useEffect(() => {
    const makeInterval = ({ setFade, setIndex, slides, minMs, maxMs }) => {
      let mainTimeout;
      let fadeTimeout;

      const tick = () => {
        setFade(true);

        fadeTimeout = setTimeout(() => {
          setIndex((prev) => pickNextIndex(prev, slides.length));
          setFade(false);

          const delay = Math.random() * (maxMs - minMs) + minMs;
          mainTimeout = setTimeout(tick, delay);
        }, 260);
      };

      mainTimeout = setTimeout(
        tick,
        Math.random() * (maxMs - minMs) + minMs
      );

      return () => {
        clearTimeout(mainTimeout);
        clearTimeout(fadeTimeout);
      };
    };

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

    return () => {
      stopPhoto();
      stopMap();
      stopRating();
    };
  }, [photoSlides, mapSlides, ratingSlides]);

  const photoBg = photoSlides[photoIndex];
  const mapBg = mapSlides[mapIndex];
  const ratingBg = ratingSlides[ratingIndex];

  /* =========================
     MEMORY CARD PILLS
  ========================= */
  const [pillIndex, setPillIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPillIndex((prev) => (prev + 1) % 3);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  /* =========================
     SCROLL REVEAL (LIQUID GLASS)
  ========================= */
  const pill1Ref = useRef(null);
  const pill2Ref = useRef(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealIn);
          } else {
            entry.target.classList.remove(styles.revealIn);
          }
        });
      },
      { threshold: 0.25 }
    );

    if (pill1Ref.current) io.observe(pill1Ref.current);
    if (pill2Ref.current) io.observe(pill2Ref.current);

    return () => io.disconnect();
  }, []);

  /* =========================
     UI
  ========================= */
  return (
    <div className={styles.page}>
      <div className={styles.home}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <div className={styles.topRow}>
              <p className={styles.badge}>Travel Journal • Personal Memories</p>
              <span className={styles.stat}>
                {citiesCount === null ? "Loading..." : `${citiesCount} cities saved`}
              </span>
            </div>

            <div className={styles.textCardWrapper}>
              <div ref={pill1Ref} className={`${styles.textPill} ${styles.revealBase}`}>
                <p>
                  Your personal travel collection — save cities, photos and experiences
                  from your journeys.
                </p>
              </div>

              <div ref={pill2Ref} className={`${styles.textPillSecondary} ${styles.revealBase}`}>
                <p>
                  Capture the places you've been, what you felt, and what you'd recommend —
                  all in one clean space.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.heroVisual} aria-hidden>
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

        <section className={styles.grid}>
          <article className={`${styles.card} ${fadePhoto ? styles.cardFading : ""}`} style={{ backgroundImage: `url(${photoBg})` }}>
            <FiImage className={`${styles.iconBadge} ${styles.iconPhoto}`} size={28} />
            <h3>Photo-first memories</h3>
            <p>Attach an image and keep your trips visual — like a personal album.</p>
          </article>

          <article className={`${styles.card} ${fadeMap ? styles.cardFading : ""}`} style={{ backgroundImage: `url(${mapBg})` }}>
            <FiMapPin className={`${styles.iconBadge} ${styles.iconMap}`} size={28} />
            <h3>Places you’ve lived</h3>
            <p>Explore destinations and jump to Google Maps from the city details.</p>
          </article>

          <article className={`${styles.card} ${fadeRating ? styles.cardFading : ""}`} style={{ backgroundImage: `url(${ratingBg})` }}>
            <FiStar className={`${styles.iconBadge} ${styles.iconStar}`} size={28} />
            <h3>Your rating, your story</h3>
            <p>Rate each city to remember what you loved (or skipped).</p>
          </article>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
