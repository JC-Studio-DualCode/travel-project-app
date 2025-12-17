import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MainURL } from "../config/api";
import Loader from "../components/Loader";
import styles from "./CountryListPage.module.css";

import { FcGlobe } from "react-icons/fc";
import { FiMapPin } from "react-icons/fi";

function CountryListPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${MainURL}/cities.json`)
      .then((res) => {
        const citiesObj = res.data || {};

        // Saca country de cada city, limpia null/undefined y evita repetidos
        const uniqueCountries = [
          ...new Set(
            Object.values(citiesObj)
              .map((city) => city?.country)
              .filter(Boolean)
          ),
        ].sort((a, b) => a.localeCompare(b));

        setCountries(uniqueCountries);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const count = useMemo(() => countries.length, [countries]);

  if (loading) return <Loader />;

  return (
    <div className={styles.country}>
      {/* HERO (igual vibes que AboutPage) */}
      <section className={styles.countryHero}>
        <div className={styles.countryTitle}>
          <h1>
            Countries <FcGlobe style={{ verticalAlign: "middle" }} />
          </h1>

          <p className={styles.countrySubtitle}>
            Pick a country and jump into its city list.
          </p>

          <p className={styles.countryLead}>
            Found <strong>{count}</strong> countries in the dataset.
          </p>

          <div className={styles.countryActions}>
            <Link className="btn primary" to="/cities">
              Explore Cities
            </Link>
            <Link className="btn ghost" to="/">
              Back Home
            </Link>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className={styles.countryGrid}>
        {countries.map((country) => (
          <Link
            key={country}
            to={`/countries/${encodeURIComponent(country)}/cities`}
            className={styles.countryCard}
          >
            <div className={styles.iconBadge}>
              <FiMapPin size={22} />
            </div>

            <h3>{country}</h3>
            <p className={styles.cardHint}>View cities →</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default CountryListPage;
