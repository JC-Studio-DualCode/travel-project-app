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

        // 1) contar ciudades por país
        const counts = Object.values(citiesObj).reduce((acc, city) => {
          const c = city?.country?.trim();
          if (!c) return acc;
          acc[c] = (acc[c] || 0) + 1;
          return acc;
        }, {});

        // 2) convertir a array para render
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

  const countCountries = useMemo(() => countries.length, [countries]);

  if (loading) return <Loader />;

  return (
    <div className={styles.country}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className={styles.crumbSep}>/</span>
        <span>Countries</span>
      </nav>

      <section className={styles.countryHero}>
        <div className={styles.countryTitle}>
          <h1>
            Countries <FcGlobe style={{ verticalAlign: "middle" }} />
          </h1>

          <p className={styles.countrySubtitle}>
            Pick a country and jump into its city list.
          </p>

          <p className={styles.countryLead}>
            Found <strong>{countCountries}</strong> countries in the dataset.
          </p>

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
      </section>

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
              {count} {count === 1 ? "city" : "cities"} →
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default CountryListPage;
