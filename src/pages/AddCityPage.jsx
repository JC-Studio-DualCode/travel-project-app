import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MainURL } from "../config/api";
import styles from "./AddCityPage.module.css";

import { FiPlusCircle } from "react-icons/fi";

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
        setImage("");
        setName("");
        setDescription("");
        setAveragerating("");
        setCountry("");
        navigate("/cities");
      })
      .catch((err) => console.log("Error creating city", err));
  };

  return (
    <div className={styles.add}>
      {/* HERO (mismo estilo que About) */}
      <section className={styles.addHero}>
        <div className={styles.addTitle}>
          <h1>
            Add New City{" "}
            <span className={styles.iconBadge}>
              <FiPlusCircle size={22} />
            </span>
          </h1>

          <p className={styles.addSubtitle}>
            Build your personal travel collection by sharing cities, photos and experiences.
          </p>

          <p className={styles.addLead}>
            Each city you add becomes part of your personal travel diary. Share your favorite destinations with the world and inspire others to explore new places!
          </p>

          <div className={styles.addActions}>
            <Link className="btn ghost" to="/cities">
              Back to Cities
            </Link>
          </div>
        </div>
      </section>

      {/* FORM CARD (mismo look de cards del About) */}
      <section className={styles.formCard}>
        <form id="addCityForm" className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            {/* Image */}
            <label className={styles.field}>
              <span className={styles.label}>Image (URL)</span>
              <input
                className={styles.input}
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                required
              />
              <span className={styles.hint}>
                Tip: use a direct image URL (jpg/png/webp).
              </span>
            </label>

            {/* Name */}
            <label className={styles.field}>
              <span className={styles.label}>Name</span>
              <input
                className={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Madrid"
                required
              />
            </label>

            {/* Description full */}
            <label className={`${styles.field} ${styles.full}`}>
              <span className={styles.label}>Description</span>
              <textarea
                className={styles.textarea}
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you love about this city?"
                required
              />
            </label>

            {/* Rating */}
            <label className={styles.field}>
              <span className={styles.label}>Your Rating</span>
              <input
                className={styles.input}
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={averagerating}
                onChange={(e) => setAveragerating(e.target.value)}
                placeholder="4.5"
              />
              <span className={styles.hint}>From 0 to 5 (decimals allowed).</span>
            </label>

            {/* Country */}
            <label className={styles.field}>
              <span className={styles.label}>Country</span>
              <input
                className={styles.input}
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Spain"
                required
              />
            </label>
          </div>

          {/* Footer actions (por si alguien baja hasta el final) */}
          <div className={styles.actions}>
            <button type="submit" className="btn primary">
              Post
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={() => navigate("/cities")}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddCityPage;
