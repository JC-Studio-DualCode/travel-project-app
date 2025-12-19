import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainURL } from "../config/api";
import styles from "./AddCountryPage.module.css";

import { FiChevronRight, FiPlus } from "react-icons/fi";

function AddCountryPage() {
  const navigate = useNavigate();

  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!country.trim() || !name.trim()) return;

    
    const firstCity = {
      country: country.trim(),
      name: name.trim(),
      image: image.trim(),
      description: description.trim(),
    };

    setSaving(true);

    axios
      .post(`${MainURL}/cities.json`, firstCity)
      .then(() => {
        navigate(`/countries/${encodeURIComponent(firstCity.country)}/cities`);
      })
      .catch((err) => {
        console.log("Error creating country/city:", err);
        setSaving(false);
      });
  };

  return (
    <div className={styles.pageBg}>
      <div className={styles.page}>
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
          <span className={styles.crumbCurrent}>Add Country</span>
        </nav>

        <h1 className={styles.heroTitle}>Add Country</h1>

        <section className={styles.hero}>
          <div className={styles.heroTopRow}>
            <span className={styles.heroKicker}>Travel Journal • CityVerse</span>
          </div>

          <div className={styles.heroSecondaryChips}>
            <span className={styles.heroJournal}>
              <span className={styles.redPin} aria-hidden="true">
                📍
              </span>
              Create first city
            </span>
          </div>

          <p className={styles.heroSubtitlePill}>
            Every country starts with its first city.
          </p>
        </section>

        <div className={styles.heroDivider} aria-hidden="true" />

        <section className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>Country *</label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Spain"
                required
              />
            </div>

            <div className={styles.field}>
              <label>First City *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Madrid"
                required
              />
            </div>

            <div className={styles.field}>
              <label>Image URL</label>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
              />
              <p className={styles.help}>
                Tip: if you leave it empty, you can show a placeholder image in the city list.
              </p>
            </div>

            <div className={styles.field}>
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description..."
                rows={4}
              />
            </div>

            <button className={`btn primary ${styles.btnSm}`} type="submit" disabled={saving}>
              <FiPlus style={{ marginRight: 8, verticalAlign: "middle" }} />
              {saving ? "Saving..." : "Create Country"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AddCountryPage;

