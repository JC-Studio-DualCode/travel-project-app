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

  // ✅ Upload
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [pointsOfInterest, setPointsOfInterest] = useState([{ name: "", url: "" }]);

  const backToCitiesUrl = useMemo(
    () => `/countries/${encodeURIComponent(safeCountry)}/cities`,
    [safeCountry]
  );

  // ✅ Cloudinary config (mejor en .env)
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

  // ✅ POIs
  const addPOI = () => setPointsOfInterest((prev) => [...prev, { name: "", url: "" }]);

  const removePOI = (index) =>
    setPointsOfInterest((prev) => prev.filter((_, i) => i !== index));

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
        .map((poi) => ({
          name: (poi?.name || "").trim(),
          url: (poi?.url || "").trim(),
        })),
    };

    if (averageRating !== "") newCity.averageRating = Number(averageRating);

    setSaving(true);

    axios
      .post(`${MainURL}/cities.json`, newCity)
      .then(() => navigate(backToCitiesUrl))
      .catch((err) => console.log("Error adding city", err))
      .finally(() => setSaving(false));
  };

  return (
    <div className={styles.pageBg}>
      <div className={styles.wrap}>
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

        <h1 className={`${styles.heroTitle} ${styles.enterTitle}`}>Add City</h1>

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

              {/* ✅ Upload image from device */}
              <div className={styles.field}>
                <span className={styles.label}>Upload Image (mobile)</span>

                <input
                  className={styles.input}
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

              {/* ✅ POIs */}
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
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={saving || uploading}
                title={uploading ? "Wait for the upload to finish" : "Add City"}
              >
                <FiPlus style={{ marginRight: 8 }} />
                {saving ? "Saving..." : uploading ? "Uploading..." : "Add City"}
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

