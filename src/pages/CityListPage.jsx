import axios from "axios";
import { useEffect, useState } from "react";
import { MainURL } from "../config/api";
import { Link } from "react-router-dom";
import styles from "./CityListPage.module.css";

function CityListPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const normalizedSearch = search.trim().toLowerCase();

  const filteredCities = cities.filter((city) => {
    const name = (city.name || "").toLowerCase();
    const country = (city.country || "").toLowerCase();
    return (
      name.includes(normalizedSearch) ||
      country.includes(normalizedSearch)
    );
  });

  if (loading) {
    return <p className={styles.loading}>Loading cities...</p>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>City List</h1>

        <input
          className={styles.search}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by city or country..."
        />
      </header>

      {filteredCities.length === 0 && (
        <p className={styles.empty}>
          No results for “{search}”. Try another city or country.
        </p>
      )}

      <div className={styles.grid}>
        {filteredCities.map((city) => (
          <article className={styles.card} key={city.id}>
            <img
              className={styles.image}
              src={city.image}
              alt={city.name}
            />

            <h3 className={styles.name}>{city.name}</h3>
            <p className={styles.description}>{city.description}</p>

            <p className={styles.meta}>⭐ {city.averagerating}</p>
            <p className={styles.meta}>{city.country}</p>

            <Link to={`/cities/${city.id}`} className={styles.link}>
              <button className={styles.button}>
                More details
              </button>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export default CityListPage;
