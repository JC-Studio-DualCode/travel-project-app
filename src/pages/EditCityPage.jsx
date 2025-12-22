import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MainURL } from "../config/api";
import Loader from "../components/Loader";
import styles from "./EditCityPage.module.css";

import {
  FiChevronRight,
  FiArrowLeft,
  FiHome,
  FiSave,
  FiPlus,
  FiTrash2,
  FiMapPin,
} from "react-icons/fi";

function EditCityPage() {
  const { country, cityId } = useParams();
  const navigate = useNavigate();

  const safeCountry = useMemo(() => decodeURIComponent(country || ""), [country]);

  const backToCitiesUrl = useMemo(
    () => `/countries/${encodeURIComponent(safeCountry)}/cities`,
    [safeCountry]
  );

  const backToDetailsUrl = useMemo(() => {
    const countryPart = encodeURIComponent(safeCountry || "");
    return `/countries/${countryPart}/cities/${cityId}`;
  }, [safeCountry, cityId]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [averageRating, setAverageRating] = useState("");

  const [pointsOfInterest, setPointsOfInterest] = useState([{ name: "", url: "" }]);

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

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${MainURL}/cities/${cityId}.json`)
      .then((res) => {
        const city = res.data || {};

        setName(city?.name || "");
        setDescription(city?.description || "");
        setImage(city?.image || "");
        setAverageRating(
          city?.averageRating !== undefined && city?.averageRating !== null
            ? String(city.averageRating)
            : ""
        );

        const poi = Array.isArray(city?.pointsOfInterest)
          ? city.pointsOfInterest
          : [{ name: "", url: "" }];

        setPointsOfInterest(poi.length ? poi : [{ name: "", url: "" }]);

        setLoading(false);
      })
      .catch((err) => {
        console.log("Error loading city", err);
        setLoading(false);
      });
  }, [cityId]);

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

    const updatedCity = {
      name: name.trim(),
      description: description.trim(),
      image: image.trim(),
      country: safeCountry?.trim() || "",
      pointsOfInterest: pointsOfInterest
        .filter((poi) => (poi?.name || "").trim() !== "")
        .map((poi) => ({
          name: (poi?.name || "").trim(),
          url: (poi?.url || "").trim(),
        })),
    };

    if (averageRating !== "") updatedCity.averageRating = Number(averageRating);

    setSaving(true);

    axios
      .patch(`${MainURL}/cities/${cityId}.json`, updatedCity)
      .then(() => {
        setSaving(false);
        navigate(backToDetailsUrl);
      })
      .catch((err) => {
        console.log("Error updating city", err);
        setSaving(false);
      });
  };

  if (loading) return <Loader />;

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

          {safeCountry ? (
            <>
              <Link className={styles.crumbLink} to="/countries">
                Countries
              </Link>
              <span className={styles.crumbSep} aria-hidden="true">
                <FiChevronRight />
              </span>
              <Link className={styles.crumbLink} to={backToCitiesUrl}>
                {safeCountry}
              </Link>
              <span className={styles.crumbSep} aria-hidden="true">
                <FiChevronRight />
              </span>
            </>
          ) : null}

          <span className={styles.crumbCurrent}>Edit City</span>
        </nav>

        <h1 className={`${styles.heroTitle} ${styles.enterTitle}`}>Edit City</h1>

        <section className={styles.hero}>
          <div className={styles.heroTopRow}>
            <span className={styles.heroKicker}>CityVerse • Editor</span>
          </div>

          <p className={`${styles.heroSubtitlePill} ${styles.enterSoft}`}>
            Update details, image, rating and points of interest.
          </p>

          <div className={`${styles.heroChips} ${styles.enterSoft}`}>
            <span className={`${styles.chip} ${styles.chipPrimary}`}>
              <FiMapPin aria-hidden="true" />
              {safeCountry || "No country"}
            </span>

            <span className={styles.chip}>
              ID: <strong style={{ fontWeight: 900 }}>{cityId}</strong>
            </span>
          </div>

          <div className={`${styles.actionsPill} ${styles.enterSoft}`}>
            <div className={styles.actions}>
              <Link className={`btn ghost ${styles.btnSm}`} to={backToDetailsUrl}>
                <FiArrowLeft style={{ marginRight: 8, verticalAlign: "middle" }} />
                Back to Details
              </Link>

              {safeCountry ? (
                <Link className={`btn ghost ${styles.btnSm}`} to={backToCitiesUrl}>
                  <FiMapPin style={{ marginRight: 8, verticalAlign: "middle" }} />
                  Back to Cities
                </Link>
              ) : null}

              <Link className={`btn ghost ${styles.btnSm}`} to="/">
                <FiHome style={{ marginRight: 8, verticalAlign: "middle" }} />
                Back Home
              </Link>
            </div>
          </div>
        </section>

        <div className={styles.heroDivider} aria-hidden="true" />

        <section className={styles.formCard} aria-label="Edit city form">
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

              {/* ✅ NEW: Upload image from device */}
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

              <div className={`${styles.field} ${styles.full}`}>
                <span className={styles.label}>Points of Interest</span>

                {pointsOfInterest.map((poi, index) => (
                  <div key={index} className={styles.poiRow}>
                    <input
                      type="text"
                      placeholder="POI Name"
                      value={poi?.name || ""}
                      onChange={(e) => updatePOI(index, "name", e.target.value)}
                      className={styles.input}
                    />
                    <input
                      type="url"
                      placeholder="POI Image URL"
                      value={poi?.url || ""}
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
                  <FiPlus style={{ marginRight: 6 }} />
                  Add Point of Interest
                </button>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={saving || uploading}
                title={uploading ? "Wait for the upload to finish" : "Save changes"}
              >
                <FiSave style={{ marginRight: 8 }} />
                {saving ? "Saving..." : uploading ? "Uploading..." : "Save changes"}
              </button>

              <span className={styles.hint}>
                Tip: si pones imágenes en POIs, las cards quedan tipo “Netflix de viajes”.
              </span>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default EditCityPage;
