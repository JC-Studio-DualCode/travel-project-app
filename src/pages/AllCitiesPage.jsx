import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MainURL } from "../config/api";
import Loader from "../components/Loader";
import styles from "./AllCitiesPage.module.css";

import { FiMapPin, FiHome, FiFlag, FiStar, FiSearch, FiChevronRight } from "react-icons/fi";

function AllCitiesPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Search
  const [query, setQuery] = useState("");

  // ✅ counters visuales (animación suave)
  const [displayCountries, setDisplayCountries] = useState(0);
  const [displayCities, setDisplayCities] = useState(0);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${MainURL}/cities.json`)
      .then((res) => {
        const citiesObj = res.data || {};

        const list = Object.entries(citiesObj).map(([id, city]) => ({
          id,
          ...city,
        }));

        setCities(list);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const totalCities = useMemo(() => cities.length, [cities]);

  const countriesCount = useMemo(() => {
    const set = new Set(
      cities
        .map((c) => (c?.country || "").trim())
        .filter(Boolean)
    );
    return set.size;
  }, [cities]);

  // ✅ animación contadora (solo visual)
  useEffect(() => {
    if (loading) return;

    const duration = 650;
    const start = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayCountries(Math.round(eased * countriesCount));
      setDisplayCities(Math.round(eased * totalCities));

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [loading, countriesCount, totalCities]);

  // ✅ Filtrado simple (sin tocar API)
  const filteredCities = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;

    return cities.filter((c) => {
      const name = (c?.name || "").toLowerCase();
      const country = (c?.country || "").toLowerCase();
      const desc = (c?.description || "").toLowerCase();
      return name.includes(q) || country.includes(q) || desc.includes(q);
    });
  }, [cities, query]);

  const hasQuery = query.trim().length > 0;

  // ✅ Scroll reveal del grid (IntersectionObserver)
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

  if (loading) return <Loader />;

  return (
    <div className={styles.pageBg}>
      <div className={styles.wrap}>
        {/* ✅ Breadcrumb pill */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link className={styles.crumbLink} to="/">
            Home
          </Link>
          <span className={styles.crumbSep} aria-hidden="true">
            <FiChevronRight />
          </span>
          <span className={styles.crumbCurrent}>All Cities</span>
        </nav>

        {/* ✅ TÍTULO ARRIBA */}
        <h1 className={`${styles.heroTitle} ${styles.enterTitle}`}>All Cities</h1>

        {/* ✅ HERO (igual vibe) */}
        <section className={styles.hero}>
          <div className={styles.heroTopRow}>
            <span className={styles.heroKicker}>Travel Journal • CityVerse</span>
          </div>

          <div className={styles.heroSecondaryChips}>
            <span className={styles.heroJournal} aria-label="Personal travel journal">
              <span className={styles.redPin} aria-hidden="true">
                📍
              </span>
              Personal Travel Journal
            </span>
          </div>

          <p
            className={`${styles.heroSubtitlePill} ${styles.enterSoft}`}
            style={{ animationDelay: "70ms" }}
          >
            Explore every memory — across all countries.
          </p>

          <div
            className={`${styles.heroChips} ${styles.enterSoft}`}
            style={{ animationDelay: "120ms" }}
          >
            <span className={styles.chip}>
              <FiFlag aria-hidden="true" />
              {loading ? "—" : displayCountries} countries
            </span>

            <span className={styles.chip}>
              <FiStar aria-hidden="true" />
              {loading ? "—" : displayCities} cities saved
            </span>
          </div>

          <div
            className={`${styles.searchRow} ${styles.enterSoft}`}
            style={{ animationDelay: "170ms" }}
          >
            <span className={styles.searchIcon} aria-hidden="true">
              <FiSearch />
            </span>

            <input
              className={styles.searchInput}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city, country…"
              aria-label="Search city or country"
              disabled={loading}
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

          <div
            className={`${styles.actionsPill} ${styles.enterSoft}`}
            style={{ animationDelay: "220ms" }}
          >
            <div className={styles.actions}>
              <Link className={`btn ghost ${styles.btnSm}`} to="/countries">
                <FiMapPin style={{ marginRight: 8, verticalAlign: "middle" }} />
                Countries
              </Link>

              <Link className={`btn ghost ${styles.btnSm}`} to="/">
                <FiHome style={{ marginRight: 8, verticalAlign: "middle" }} />
                Back Home
              </Link>
            </div>
          </div>
        </section>

        <div className={styles.heroDivider} aria-hidden="true" />

        {/* ✅ STATES */}
        {filteredCities.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No cities found</p>
            <p className={styles.emptyHint}>
              Try a different search or clear it to explore all cities.
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
          <section className={styles.grid} aria-label="All cities grid">
            {filteredCities.map((city, index) => {
              const safeCountry = encodeURIComponent((city?.country || "").trim());
              const safeName = city?.name || "City";
              const img = city?.image;

              const isHot = true; // si quieres, luego lo cambiamos por "rating" u otra métrica

              return (
                <Link
                  key={city.id}
                  to={`/countries/${safeCountry}/cities/${city.id}`}
                  className={styles.cityCard}
                  aria-label={`Open ${safeName} details`}
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  <div className={styles.cardTopRow}>
                    <div className={styles.iconBadge} aria-hidden="true">
                      <FiMapPin size={22} />
                    </div>

                    <span
                      className={`${styles.cityBadge} ${
                        isHot ? styles.cityBadgeHot : ""
                      }`}
                    >
                      {isHot && (
                        <span className={styles.badgeStar} aria-hidden="true">
                          <FiStar />
                        </span>
                      )}
                      {city?.country || "—"}
                    </span>
                  </div>

                  <h3 className={styles.cardTitle}>{safeName}</h3>

                  <div className={styles.imageWrap}>
                    {img ? (
                      <img src={img} alt={safeName} loading="lazy" />
                    ) : (
                      <div className={styles.imageFallback} aria-hidden="true" />
                    )}
                  </div>

                  <p className={styles.cardHint}>Open memories →</p>
                </Link>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}

export default AllCitiesPage;
