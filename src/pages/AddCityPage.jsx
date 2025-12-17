import axios from "axios";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MainURL } from "../config/api";
import styles from "./AddCityPage.module.css";

import { FiPlus, FiArrowLeft, FiMapPin } from "react-icons/fi";

function AddCityPage() {
  const { country } = useParams();
  const navigate = useNavigate();

  const safeCountry = useMemo(() => decodeURIComponent(country || ""), [country]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [averageRating, setAverageRating] = useState("");
  const [saving, setSaving] = useState(false);

  const backToCitiesUrl = useMemo(
    () => `/countries/${encodeURIComponent(safeCountry)}/cities`,
    [safeCountry]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCity = {
      name: name.trim(),
      description: description.trim(),
      image: image.trim(),
      country: safeCountry.trim(), // bloqueado, pero guardamos limpio
    };

    // Solo guardamos rating si el usuario puso algo
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
          <h1>
            Add City in {safeCountry}
          </h1>

          <p className={styles.addSubtitle}>
            Add a new city to this country with an image, description and rating.
          </p>

          <p className={styles.addLead}>
            The country is locked to keep your data consistent.
          </p>

          <div className={styles.addActions}>
            <Link to={backToCitiesUrl} className="btn ghost">
              <FiArrowLeft style={{ verticalAlign: "middle", marginRight: 8 }} />
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
              <span className={styles.hint}>
                This comes from the URL param (<code>:country</code>).
              </span>
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
              <span className={styles.hint}>
                Use a real URL (Unsplash, Wikipedia, etc.) so the card looks great.
              </span>
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
              <span className={styles.hint}>
                Optional. Leave empty if you don&apos;t want to rate it yet.
              </span>
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
          </div>

          <div className={styles.actions}>
            <button type="submit" className="btn primary" disabled={saving}>
              <FiPlus style={{ verticalAlign: "middle", marginRight: 8 }} />
              {saving ? "Saving..." : "Add City"}
            </button>

            <span className={styles.hint} style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <FiMapPin size={16} />
              Tip: Add a nice image URL to make the list look premium.
            </span>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddCityPage;
