import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainURL } from "../config/api";
import Loader from "../components/Loader";
import styles from "./EditCityPage.module.css";

function EditCityPage() {
  const { cityId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [averageRating, setAverageRating] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    axios
      .get(`${MainURL}/cities/${cityId}.json`)
      .then((res) => {
        const city = res.data;

        if (!city) {
          setLoading(false);
          return;
        }

        setImage(city.image || "");
        setName(city.name || "");
        setDescription(city.description || "");
        setAverageRating(city.averageRating ?? city.averagerating ?? "");
        setCountry(city.country || "");

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [cityId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedCity = {
      image,
      name,
      description,
      averageRating: averageRating === "" ? "" : Number(averageRating),
      country,
    };

    axios
      .patch(`${MainURL}/cities/${cityId}.json`, updatedCity)
      .then(() => navigate(`/cities/${cityId}`))
      .catch((err) => console.log("Error updating city...", err));
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Editar ciudad</h1>
        <p className={styles.subtitle}>
          Actualiza la información de la ciudad y guarda los cambios.
        </p>
      </header>

      <section className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.field}>
            Image URL
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            Country
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            Average rating
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={averageRating}
              onChange={(e) => setAverageRating(e.target.value)}
            />
          </label>

          <label className={`${styles.field} ${styles.full}`}>
            Description
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <div className={styles.actions}>
            <button className="btn primary" type="submit">
              Guardar
            </button>
            <button
              className="btn ghost"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default EditCityPage;
