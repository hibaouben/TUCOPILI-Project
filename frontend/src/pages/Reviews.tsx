import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getReviews, createReview } from "../services/reviewService";
import type { ReviewFromBackend } from "../services/reviewService";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} month(s) ago`;
}

function mapReview(r: ReviewFromBackend): Review {
  return {
    id: r.id,
    name: `${r.user.firstName} ${r.user.lastName}`,
    rating: r.rating,
    comment: r.comment,
    date: formatDate(r.createdAt),
  };
}

function Reviews() {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getReviews()
      .then((data) => setReviews(data.map(mapReview)))
      .catch((err) => {
        console.error("Erreur chargement avis :", err);
        setError("Impossible de charger les avis.");
      })
      .finally(() => setLoading(false));
  }, []);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) return;

    if (!user) {
      setError("Vous devez être connecté pour laisser un avis.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const newReviewFromBackend = await createReview({
        rating,
        comment: comment.trim(),
        userId: Number(user.id),
      });

      setReviews((prev) => [mapReview(newReviewFromBackend), ...prev]);

      setRating(5);
      setComment("");
      setShowForm(false);
    } catch (err) {
      console.error("Erreur création avis :", err);
      setError("Impossible d'envoyer votre avis. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="reviews-page">

      {/* HERO */}
      <div className="reviews-hero">
        <p className="reviews-eyebrow">YOUR WORDS</p>

        <h1>
          What our
          <br />
          <i>guests say.</i>
        </h1>

        <p className="reviews-intro">
          Every visit means something to us. Here is what our guests
          have to say about their time at TUCOPILI.
        </p>

        <div className="reviews-rating">
          <strong>{averageRating.toFixed(1)}</strong>

          <div className="rating-stars">
            ★★★★★
          </div>

          <span>{reviews.length} reviews</span>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="reviews-container">
        <div className="reviews-heading">
          <div>
            <p className="reviews-section-label">CUSTOMER REVIEWS</p>
            <h2>Kind words from our table.</h2>
          </div>

          <button
            className="leave-review-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close" : "Leave a Review"}
          </button>
        </div>

        {error && <p className="review-error">{error}</p>}

        {/* FORM */}
        {showForm && (
          <form className="review-form" onSubmit={handleSubmit}>

            <div className="form-top">
              <div className="form-group">
                <label>Your rating</label>

                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={star <= rating ? "selected" : ""}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Your review</label>

              <textarea
                placeholder="Tell us about your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                required
              />
            </div>

            <button
              type="submit"
              className="submit-review-btn"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Submit Review →"}
            </button>
          </form>
        )}

        {/* REVIEW GRID */}
        {loading ? (
          <p>Loading reviews...</p>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <article className="review-card" key={review.id}>

                <div className="review-card-top">
                  <div className="review-avatar">
                    {review.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3>{review.name}</h3>
                    <span>{review.date}</span>
                  </div>

                  <div className="review-stars">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                </div>

                <p className="review-comment">
                  "{review.comment}"
                </p>

                <div className="review-bottom">
                  <span>Verified guest</span>
                  <span>✦</span>
                </div>

              </article>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM MESSAGE */}
      <div className="reviews-footer">
        <p className="reviews-section-label">TUCOPILI CAFÉ</p>

        <h2>
          Come for the coffee.
          <br />
          <i>Stay for the feeling.</i>
        </h2>

        <p>
          We look forward to welcoming you soon.
        </p>
      </div>

    </section>
  );
}

export default Reviews;