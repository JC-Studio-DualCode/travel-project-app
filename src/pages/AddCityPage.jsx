import axios from "axios";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MainURL } from "../config/api";
import styles from "./AddCityPage.module.css";

import { FiPlus, FiArrowLeft, FiMapPin, FiTrash2 } from "react-icons/fi";

function AddCityPage() {
  const { country } = useParams();
  const navigate = useNavigate();

  const safeCountry = useMemo(() => decodeURIComponent(country || ""), [country]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [averageRating, setAverageRating] = useState("");
  const [saving, setSaving] = useState(false);

  // Estado para los puntos de interés
  const [pointsOfInterest, setPointsOfInterest] = useState([
    { name: "", url: "" }
  ]);

  const backToCitiesUrl = useMemo(
    () => `/countries/${encodeURIComponent(safeCountry)}/cities`,
    [safeCountry]
  );

  // Añadir un nuevo POI vacío
  const addPOI = () => {
    setPointsOfInterest([...pointsOfInterest, { name: "", url: "" }]);
  };

  // Eliminar un POI por índice
  const removePOI = (index) => {
    setPointsOfInterest(pointsOfInterest.filter((_, i) => i !== index));
  };

  // Actualizar el nombre o URL de un POI
  const updatePOI = (index, field, value) => {
    const newPOIs = [...pointsOfInterest];
    newPOIs[index][field] = value;
    setPointsOfInterest(newPOIs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCity = {
      name: name.trim(),
      description: description.trim(),
      image: image.trim(),
      country: safeCountry.trim(),
      pointsOfInterest: pointsOfInterest
        .filter((poi) => poi.name.trim() !== "")
        .map((poi) => ({ name: poi.name.trim(), url: poi.url.trim() }))
    };

    if (averageRating !== "") {
      newCity.averageRating = Number(averageRating);
    }

    setSaving(true);

    axios
      .post(`${MainURL}/cities.json`, newCity)
      .then(() => navigate(backToCitiesUrl))
      .catch((err) => {
        console.log("Error adding city", err);
        setSaving(false);
      });
  };

  return (
    <div className={styles.add}>
      {/* HERO */}
      <section className={styles.addHero}>
        <div className={styles.addTitle}>
          <h1>Add City in {safeCountry}</h1>
          <p className={styles.addSubtitle}>
            Add a new city to this country with image, description, rating, and points of interest.
          </p>
          <div className={styles.addActions}>
            <Link to={backToCitiesUrl} className="btn ghost">
              <FiArrowLeft style={{ marginRight: 8 }} />
              Back to Cities
            </Link>
          </div>
        </div>
      </section>

      {/* FORM CARD */}
      <section className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <span className={styles.label}>Country</span>
              <input className={styles.input} type="text" value={safeCountry} disabled />
            </div>

            <div className={styles.field}>
              <span className={styles.label}>City Name *</span>
              <input
                className={styles.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Caracas"
                required
              />
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Image URL</span>
              <input
                className={styles.input}
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Average Rating</span>
              <input
                className={styles.input}
                type="number"
                step="0.1"
                value={averageRating}
                onChange={(e) => setAverageRating(e.target.value)}
                placeholder="e.g. 4.5"
              />
            </div>

            <div className={`${styles.field} ${styles.full}`}>
              <span className={styles.label}>Description</span>
              <textarea
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description..."
              />
            </div>

            {/* POINTS OF INTEREST */}
            <div className={`${styles.field} ${styles.full}`}>
              <span className={styles.label}>Points of Interest</span>
              {pointsOfInterest.map((poi, index) => (
                <div key={index} className={styles.poiRow}>
                  <input
                    type="text"
                    placeholder="POI Name"
                    value={poi.name}
                    onChange={(e) => updatePOI(index, "name", e.target.value)}
                    className={styles.input}
                  />
                  <input
                    type="url"
                    placeholder="POI Image URL"
                    value={poi.url}
                    onChange={(e) => updatePOI(index, "url", e.target.value)}
                    className={styles.input}
                  />
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removePOI(index)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button type="button" className="btn secondary" onClick={addPOI}>
                <FiPlus style={{ marginRight: 4 }} /> Add Point of Interest
              </button>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className="btn primary" disabled={saving}>
              <FiPlus style={{ marginRight: 8 }} />
              {saving ? "Saving..." : "Add City"}
            </button>
            <span className={styles.hint} style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <FiMapPin size={16} />
              Tip: Add images for your POIs to make the city card look amazing.
            </span>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddCityPage;
