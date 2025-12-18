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

  // Fetch city data
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

  // Delete review by object reference
  const deleteReview = (reviewToDelete) => {
    const updatedReviews = city.reviews.filter((r) => r !== reviewToDelete);

    axios
      .patch(`${MainURL}/cities/${cityId}.json`, { reviews: updatedReviews })
      .then(() => setCity((prev) => ({ ...prev, reviews: updatedReviews })))
      .catch((err) => console.error("Error deleting review:", err));
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;

  if (!city)
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <Link to={`/countries/${country}/cities`} className="btn ghost">
            ← Back
          </Link>
        </div>
        <h1 className={styles.notFoundTitle}>City not found</h1>
      </div>
    );

  const images = Array.isArray(city.images) ? city.images : [];
  const mapQuery = encodeURIComponent(`${city.name}, ${city.country}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const pois = Array.isArray(city.pointsOfInterest) ? city.pointsOfInterest : [];

  // Calcular averageRating en tiempo real
  const computedAverageRating =
    city.reviews && city.reviews.length > 0
      ? (
          city.reviews.reduce((sum, r) => sum + Number(r.rating), 0) /
          city.reviews.length
        ).toFixed(1)
      : "—";

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <Link to={`/countries/${country}/cities`} className="btn ghost">
          ← Back
        </Link>

        <div className={styles.headerRight}>
          <Link
            to={`/countries/${country}/cities/${cityId}/edit`}
            className="btn ghost"
          >
            Edit
          </Link>

          <button
            className="btn primary"
            onClick={deleteCity}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.title}>{city.name}</h1>
          <p className={styles.meta}>{city.country}</p>
          <p className={styles.description}>{city.description}</p>
          <p className={styles.averageRating}>⭐ {computedAverageRating}</p>

          <a
            className={`btn ${styles.mapBtn}`}
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            <SiGooglemaps style={{ marginRight: "8px", fontSize: "20px" }} />
            Open in Google Maps
          </a>
        </div>

        {mainImage && (
          <img className={styles.heroImg} src={mainImage} alt={city.name} />
        )}
      </div> 

      {/* GALLERY */}
      {images.length > 0 && (
        <div className={styles.gallery}>
          {images.map((url, i) => (
            <img
              key={i}
              className={styles.galleryImg}
              src={url}
              alt={`${city.name} ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* POINTS OF INTEREST */}
      {pois.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Points of Interest</h2>
          <ul className={styles.list}>
            {pois.map((poi, index) => {
              const name = typeof poi === "string" ? poi : poi.name;
              const url = typeof poi === "string" ? null : poi.url;

              return (
                <li
                  key={index}
                  className={styles.poiItem}
                  onClick={() => url && setMainImage(url)}
                  style={{ cursor: url ? "pointer" : "default" }}
                >
                  <strong>{name}</strong>
                  {url && (
                    <img
                      src={url}
                      alt={name}
                      style={{ width: 120, marginLeft: 24 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* REVIEWS */}
      <section className={styles.section}>
        <div className={styles.reviewsHeader}>
          <h2 className={styles.sectionTitle}>Reviews</h2>

          <button
            className="btn ghost"
            onClick={() => setShowReviewForm((prev) => !prev)}
          >
            {showReviewForm ? "Cancel" : (
              <>
                <FcPlus style={{ fontSize: "24px", marginRight: "8px" }} />
                Add review
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
              <article key={index} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <strong>{review.user}</strong>
                  <span className={styles.reviewRating}>⭐ {review.rating}</span>
                  <button
                    className={styles.deleteReviewBtn}
                    onClick={() => deleteReview(review)}
                    title="Delete review"
                  >
                    ✕
                  </button>
                </div>
                <p className={styles.reviewText}>{review.comment}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div> 
  );  
}
        export default CityDetailsPage;
