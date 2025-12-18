import axios from "axios";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MainURL } from "../config/api";
import styles from "./AddCityPage.module.css";

import {
  FiPlus,
  FiArrowLeft,
  FiMapPin,
  FiTrash2,
  FiChevronRight,
  FiHome,
} from "react-icons/fi";

function AddCityPage() {
  const { country } = useParams();
  const navigate = useNavigate();

  const safeCountry = useMemo(() => decodeURIComponent(country || ""), [country]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [averageRating, setAverageRating] = useState("");
  const [saving, setSaving] = useState(false);

  const [pointsOfInterest, setPointsOfInterest] = useState([{ name: "", url: "" }]);

  const backToCitiesUrl = useMemo(
    () => `/countries/${encodeURIComponent(safeCountry)}/cities`,
    [safeCountry]
  );

  const addPOI = () => {
    setPointsOfInterest((prev) => [...prev, { name: "", url: "" }]);
  };

  const removePOI = (index) => {
    setPointsOfInterest((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePOI = (index, field, value) => {
    setPointsOfInterest((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
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
        .filter((poi) => (poi?.name || "").trim() !== "")
        .map((poi) => ({ name: (poi?.name || "").trim(), url: (poi?.url || "").trim() })),
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
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className={styles.pageBg}>
      <div className={styles.wrap}>
        {/* ✅ Breadcrumb */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link className={styles.crumbLink} to="/">
            Home
          </Link>

          <span className={styles.crumbSep} aria-hidden="true">
            <FiChevronRight />
          </span>

          <Link className={styles.crumbLink} to="/countries">
            Countries
          </Link>

          <span className={styles.crumbSep} aria-hidden="true">
            <FiChevronRight />
          </span>

          <span className={styles.crumbCurrent}>Add City</span>
        </nav>

        {/* ✅ Title */}
        <h1 className={`${styles.heroTitle} ${styles.enterTitle}`}>Add City</h1>

        {/* ✅ Hero */}
        <section className={styles.hero}>
          <div className={styles.heroTopRow}>
            <span className={styles.heroKicker}>CityVerse • Create</span>
          </div>

          <p className={`${styles.heroSubtitlePill} ${styles.enterSoft}`}>
            Add a new city with image, description, rating and points of interest.
          </p>

          <div className={`${styles.heroChips} ${styles.enterSoft}`}>
            <span className={styles.chip}>
              <FiMapPin aria-hidden="true" />
              {safeCountry || "—"}
            </span>
          </div>

          <div className={`${styles.actionsPill} ${styles.enterSoft}`}>
            <div className={styles.actions}>
              <Link className={`btn ghost ${styles.btnSm}`} to={backToCitiesUrl}>
                <FiArrowLeft style={{ marginRight: 8, verticalAlign: "middle" }} />
                Back to Cities
              </Link>

              <Link className={`btn ghost ${styles.btnSm}`} to="/">
                <FiHome style={{ marginRight: 8, verticalAlign: "middle" }} />
                Back Home
              </Link>
            </div>
          </div>
        </section>

        <div className={styles.heroDivider} aria-hidden="true" />

        {/* ✅ FORM CARD */}
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

              {/* ✅ POINTS OF INTEREST */}
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
                      aria-label="Remove POI"
                      title="Remove"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}

                <button type="button" className={styles.poiAddBtn} onClick={addPOI}>
                  <FiPlus style={{ marginRight: 6 }} /> Add Point of Interest
                </button>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.saveBtn} disabled={saving}>
                <FiPlus style={{ marginRight: 8 }} />
                {saving ? "Saving..." : "Add City"}
              </button>

              <span className={styles.hint}>
                <FiMapPin size={16} style={{ marginRight: 6, transform: "translateY(2px)" }} />
                Tip: Add images for your POIs to make the city card look amazing.
              </span>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AddCityPage;
