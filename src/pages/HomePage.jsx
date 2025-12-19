import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
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
        setCitiesCount(data ? Object.keys(data).length : 0);
      })
      .catch(() => setCitiesCount(0));
  }, []);

  const photoSlides = useMemo(
    () => ["images/card-photo.jpg", "/images/card-photo-1.jpg", "/images/card-photo-2.jpg",
       "/images/card-photo-3.jpg", "/images/card-photo-4.jpg", 
       "/images/card-photo-5.jpg", "/images/card-photo-6.jpg"],
    []
  );

  const mapSlides = useMemo(
    () => ["/images/card-map-4.jpg", "/images/card-map.jpg",
       "/images/card-map-2.jpg", "/images/card-map-3.jpg", ],
    []
  );

  const ratingSlides = useMemo(
    () => ["/images/card-rating-1.jpg", "/images/card-rating-2.jpg",
       "/images/card-rating-3.jpg", "/images/card-rating-4.jpg",
       "/images/card-rating-5.jpg", "/images/card-rating-6.jpg"],
    []
  );

  const [photoIndex, setPhotoIndex] = useState(0);
  const [mapIndex, setMapIndex] = useState(0);
  const [ratingIndex, setRatingIndex] = useState(0);

  const [fadePhoto, setFadePhoto] = useState(false);
  const [fadeMap, setFadeMap] = useState(false);
  const [fadeRating, setFadeRating] = useState(false);

  const pickNextIndex = (current, length) => {
    if (!length || length <= 1) return current;
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

      mainTimeout = setTimeout(tick, Math.random() * (maxMs - minMs) + minMs);

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

  const photoBg = photoSlides[photoIndex] || "";
  const mapBg = mapSlides[mapIndex] || "";
  const ratingBg = ratingSlides[ratingIndex] || "";

  const pill1Ref = useRef(null);
  const pill2Ref = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add(styles.revealIn);
          else entry.target.classList.remove(styles.revealIn);
        });
      },
      { threshold: 0.25 }
    );

    if (pill1Ref.current) io.observe(pill1Ref.current);
    if (pill2Ref.current) io.observe(pill2Ref.current);

    return () => io.disconnect();
  }, [styles.revealIn]);

  const heroPillText =
    "Explore cities worldwide and build your personal travel list — save favourites and discover new places.";

  return (
    <div className={styles.page}>
      <div className={styles.home}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <div className={styles.topRow}>
              <p className={styles.badge}>Travel Journal · CityVerse</p>
              <span className={styles.stat}>
                {citiesCount === null ? "Loading..." : `${citiesCount} cities added`}
              </span>
            </div>

            <div className={styles.textCardWrapper}>
              <div ref={pill1Ref} className={`${styles.textPill} ${styles.revealBase}`}>
                <p>{heroPillText}</p>
              </div>

              <div ref={pill2Ref} className={`${styles.textPillSecondary} ${styles.revealBase}`}>
                <p>{heroPillText}</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.grid}>
          <article
            className={`${styles.card} ${fadePhoto ? styles.cardFading : ""}`}
            style={{ backgroundImage: photoBg ? `url(${photoBg})` : undefined }}
          >
            <FiImage className={`${styles.iconBadge} ${styles.iconPhoto}`} size={28} />
            <h3>Photos that tell the story</h3>
            <p>Add an image to each city and keep your travel memories visual.</p>
          </article>

          <article
            className={`${styles.card} ${fadeMap ? styles.cardFading : ""}`}
            style={{ backgroundImage: mapBg ? `url(${mapBg})` : undefined }}
          >
            <FiMapPin className={`${styles.iconBadge} ${styles.iconMap}`} size={28} />
            <h3>Explore and locate cities</h3>
            <p>Open any city on Google Maps directly from the details page.</p>
          </article>

          <article
            className={`${styles.card} ${fadeRating ? styles.cardFading : ""}`}
            style={{ backgroundImage: ratingBg ? `url(${ratingBg})` : undefined }}
          >
            <FiStar className={`${styles.iconBadge} ${styles.iconStar}`} size={28} />
            <h3>Rate what matters to you</h3>
            <p>Give each city a rating so you remember what you’d repeat (or avoid).</p>
          </article>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
