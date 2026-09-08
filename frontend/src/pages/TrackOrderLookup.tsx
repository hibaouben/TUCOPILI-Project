import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TrackOrderLookup() {
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      navigate(`/track-order/${orderId.trim()}`);
    }
  };

  return (
    <main className="track-order-page">
      <div className="track-order-container">
        <div className="track-order-header">
          <p className="section-small-title">your order</p>
          <h1>
            Track your
            <br />
            <i>order.</i>
          </h1>
          <p>Enter your order number to see its status.</p>
        </div>

        <form onSubmit={handleSubmit} className="track-lookup-form">
          <input
            type="text"
            placeholder="Order number (e.g. 12)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
          <button type="submit" className="track-menu-btn">
            Track
            <span>→</span>
          </button>
        </form>
      </div>
    </main>
  );
}

export default TrackOrderLookup;