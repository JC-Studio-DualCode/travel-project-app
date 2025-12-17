import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainURL } from "../config/api";
import styles from "./AddCountryPage.module.css";

function AddCountryPage() {
  const navigate = useNavigate();

  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // mini validación básica
    if (!country.trim() || !name.trim()) return;

    const newCity = {
      country: country.trim(),
      name: name.trim(),
      image: image.trim(),
      description: description.trim(),
    };

    setSaving(true);

    axios
      .post(`${MainURL}/cities.json`, newCity)
      .then(() => {
        navigate(`/countries/${encodeURIComponent(newCity.country)}/cities`);
      })
      .catch((err) => {
        console.log("Error creating country/city:", err);
        setSaving(false);
      });
  };

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className={styles.crumbSep}>/</span>
        <Link to="/countries">Countries</Link>
        <span className={styles.crumbSep}>/</span>
        <span>Add Country</span>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroTitle}>
          <h1>Add a new Country</h1>
          <p className={styles.subtitle}>
            Creating a country means creating its first city (so it shows up in the list).
          </p>

          <div className={styles.actions}>
            <Link to="/countries" className="btn ghost">
              ← Back
            </Link>
          </div>
        </div>
      </section>

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

          <button className="btn primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Create Country"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default AddCountryPage;
