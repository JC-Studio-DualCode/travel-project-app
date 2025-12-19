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

  // ✅ Upload
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // ✅ Cloudinary config
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "de0a4pyo2";
  const UPLOAD_PRESET =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "cityverse_upload";

  const uploadToCloudinary = async (file) => {
    if (!file) return;

    setUploadError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.error?.message || "Upload failed";
        throw new Error(msg);
      }

      const url = data?.secure_url || data?.url || "";
      if (!url) throw new Error("No URL returned from Cloudinary");

      setImage(url);
    } catch (err) {
      console.log("Cloudinary upload error:", err);
      setUploadError(err?.message || "Error uploading image");
    } finally {
      setUploading(false);
    }
  };

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

            {/* ✅ NEW: Upload image from device (mobile friendly) */}
            <div className={styles.field}>
              <label>Upload Image (mobile)</label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  uploadToCloudinary(file);
                  e.target.value = "";
                }}
              />

              {uploading && (
                <small style={{ display: "block", marginTop: 8, opacity: 0.8 }}>
                  Uploading to Cloudinary...
                </small>
              )}

              {uploadError && (
                <small style={{ display: "block", marginTop: 8, color: "#b91c1c" }}>
                  {uploadError}
                </small>
              )}
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

            <button
              className={`btn primary ${styles.btnSm}`}
              type="submit"
              disabled={saving || uploading}
              title={uploading ? "Wait for the upload to finish" : "Create Country"}
            >
              <FiPlus style={{ marginRight: 8, verticalAlign: "middle" }} />
              {saving ? "Saving..." : uploading ? "Uploading..." : "Create Country"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AddCountryPage;
