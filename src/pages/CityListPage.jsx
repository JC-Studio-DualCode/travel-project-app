import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainURL } from "../config/api";
import Loader from "../components/Loader";
import styles from "./CityListPage.module.css";

import { FiMapPin, FiPlus, FiArrowLeft } from "react-icons/fi";

function CityListPage() {
  const { country } = useParams();
  const safeCountry = useMemo(
    () => decodeURIComponent(country || ""),
    [country]
  );

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Loader />;

  return (
    <div className={styles.cityList}>
<nav className={styles.breadcrumbs} aria-label="Breadcrumb">
  <Link to="/">Home</Link>
  <span className={styles.crumbSep}>/</span>
  <Link to="/countries">Countries</Link>
  <span className={styles.crumbSep}>/</span>
  <span>{safeCountry}</span>
</nav>


      {/* HERO */}
      <section className={styles.cityHero}>
        <div className={styles.cityTitle}>
          <h1>
            Cities in {safeCountry}
          </h1>

          <p className={styles.citySubtitle}>
            Browse the city list and open details. You can also add a new city.
          </p>

          <p className={styles.cityLead}>
            Found <strong>{cities.length}</strong> cities.
          </p>

          <div className={styles.cityActions}>
            <Link
              to={`/countries/${encodeURIComponent(safeCountry)}/cities/add`}
              className="btn primary"
            >
              <FiPlus style={{ verticalAlign: "middle", marginRight: 8 }} />
              Add City
            </Link>

            <Link
              to="/countries"
              className="btn ghost"
            >
              <FiArrowLeft style={{ verticalAlign: "middle", marginRight: 8 }} />
              Back to Countries
            </Link>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className={styles.cityGrid}>
        {cities.map((city) => (
          <div key={city.id} className={styles.cityCard}>
            <div className={styles.cardTop}>
              <div className={styles.iconBadge}>
                <FiMapPin size={22} />
              </div>

              <div className={styles.cardTitleBlock}>
                <h3>{city.name}</h3>
                <p className={styles.cardMeta}>{safeCountry}</p>
              </div>
            </div>

            <div className={styles.imageWrap}>
              <img
                src={city.image}
                alt={city.name}
                loading="lazy"
              />
            </div>

            <p className={styles.cardDesc}>{city.description}</p>

            <Link
              to={`/countries/${encodeURIComponent(safeCountry)}/cities/${city.id}`}
              className="btn ghost"
            >
              View
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}

export default CityListPage;
