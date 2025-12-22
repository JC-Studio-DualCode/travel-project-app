import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MainURL } from "../config/api";
import ReviewForm from "../components/ReviewForm";
import styles from "./CityDetailsPage.module.css";

import { FiChevronRight, FiHome, FiEdit2, FiTrash2, FiStar } from "react-icons/fi";
import { SiGooglemaps } from "react-icons/si";
import { FcPlus } from "react-icons/fc";
import { useAuth } from "../components/AuthContext"

const FALLBACK_IMG = "/images/placeholder-city.jpg";

function CityDetailsPage() {
  const { country, cityId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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
    const candidate =
      normalizeImg(data?.mainImage) ||
      normalizeImg(data?.image) ||
      (Array.isArray(data?.images) ? normalizeImg(data.images[0]) : "") ||
      "";
    return candidate;
  };

  const fetchCity = () => {
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
  };

  useEffect(() => {
    fetchCity();

  }, [cityId]);

  const backToCitiesPath = `/countries/${encodeURIComponent(safeCountry)}/cities`;

  const deleteCity = () => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;

    setDeleting(true);

    axios
      .delete(`${MainURL}/cities/${cityId}.json`)
      .then(() => navigate(backToCitiesPath))
      .catch((err) => console.error("Error deleting city:", err))
      .finally(() => setDeleting(false));
  };


  const reviews = useMemo(() => {
    if (!city) return [];
    return Array.isArray(city.reviews) ? city.reviews.filter(Boolean) : [];
  }, [city]);

  const deleteReviewByIndex = (index) => {
    const next = reviews.filter((_, i) => i !== index);

    axios
      .patch(`${MainURL}/cities/${cityId}.json`, { reviews: next })
      .then(() => setCity((prev) => ({ ...(prev || {}), reviews: next })))
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

            <Link to={backToCitiesPath} className={styles.btnPill}>
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

  const numericRatings = reviews
    .map((r) => Number(r?.rating))
    .filter((n) => Number.isFinite(n) && n > 0);

  const computedAverageRating =
    numericRatings.length > 0
      ? (
        numericRatings.reduce((sum, n) => sum + n, 0) / numericRatings.length
      ).toFixed(1)
      : "—";

  const reviewsCount = reviews.length;

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

          <Link className={styles.crumbLink} to={backToCitiesPath}>
            {safeCountry}
          </Link>

          <span className={styles.crumbSep} aria-hidden="true">
            <FiChevronRight />
          </span>

          <span className={styles.crumbCurrent}>{city.name}</span>
        </nav>

        <header className={styles.topBar}>
          <Link to={backToCitiesPath} className={styles.btnPill}>
            ← Back to Cities
          </Link>
        {user && (
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
        )}
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
          
            <span className={`${styles.chip} ${styles.chipPrimary}`}>
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
              <p className={styles.sectionHint}>Click on one of the images to use it as main.</p>
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
                  setCity((prev) => ({ ...(prev || {}), reviews: updatedReviews }));
                  setShowReviewForm(false);
                }}
              />
            </div>
          )}

          {reviews.length > 0 ? (
            <div className={styles.reviewsGrid}>
              {reviews.map((review, index) => (
                <article
                  key={`${review?.user || "user"}-${index}`}
                  className={styles.reviewCard}
                >
                  <button
                    className={styles.deleteReviewBtn}
                    onClick={() => deleteReviewByIndex(index)}
                    type="button"
                    aria-label="Delete review"
                    title="Delete review"
                  >
                    <FiTrash2 />
                  </button>

                  {/* ✅ CHANGED: rating antes del nombre */}
                  <div className={styles.reviewTop}>
                    <span className={styles.reviewRating}>⭐ {review?.rating ?? "—"}</span>
                    <strong className={styles.reviewUser}>
                      {review?.user || "Anonymous"}
                    </strong>
                  </div>

                  <p className={styles.reviewText}>{review?.comment || ""}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>No reviews yet</p>
              <p className={styles.emptyHint}>Be the first to leave a review and become an MVP.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
export default CityDetailsPage;
