import axios from "axios";
import { useEffect, useState } from "react";
import { MainURL } from "../config/api";
import { Link } from "react-router-dom";
import styles from "./CityListPage.module.css";

function CityListPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${MainURL}/cities.json`)
      .then((response) => {
        if (response.data) {
          const citiesArray = Object.keys(response.data).map((id) => ({
            id,
            ...response.data[id],
          }));
          setCities(citiesArray);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error getting Cities from Firebase", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className={styles.loading}>Loading cities...</p>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>City List</h1>
      </header>

      <div className={styles.grid}>
        {cities.map((city) => (
          <article className={styles.card} key={city.id}>
            <img className={styles.image} src={city.image} alt={city.name} />

            <h3 className={styles.name}>{city.name}</h3>
            <p className={styles.description}>{city.description}</p>
            <p className={styles.meta}>⭐ {city.averagerating}</p>
            <p className={styles.meta}>{city.country}</p>

            <Link to={`/cities/${city.id}`} className={styles.link}>
              <button className={styles.button}>More details</button>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default CityListPage;
