import axios from "axios";
import { useState } from "react";
import { MainURL } from "../config/api";
import { useNavigate } from "react-router-dom";
import styles from "./AddCityPage.module.css";

function AddCityPage() {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [averagerating, setAveragerating] = useState("");
  const [country, setCountry] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCity = {
      image,
      name,
      description,
      averagerating,
      country,
    };

    axios
      .post(`${MainURL}/cities.json`, newCity)
      .then(() => {
        navigate("/cities");

        setImage("");
        setName("");
        setDescription("");
        setAveragerating("");
        setCountry("");
      })
      .catch((e) => console.log("Error creating a new City...", e));
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Añadir ciudad</h1>
        <p className={styles.subtitle}>
          Completa el formulario para añadir una nueva ciudad
        </p>
      </header>

      <section className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            Imagen (URL)
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            Nombre
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label className={styles.field}>
            Descripción
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              required
            />
          </label>

          <label className={styles.field}>
            Valoración media
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={averagerating}
              onChange={(e) => setAveragerating(e.target.value)}
            />
          </label>

          <label className={styles.field}>
            País
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </label>

          <div className={styles.actions}>
            <button type="submit" className="btn primary">
              Añadir ciudad
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => navigate("/cities")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddCityPage;
