import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MainURL } from "../config/api";
import styles from "./CityDetailsPage.module.css";

function CityDetailsPage() {
  const [city, setCity] = useState(null);
  const { cityId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${MainURL}/cities/${cityId}.json`)
      .then((res) => setCity(res.data))
      .catch((err) => console.log(err));
  }, [cityId]);

  const deleteCity = () => {
    axios
      .delete(`${MainURL}/cities/${cityId}.json`)
      .then(() => navigate("/cities"))
      .catch((err) => console.log(err));
  };

  if (!city) return <Loader />;

  return (
    <div className="cityDetailsPage">
      <img src={city.image} alt={city.name} />
      <h1>{city.name}</h1>
      <h3>{city.country}</h3>

      <p>{city.description}</p>

      <p>⭐ {city.averageRating}</p>

     
      <h4>Points of interest</h4>
      <ul>
        {city.pointsOfInterest?.map((poi, index) => (
          <li key={index}>{poi}</li>
        ))}
      </ul>

      
      <h4>Reviews</h4>
      {city.reviews?.map((review, index) => (
        <div key={index}>
          <strong>{review.user}</strong> ⭐ {review.rating}
          <p>{review.comment}</p>
        </div>
      ))}

      <Link to={`/cities/${cityId}/edit`}>
        <button>Edit</button>
      </Link>

      <button onClick={deleteCity}>Delete</button>

      <Link to="/cities">
        <button>Back to cities</button>
      </Link>
  if (loading) {
    return <p className={styles.loading}>Cargando...</p>;
  }

  if (!city) {
    return (
      <div className={styles.page}>
        <Link to="/" className="btn ghost">← Volver</Link>
        <h1 className={styles.notFoundTitle}>Ciudad no encontrada</h1>
      </div>
    );
  }

  const images = Array.isArray(city.images) ? city.images : [];
  const mainImage = city.mainImage || city.image || "";

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/" className="btn ghost">← Volver</Link>
        <h1 className={styles.title}>{city.name}</h1>
      </div>

      <p className={styles.description}>{city.description}</p>

      <div className={styles.gallery}>
        {mainImage && (
          <img className={styles.galleryImg} src={mainImage} alt={city.name} />
        )}

        {images.map((url, i) => (
          <img
            className={styles.galleryImg}
            key={i}
            src={url}
            alt={`${city.name} ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default CityDetailsPage;