import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MainURL } from "../config/api";
import ReviewForm from "../components/ReviewForm";
import styles from "./CityDetailsPage.module.css";

import { FiChevronRight, FiHome, FiEdit2, FiTrash2, FiStar } from "react-icons/fi";
import { SiGooglemaps } from "react-icons/si";
import { FcPlus } from "react-icons/fc";

const FALLBACK_IMG = "/images/placeholder-city.jpg"; // crea esta imagen o cambia la ruta

function CityDetailsPage() {
  const { country, cityId } = useParams();
  const navigate = useNavigate();

  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [mainImage, setMainImage] = useState("");

  const safeCountry = useMemo(() => decodeURIComponent(country || ""), [country]);

  const normalizeImg = (value) => {
    if (!value || typeof value !== "string") return "";
    const v = value.trim();
    return v.length ? v : "";
  };

  const pickBestMainImage = (data) => {
    // orden de prioridad
    const candidate =
      normalizeImg(data?.mainImage) ||
      normalizeImg(data?.image) ||
      (Array.isArray(data?.images) ? normalizeImg(data.images[0]) : "") ||
      "";
    return candidate;
  };

  const safeNumber = (value, fallback = 0) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  };

  const fetchCity = useCallback(() => {
    setLoading(true);

    axios
      .get(`${MainURL}/cities/${cityId}.json`)
      .then((res) => {
        const data = res.data || null;
        setCity(data);
        setMainImage(pickBestMainImage(data));
      })
      .catch((err) => {
        console.error("Error fetching city:", err);
        setCity(null);
      })
      .finally(() => setLoading(false));
  }, [cityId]);

  useEffect(() => {
    fetchCity();
  }, [fetchCity]);

  const deleteCity = () => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;

    setDeleting(true);

    axios
      .delete(`${MainURL}/cities/${cityId}.json`)
      .then(() => navigate(`/countries/${encodeURIComponent(safeCountry)}/cities`))
      .catch((err) => console.error("Error deleting city:", err))
      .finally(() => setDeleting(false));
  };

  // ✅ Borrar review por índice (más seguro que por referencia)
  const deleteReviewByIndex = (indexToDelete) => {
    if (!Array.isArray(city?.reviews)) return;

    const updatedReviews = city.reviews.filter((_, idx) => idx !== indexToDelete);

    axios
      .patch(`${MainURL}/cities/${cityId}.json`, { reviews: updatedReviews })
      .then(() => setCity((prev) => ({ ...prev, reviews: updatedReviews })))
      .catch((err) => console.error("Error deleting review:", err));
  };

  if (loading) {
    return (
      <div className={styles.pageBg}>
        <div className={styles.container}>
          <div className={styles.skeletonHero} />
          <div className={styles.skeletonRow}>
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
          </div>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className={styles.pageBg}>
        <div className={styles.container}>
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <Link className={styles.crumbLink} to="/">
              <FiHome style={{ marginRight: 6 }} />
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
            <span className={styles.crumbCurrent}>City</span>
          </nav>

          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>City not found</p>
            <p className={styles.emptyHint}>
              Parece que esta ciudad no existe (o la API no la encontró).
            </p>

            <Link
              to={`/countries/${encodeURIComponent(safeCountry)}/cities`}
              className={styles.btnPill}
            >
              ← Back to Cities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = Array.isArray(city.images) ? city.images.filter(Boolean) : [];
  const pois = Array.isArray(city.pointsOfInterest) ? city.pointsOfInterest : [];

  const mapQuery = encodeURIComponent(`${city.name}, ${city.country}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const reviews = Array.isArray(city.reviews) ? city.reviews : [];
  const reviewsCount = reviews.length;

  // ✅ Average rating robusto (no NaN / no crash)
  const computedAverageRating = useMemo(() => {
    if (reviews.length === 0) return "—";
    const sum = reviews.reduce((acc, r) => acc + safeNumber(r?.rating, 0), 0);
    const avg = sum / reviews.length;
    return Number.isFinite(avg) ? avg.toFixed(1) : "—";
  }, [reviews]);

  const onImgError = (e) => {
    if (e.currentTarget.src.includes(FALLBACK_IMG)) return;
    e.currentTarget.src = FALLBACK_IMG;
  };

  const onPickMain = (url) => {
    const u = normalizeImg(url);
    if (u) setMainImage(u);
  };

  return (
    <div className={styles.pageBg}>
      <div className={styles.container}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link className={styles.crumbLink} to="/">
            <FiHome style={{ marginRight: 6 }} />
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

          <Link
            className={styles.crumbLink}
            to={`/countries/${encodeURIComponent(safeCountry)}/cities`}
          >
            {safeCountry}
          </Link>

          <span className={styles.crumbSep} aria-hidden="true">
            <FiChevronRight />
          </span>

          <span className={styles.crumbCurrent}>{city.name}</span>
        </nav>

        <header className={styles.topBar}>
          <Link
            to={`/countries/${encodeURIComponent(safeCountry)}/cities`}
            className={styles.btnPill}
          >
            ← Back to Cities
          </Link>

          <div className={styles.topBarRight}>
            <Link
              to={`/countries/${encodeURIComponent(safeCountry)}/cities/${cityId}/edit`}
              className={styles.btnPill}
            >
              <FiEdit2 style={{ marginRight: 8 }} />
              Edit
            </Link>

            <button
              className={`${styles.btnPill} ${styles.dangerBtn}`}
              onClick={deleteCity}
              disabled={deleting}
              type="button"
            >
              <FiTrash2 style={{ marginRight: 8 }} />
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </header>

        <section className={`${styles.hero} ${styles.enterUp}`}>
          <div className={styles.heroTopRow}>
            <span className={styles.heroKicker}>Travel Journal • CityVerse</span>
            <span className={styles.heroMiniPill}>{city.country}</span>
          </div>

          <h1 className={styles.heroTitle}>{city.name}</h1>
          <p className={styles.heroSubtitle}>
            Save memories, check ratings, and keep your travel journal looking professional.
          </p>

          <div className={styles.heroChips}>
            <span className={styles.chip}>
              <FiStar aria-hidden="true" />
              {computedAverageRating}
            </span>

            <span className={styles.chip}>
              {reviewsCount} {reviewsCount === 1 ? "review" : "reviews"}
            </span>

            <span className={styles.chip}>{pois.length} POIs</span>
          </div>

          <div className={styles.heroActions}>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.btnPrimary}
            >
              <SiGooglemaps style={{ marginRight: 8, verticalAlign: "middle" }} />
              Open in Google Maps
            </a>
          </div>

          <div className={styles.mainImageWrap}>
            <img
              src={mainImage || FALLBACK_IMG}
              alt={city.name}
              className={styles.mainImage}
              onError={onImgError}
              loading="lazy"
            />
          </div>
        </section>

        <div className={styles.divider} aria-hidden="true" />

        {images.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Gallery</h2>
              <p className={styles.sectionHint}>Tip: click para ponerla como principal.</p>
            </div>

            <div className={styles.gallery}>
              {images.map((url, i) => {
                const clean = normalizeImg(url);
                if (!clean) return null;

                return (
                  <button
                    key={`${clean}-${i}`}
                    type="button"
                    className={styles.galleryBtn}
                    onClick={() => onPickMain(clean)}
                    aria-label={`Set image ${i + 1} as main`}
                  >
                    <img
                      src={clean}
                      alt={`${city.name} ${i + 1}`}
                      className={styles.galleryImg}
                      onError={onImgError}
                      loading="lazy"
                    />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {pois.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Points of Interest</h2>
              <p className={styles.sectionHint}>
                Click on one of the images to enlarge it.
              </p>
            </div>

            <div className={styles.poiGrid}>
              {pois.map((poi, index) => {
                const name = typeof poi === "string" ? poi : poi?.name;
                const url = typeof poi === "string" ? "" : poi?.url;

                return (
                  <button
                    key={`${name}-${index}`}
                    type="button"
                    className={styles.poiCard}
                    onClick={() => url && onPickMain(url)}
                    disabled={!url}
                    aria-label={url ? `Use ${name} image` : `${name}`}
                  >
                    <div className={styles.poiTop}>
                      <strong className={styles.poiName}>{name}</strong>
                    </div>

                    {url ? (
                      <img
                        src={url}
                        alt={name}
                        className={styles.poiImg}
                        onError={onImgError}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.poiNoImg}>No image</div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <div className={styles.reviewsHeader}>
            <h2 className={styles.sectionTitle}>Reviews</h2>

            <button
              className={styles.btnPrimary}
              onClick={() => setShowReviewForm((prev) => !prev)}
              type="button"
            >
              {showReviewForm ? (
                "Cancel"
              ) : (
                <>
                  <FcPlus style={{ fontSize: 20 }} />
                  Add Review
                </>
              )}
            </button>
          </div>

          {showReviewForm && (
            <div className={styles.formWrap}>
              <ReviewForm
                cityId={cityId}
                reviews={reviews}
                onAddReview={(updatedReviews) => {
                  setCity((prev) => ({ ...prev, reviews: updatedReviews }));
                  setShowReviewForm(false);
                }}
              />
            </div>
          )}

          {reviews.length > 0 ? (
            <div className={styles.reviewsGrid}>
              {reviews.map((review, index) => (
                <article key={index} className={styles.reviewCard}>
                  <button
                    className={styles.deleteReviewBtn}
                    onClick={() => deleteReviewByIndex(index)}
                    type="button"
                    aria-label="Delete review"
                  >
                    ✕
                  </button>

                  <div className={styles.reviewTop}>
                    <strong className={styles.reviewUser}>{review.user}</strong>
                    <span className={styles.reviewRating}>⭐ {review.rating}</span>
                  </div>

                  <p className={styles.reviewText}>{review.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>No reviews yet</p>
              <p className={styles.emptyHint}>
                Sé el primero en dejar una reseña y quedar como MVP.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CityDetailsPage;

