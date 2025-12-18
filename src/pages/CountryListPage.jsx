import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MainURL } from "../config/api";
import styles from "./CountryListPage.module.css";

import { FcGlobe } from "react-icons/fc";
import {
  FiMapPin,
  FiPlus,
  FiHome,
  FiFlag,
  FiStar,
  FiSearch,
  FiChevronRight,
} from "react-icons/fi";

function CountryListPage() {
  const [countries, setCountries] = useState([]);
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

        const counts = Object.values(citiesObj).reduce((acc, city) => {
          const c = city?.country?.trim();
          if (!c) return acc;
          acc[c] = (acc[c] || 0) + 1;
          return acc;
        }, {});

        const list = Object.entries(counts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const countriesCount = useMemo(() => countries.length, [countries]);
  const totalCities = useMemo(
    () => countries.reduce((sum, c) => sum + c.count, 0),
    [countries]
  );

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
  const filteredCountries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [countries, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className={styles.pageBg}>
      <div className={styles.country}>
        {/* ✅ Breadcrumb mejorado */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link className={styles.crumbLink} to="/">
            Home
          </Link>
          <span className={styles.crumbSep} aria-hidden="true">
            <FiChevronRight />
          </span>
          <span className={styles.crumbCurrent}>Countries</span>
        </nav>

        <section className={styles.countryHero}>
          <div className={styles.heroGlass}>
            <div className={styles.heroTopRow}>
              <span className={styles.heroKicker}>Travel Journal • CityVerse</span>

              <span className={styles.heroJournal} aria-label="Personal travel journal">
                <span className={styles.redPin} aria-hidden="true">
                  📍
                </span>
                Personal Travel Journal
              </span>
            </div>

            <h1 className={styles.heroTitle}>
              Countries
              <span className={styles.heroIcon} aria-hidden="true">
                <FcGlobe />
              </span>
            </h1>

            <p className={styles.heroSubtitle}>
              Every country holds a story. Yours starts here.
            </p>

            <div className={styles.heroChips}>
              <span className={styles.chip}>
                <FiFlag aria-hidden="true" />
                {loading ? "—" : displayCountries} countries
              </span>

              <span className={styles.chip}>
                <FiStar aria-hidden="true" />
                {loading ? "—" : displayCities} cities saved
              </span>
            </div>

            {/* ✅ Search simple */}
            <div className={styles.searchRow}>
              <span className={styles.searchIcon} aria-hidden="true">
                <FiSearch />
              </span>
              <input
                className={styles.searchInput}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country…"
                aria-label="Search country"
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

            <div className={styles.countryActions}>
              <Link className={`btn primary ${styles.btnSm}`} to="/countries/add">
                <FiPlus style={{ marginRight: 8, verticalAlign: "middle" }} />
                Add Country
              </Link>

              <Link className={`btn ghost ${styles.btnSm}`} to="/">
                <FiHome style={{ marginRight: 8, verticalAlign: "middle" }} />
                Back Home
              </Link>
            </div>
          </div>
        </section>

        {/* ✅ Skeleton loader */}
        {loading ? (
          <section className={styles.countryGrid} aria-label="Loading countries">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonTop}>
                  <div className={styles.skeletonIcon} />
                  <div className={styles.skeletonBadge} />
                </div>
                <div className={styles.skeletonLineLg} />
                <div className={styles.skeletonLineSm} />
              </div>
            ))}
          </section>
        ) : (
          <>
            {/* ✅ Si no hay resultados */}
            {filteredCountries.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>No countries found</p>
                <p className={styles.emptyHint}>
                  Try a different search (or clear it and explore).
                </p>
              </div>
            ) : (
              <section className={styles.countryGrid}>
                {filteredCountries.map(({ name, count }, index) => {
                  const isHot = count > 1;

                  return (
                    <Link
                      key={name}
                      to={`/countries/${encodeURIComponent(name)}/cities`}
                      className={styles.countryCard}
                      aria-label={`Open ${name} cities`}
                      style={{ animationDelay: `${index * 60}ms` }} // ✅ stagger
                    >
                      <div className={styles.cardTopRow}>
                        <div className={styles.iconBadge} aria-hidden="true">
                          <FiMapPin size={22} />
                        </div>

                        {/* ✅ badge diferenciado si > 1 */}
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
                          {count} {count === 1 ? "city" : "cities"}
                        </span>
                      </div>

                      <h3 className={styles.cardTitle}>{name}</h3>

                      <p className={styles.cardHint}>Open memories →</p>
                    </Link>
                  );
                })}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CountryListPage;
