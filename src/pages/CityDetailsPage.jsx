import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MainURL } from "../config/api";
import styles from "./CityDetailsPage.module.css";

function CityDetailsPage() {
  const { cityId } = useParams();
  const navigate = useNavigate();

  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${MainURL}/cities/${cityId}.json`)
      .then((res) => {
        setCity(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching city:", err);
        setLoading(false);
      });
  }, [cityId]);

  const deleteCity = () => {
    const ok = window.confirm("¿Seguro que quieres borrar esta ciudad?");
    if (!ok) return;

    setDeleting(true);

    axios
      .delete(`${MainURL}/cities/${cityId}.json`)
      .then(() => navigate("/cities"))
      .catch((err) => {
        console.log("Error deleting city:", err);
        setDeleting(false);
      });
  };

  if (loading) {
    return <p className={styles.loading}>Cargando...</p>;
  }

  if (!city) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <Link to="/cities" className="btn ghost">← Volver</Link>
        </div>
        <h1 className={styles.notFoundTitle}>Ciudad no encontrada</h1>
      </div>
    );
  }

  const images = Array.isArray(city.images) ? city.images : [];
  const mainImage = city.mainImage || city.image || "";
  const rating = city.averagerating ?? city.averageRating ?? "—";

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/cities" className="btn ghost">← Volver</Link>

        <div className={styles.headerRight}>
          <Link to={`/cities/${cityId}/edit`} className="btn ghost">
            Editar
          </Link>

          <button
            type="button"
            className="btn primary"
            onClick={deleteCity}
            disabled={deleting}
          >
            {deleting ? "Borrando..." : "Borrar"}
          </button>
        </div>
      </div>

      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.title}>{city.name}</h1>
          <p className={styles.meta}>{city.country}</p>
          <p className={styles.description}>{city.description}</p>
          <p className={styles.meta}>⭐ {rating}</p>
        </div>

        {mainImage && (
          <img className={styles.heroImg} src={mainImage} alt={city.name} />
        )}
      </div>

      {images.length > 0 && (
        <div className={styles.gallery}>
          {images.map((url, i) => (
            <img
              className={styles.galleryImg}
              key={i}
              src={url}
              alt={`${city.name} ${i + 1}`}
            />
          ))}
        </div>
      )}

      {!!city.pointsOfInterest?.length && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Points of interest</h2>
          <ul className={styles.list}>
            {city.pointsOfInterest.map((poi, index) => (
              <li key={index}>{poi}</li>
            ))}
          </ul>
        </section>
      )}

      {!!city.reviews?.length && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Reviews</h2>

          <div className={styles.reviews}>
            {city.reviews.map((review, index) => (
              <article key={index} className={styles.reviewCard}>
                <p className={styles.reviewHeader}>
                  <strong>{review.user}</strong> ⭐ {review.rating}
                </p>
                <p className={styles.reviewText}>{review.comment}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default CityDetailsPage;
