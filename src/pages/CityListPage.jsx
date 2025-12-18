import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainURL } from "../config/api";
import styles from "./CityListPage.module.css";

import {
  FiMapPin,
  FiPlus,
  FiArrowLeft,
  FiSearch,
  FiChevronRight,
  FiStar,
} from "react-icons/fi";

const FALLBACK_IMG = "/images/placeholder-city.jpg"; // crea esta imagen o cambia la ruta

function CityListPage() {
  const { country } = useParams();
  const safeCountry = useMemo(() => decodeURIComponent(country || ""), [country]);

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [displayCities, setDisplayCities] = useState(0);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${MainURL}/cities.json`)
      .then((res) => {
        const citiesObj = res.data || {};

        const filteredCities = Object.entries(citiesObj)
          .filter(([_, city]) => city?.country === safeCountry)
          .map(([id, city]) => ({ id, ...city }));

        setCities(filteredCities);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [safeCountry]);

  useEffect(() => {
    if (loading) return;

    const target = cities.length;
    const duration = 600;
    const start = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCities(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [loading, cities.length]);

  const hasQuery = query.trim().length > 0;

  const filteredCities = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;

    return cities.filter((c) => {
      const name = (c?.name || "").toLowerCase();
      const desc = (c?.description || "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [cities, query]);

  const normalizeImg = (v) => (typeof v === "string" ? v.trim() : "");
  const getCityImage = (city) =>
    normalizeImg(city?.mainImage) ||
    normalizeImg(city?.image) ||
    (Array.isArray(city?.images) ? normalizeImg(city.images[0]) : "") ||
    "";

  const onImgError = (e) => {
    if (e.currentTarget.src.includes(FALLBACK_IMG)) return;
    e.currentTarget.src = FALLBACK_IMG;
  };

  useEffect(() => {
    if (loading) return;

    const cards = document.querySelectorAll(`.${styles.cityCard}`);
    if (!cards.length) return;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (reduceMotion) {
      cards.forEach((el) => el.classList.add(styles.cardVisible));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.cardVisible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    cards.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading, filteredCities.length, styles.cityCard, styles.cardVisible]);

  if (loading) {
    return (
      <div className={styles.pageBg}>
        <div className={styles.cityList}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link className={styles.crumbLink} to="/">
              Home
            </Link>
            <span className={styles.crumbSep} aria-hidden="true">
              <FiChevronRight />
            </span>
            <Link className={styles.crumbLink} to="/countries">
              Countries
            </Link>
            <span className={styles.crumbSep} aria-hidden="true">
              <FiChevronRight />
            </span>
            <span className={styles.crumbCurrent}>{safeCountry}</span>
          </nav>

          <h1 className={`${styles.heroTitle} ${styles.enterTitle}`}>
            {safeCountry}
          </h1>

          <section className={styles.cityHero}>
            <div className={styles.heroTopRow}>
              <span className={styles.heroKicker}>Travel Journal • CityVerse</span>
            </div>

            <p className={`${styles.heroSubtitlePill} ${styles.enterSoft}`}>
              Loading cities…
            </p>

            <div className={styles.heroChips}>
              <span className={styles.chip}>
                <FiStar aria-hidden="true" /> —
              </span>
              <span className={styles.chip}>
                <FiMapPin aria-hidden="true" /> —
              </span>
            </div>
          </section>

          <div className={styles.heroDivider} aria-hidden="true" />

          <section className={styles.cityGrid} aria-label="Loading cities">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonTop}>
                  <div className={styles.skeletonIcon} />
                  <div className={styles.skeletonBadge} />
                </div>
                <div className={styles.skeletonImage} />
                <div className={styles.skeletonLineLg} />
                <div className={styles.skeletonLineSm} />
              </div>
            ))}
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageBg}>
      <div className={styles.cityList}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link className={styles.crumbLink} to="/">
            Home
          </Link>
          <span className={styles.crumbSep} aria-hidden="true">
            <FiChevronRight />
          </span>
          <Link className={styles.crumbLink} to="/countries">
            Countries
          </Link>
          <span className={styles.crumbSep} aria-hidden="true">
            <FiChevronRight />
          </span>
          <span className={styles.crumbCurrent}>{safeCountry}</span>
        </nav>

        <h1 className={`${styles.heroTitle} ${styles.enterTitle}`}>
          {safeCountry}
        </h1>

        <section className={styles.cityHero}>
          <div className={styles.heroTopRow}>
            <span className={styles.heroKicker}>Travel Journal • CityVerse</span>
          </div>

          <div className={styles.heroSecondaryChips}>
            <span className={styles.heroJournal}>
              <span className={styles.redPin} aria-hidden="true">
                📍
              </span>
              Cities of {safeCountry}
            </span>
          </div>

          <p className={`${styles.heroSubtitlePill} ${styles.enterSoft}`}>
            Found <strong>{displayCities}</strong> cities.
          </p>

          <div className={styles.heroChips}>
            <span className={styles.chip}>
              <FiMapPin aria-hidden="true" />
              {cities.length} total
            </span>

            <span className={styles.chip}>
              <FiStar aria-hidden="true" />
              {filteredCities.length} shown
            </span>
          </div>

          <div className={styles.searchRow}>
            <span className={styles.searchIcon} aria-hidden="true">
              <FiSearch />
            </span>

            <input
              className={styles.searchInput}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city…"
              aria-label="Search city"
            />

            {hasQuery && (
              <button
                className={styles.clearBtn}
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          <div className={styles.actionsPill}>
            <div className={styles.cityActions}>
              <Link
                to={`/countries/${encodeURIComponent(safeCountry)}/cities/add`}
                className={`btn primary ${styles.btnSm}`}
              >
                <FiPlus style={{ verticalAlign: "middle", marginRight: 8 }} />
                Add City
              </Link>

              <Link to="/countries" className={`btn ghost ${styles.btnSm}`}>
                <FiArrowLeft style={{ verticalAlign: "middle", marginRight: 8 }} />
                Back to Countries
              </Link>
            </div>
          </div>
        </section>

        <div className={styles.heroDivider} aria-hidden="true" />

        {filteredCities.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No cities found</p>
            <p className={styles.emptyHint}>
              Try another search or clear it to see all cities.
            </p>
            <button
              type="button"
              className={styles.clearEmptyBtn}
              onClick={() => setQuery("")}
            >
              Clear search
            </button>
          </div>
        ) : (
          <section className={styles.cityGrid}>
            {filteredCities.map((city, index) => {
              const img = getCityImage(city);
              const rating =
                city?.reviews?.length > 0
                  ? (
                      city.reviews.reduce(
                        (sum, r) => sum + Number(r.rating || 0),
                        0
                      ) / city.reviews.length
                    ).toFixed(1)
                  : null;

              return (
                <div
                  key={city.id}
                  className={styles.cityCard}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.iconBadge} aria-hidden="true">
                      <FiMapPin size={22} />
                    </div>

                    <div className={styles.cardTitleBlock}>
                      <h3>{city.name}</h3>
                      <p className={styles.cardMeta}>{safeCountry}</p>
                    </div>

                    <div className={styles.cardBadges}>
                      {rating ? (
                        <span className={styles.ratingBadge}>⭐ {rating}</span>
                      ) : (
                        <span className={styles.ratingBadgeMuted}>⭐ —</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.imageWrap}>
                    <img
                      src={img || FALLBACK_IMG}
                      alt={city.name}
                      loading="lazy"
                      onError={onImgError}
                    />
                  </div>

                  <p className={styles.cardDesc}>
                    {city.description || "No description yet."}
                  </p>

                  <Link
                    to={`/countries/${encodeURIComponent(safeCountry)}/cities/${city.id}`}
                    className={`btn ghost ${styles.viewBtn}`}
                  >
                    View
                  </Link>
                </div>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}

export default CityListPage;
