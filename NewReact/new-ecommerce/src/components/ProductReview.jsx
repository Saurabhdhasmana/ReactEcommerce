import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductReview = ({ productId, userId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch reviews for this product
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/product/${productId}/reviews`);
      setReviews(res.data);
      setLoading(false);
    } catch (err) {
      setReviews([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
    // eslint-disable-next-line
  }, [productId]);

  // Submit review
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("/api/review", {
        user: userId,
        product: productId,
        rating,
        comment
      });
      setRating(5);
      setComment("");
      fetchReviews();
      alert("Review submitted!");
    } catch (err) {
      alert(err.response?.data?.error || "Error submitting review");
    }
  };

  return (
    <div className="product-review-section">
      <h4>Product Reviews</h4>
      {loading ? <p>Loading...</p> : (
        <>
          {reviews.length === 0 && <p>No reviews yet.</p>}
          {reviews.map(r => (
            <div key={r._id} className="review-item" style={{borderBottom: '1px solid #eee', marginBottom: 8, paddingBottom: 8}}>
              <strong>{r.user?.name || "User"}</strong> - <span>{r.rating}★</span>
              <p style={{margin: 0}}>{r.comment}</p>
            </div>
          ))}
        </>
      )}
      <form onSubmit={handleSubmit} style={{marginTop: 16}}>
        <div className="mb-2">
          <label>Rating: </label>
          <select value={rating} onChange={e => setRating(Number(e.target.value))}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="mb-2">
          <label>Comment: </label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} required style={{width: '100%', minHeight: 60}} />
        </div>
        <button type="submit" className="btn btn-primary">Submit Review</button>
      </form>
    </div>
  );
};

export default ProductReview;
