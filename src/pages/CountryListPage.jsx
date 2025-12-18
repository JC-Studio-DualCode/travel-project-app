import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MainURL } from "../config/api";
import Loader from "../components/Loader";
import styles from "./CountryListPage.module.css";

import { FcGlobe } from "react-icons/fc";
import { FiMapPin, FiPlus } from "react-icons/fi";

function CountryListPage() {
  const [countries, setCountries] = useState([]); // [{ name, count }]
  const [loading, setLoading] = useState(true);

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
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const countriesCount = useMemo(() => countries.length, [countries]);
  const totalCities = useMemo(
    () => countries.reduce((sum, c) => sum + c.count, 0),
    [countries]
  );

  if (loading) return <Loader />;

  return (
    <div className={styles.pageBg}>
      <div className={styles.country}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <span>Countries</span>
        </nav>

        {/* HERO - Travel vibes */}
        <section className={styles.countryHero}>
          <div className={styles.heroOverlay}>
            <div className={styles.countryTitle}>
              <div className={styles.heroKicker}>Travel Journal • CityVerse</div>

              <div className={styles.heroChips}>
                <span className={styles.chip}>{countriesCount} countries</span>
                <span className={styles.chip}>{totalCities} cities saved</span>
              </div>

              <div className={styles.countryActions}>
                <Link className="btn primary" to="/countries/add">
                  <FiPlus style={{ verticalAlign: "middle", marginRight: 8 }} />
                  Add Country
                </Link>

                <Link className="btn ghost" to="/">
                  Back Home
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* GRID */}
        <section className={styles.countryGrid}>
          {countries.map(({ name, count }) => (
            <Link
              key={name}
              to={`/countries/${encodeURIComponent(name)}/cities`}
              className={styles.countryCard}
            >
              <div className={styles.iconBadge}>
                <FiMapPin size={22} />
              </div>

              <h3>{name}</h3>

              <p className={styles.cardHint}>
                {count} {count === 1 ? "city" : "cities"} • Open memories →
              </p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}

export default CountryListPage;

