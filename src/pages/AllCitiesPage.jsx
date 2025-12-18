import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MainURL } from "../config/api";
import Loader from "../components/Loader";
import styles from "./AllCitiesPage.module.css";

import { FiMapPin, FiArrowLeft } from "react-icons/fi";

function AllCitiesPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${MainURL}/cities.json`)
      .then((res) => {
        const citiesObj = res.data || {};

        // Convertimos objeto -> array (guardando id)
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

  if (loading) return <Loader />;

  return (
    <div className={styles.pageBg}>
      <div className={styles.wrap}>
        {/* Top bar */}
        <div className={styles.top}>
          <div>
            <h1 className={styles.title}>All Cities</h1>
            <p className={styles.sub}>
              Showing <strong>{cities.length}</strong> cities.
            </p>
          </div>

          <Link to="/" className="btn ghost">
            <FiArrowLeft style={{ verticalAlign: "middle", marginRight: 8 }} />
            Back Home
          </Link>
        </div>

        {/* Grid */}
        <section className={styles.grid}>
          {cities.map((city) => {
            const safeCountry = encodeURIComponent(city.country || "");
            return (
              <div key={city.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.badge}>
                    <FiMapPin size={20} />
                  </div>

                  <div>
                    <h3 className={styles.cardTitle}>{city.name}</h3>
                    <p className={styles.cardMeta}>{city.country}</p>
                  </div>
                </div>

                <div className={styles.imageWrap}>
                  <img src={city.image} alt={city.name} loading="lazy" />
                </div>

                <p className={styles.desc}>{city.description}</p>

                <Link
                  to={`/countries/${safeCountry}/cities/${city.id}`}
                  className="btn ghost"
                >
                  View
                </Link>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}

export default AllCitiesPage;
