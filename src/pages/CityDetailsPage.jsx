import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MainURL } from "../config/api";
import ReviewForm from "../components/ReviewForm";
import styles from "./CityDetailsPage.module.css";
import { FcPlus } from "react-icons/fc";
import { SiGooglemaps } from "react-icons/si";

function CityDetailsPage() {
  const { country, cityId } = useParams();
  const navigate = useNavigate();

  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [mainImage, setMainImage] = useState("");

  // Fetch city
  const fetchCity = () => {
    setLoading(true);
    axios
      .get(`${MainURL}/cities/${cityId}.json`)
      .then((res) => {
        setCity(res.data);
        setMainImage(res.data.mainImage || res.data.image || "");
      })
      .catch((err) => console.error("Error fetching city:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCity();
  }, [cityId]);

  // Delete city
  const deleteCity = () => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;
    setDeleting(true);
    axios
      .delete(`${MainURL}/cities/${cityId}.json`)
      .then(() => navigate(`/countries/${country}/cities`))
      .catch((err) => console.error("Error deleting city:", err))
      .finally(() => setDeleting(false));
  };

  // Delete review
  const deleteReview = (reviewToDelete) => {
    const updatedReviews = city.reviews.filter((r) => r !== reviewToDelete);
    axios
      .patch(`${MainURL}/cities/${cityId}.json`, { reviews: updatedReviews })
      .then(() => setCity((prev) => ({ ...prev, reviews: updatedReviews })))
      .catch((err) => console.error("Error deleting review:", err));
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;

  if (!city) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.page}>
          <Link to={`/countries/${country}/cities`} className={styles.blueBtn}>
            ← Back
          </Link>
          <h1 className={styles.notFoundTitle}>City not found</h1>
        </div>
      </div>
    );
  }

  const images = Array.isArray(city.images) ? city.images : [];
  const pois = Array.isArray(city.pointsOfInterest) ? city.pointsOfInterest : [];
  const mapQuery = encodeURIComponent(`${city.name}, ${city.country}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const computedAverageRating =
    city.reviews && city.reviews.length > 0
      ? (
          city.reviews.reduce((sum, r) => sum + Number(r.rating), 0) /
          city.reviews.length
        ).toFixed(1)
      : "—";

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.page}>
        {/* HEADER */}
        <div className={styles.header}>
          <Link to={`/countries/${country}/cities`} className={styles.blueBtn}>
            ← Back
          </Link>

          <div className={styles.headerRight}>
            <Link
              to={`/countries/${country}/cities/${cityId}/edit`}
              className={styles.blueBtn}
            >
              Edit
            </Link>

            <button
              className={styles.blueBtn}
              onClick={deleteCity}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {/* HERO */}
        <section className={styles.countryHero}>
          <div className={styles.heroOverlay}>
            <div className={styles.countryTitle}>
              <h1>{city.name}</h1>
              <p className={styles.countrySubtitle}>{city.country}</p>

              <div className={styles.heroChips}>
                <span className={`${styles.chip} ${styles.averageChip}`}>
                  ⭐ {computedAverageRating}
                </span>
                <span className={styles.chip}>
                  {city.reviews?.length || 0}{" "}
                  {city.reviews?.length === 1 ? "review" : "reviews"}
                </span>
                <span className={styles.chip}>{pois.length} POIs</span>
              </div>

              <div className={styles.countryActions}>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn primary"
                >
                  <SiGooglemaps
                    style={{ marginRight: 8, verticalAlign: "middle" }}
                  />
                  Open in Google Maps
                </a>
              </div>
            </div>

            {mainImage && (
              <div className={styles.heroImageWrapper}>
                <img
                  src={mainImage}
                  alt={city.name}
                  className={styles.heroImg}
                />
              </div>
            )}
          </div>
        </section>

        {/* GALLERY */}
        {images.length > 0 && (
          <div className={styles.gallery}>
            {images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`${city.name} ${i + 1}`}
                className={styles.galleryImg}
              />
            ))}
          </div>
        )}

        {/* POIS */}
        {pois.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Points of Interest</h2>
            <div className={styles.poiList}>
              {pois.map((poi, index) => {
                const name = typeof poi === "string" ? poi : poi.name;
                const url = typeof poi === "string" ? null : poi.url;

                return (
                  <div
                    key={index}
                    className={styles.poiItem}
                    onClick={() => url && setMainImage(url)}
                  >
                    <strong>{name}</strong>
                    {url && <img src={url} alt={name} />}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* REVIEWS */}
        <section className={styles.reviewsSection}>
          <div className={styles.reviewsHeader}>
            <h2>Reviews</h2>
            <button
              className={styles.addReviewBtn}
              onClick={() => setShowReviewForm((prev) => !prev)}
            >
              {showReviewForm ? "Cancel" : (
                <>
                  <FcPlus style={{ fontSize: "20px" }} />
                  Add Review
                </>
              )}
            </button>
          </div>

          {showReviewForm && (
            <ReviewForm
              cityId={cityId}
              reviews={city.reviews || []}
              onAddReview={(updatedReviews) => {
                setCity((prev) => ({ ...prev, reviews: updatedReviews }));
                setShowReviewForm(false);
              }}
            />
          )}

          {city.reviews?.length > 0 && (
            <div className={styles.reviews}>
              {city.reviews.map((review, index) => (
                <div key={index} className={styles.reviewCard}>
                  <button
                    className={styles.deleteReviewBtn}
                    onClick={() => deleteReview(review)}
                  >
                    ✕
                  </button>
                  <div className={styles.reviewHeader}><strong>{review.user}</strong></div>
                  <div className={styles.reviewText}>{review.comment}</div>
                  <div className={styles.reviewRating}>⭐ {review.rating}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CityDetailsPage;
