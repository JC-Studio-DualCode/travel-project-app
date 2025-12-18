import { useState } from "react";
import axios from "axios";
import { MainURL } from "../config/api";
import styles from "./ReviewForm.module.css";

function ReviewForm({ cityId, reviews = [], onAddReview }) {
  const [user, setUser] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const safeNumber = (value, fallback) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReview = {
      user: user.trim(),
      comment: comment.trim(),
      rating: safeNumber(rating, 5),
    };

    // ✅ Extra seguridad: evita guardar strings vacíos con espacios
    if (!newReview.user || !newReview.comment) return;

    // Add newest review at the top
    const updatedReviews = [newReview, ...(Array.isArray(reviews) ? reviews : [])];

    setSubmitting(true);

    axios
      .patch(`${MainURL}/cities/${cityId}.json`, { reviews: updatedReviews })
      .then(() => {
        onAddReview?.(updatedReviews); // Update UI immediately
        setUser("");
        setComment("");
        setRating(5);
      })
      .catch((err) => console.error("Error adding review:", err))
      .finally(() => setSubmitting(false));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.reviewForm}>
      <label>
        Nickname
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />
      </label>

      <label>
        Comment
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </label>

      <label>
        Rating
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Add review"}
      </button>
    </form>
  );
}

export default ReviewForm;

