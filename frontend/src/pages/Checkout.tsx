import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import type { PaymentMethod } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { getProductImage } from "../utils/images";

function Checkout() {
  const {
    items,
    total,
    placeOrder,
  } = useCart();

  const { user } = useAuth();

  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handlePlaceOrder = async () => {
    if (items.length === 0 || loading) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const order = await placeOrder(paymentMethod);

      if (order) {
        navigate("/track-order");
      } else {
        setError(
          "Impossible de créer la commande. Veuillez réessayer."
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        "Une erreur est survenue lors de la commande."
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <p className="section-small-title">
            your order
          </p>

          <h1>
            Your cart is
            <br />
            <i>empty.</i>
          </h1>

          <p>
            Add something delicious from our menu
            before checking out.
          </p>

          <Link
            to="/menu"
            className="checkout-back-btn"
          >
            Explore Menu
            <span>→</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">

        <div className="checkout-header">
          <p className="section-small-title">
            almost there
          </p>

          <h1>
            Complete your
            <br />
            <i>order.</i>
          </h1>

          <p>
            Choose your payment method and place
            your order.
          </p>
        </div>

        <div className="checkout-grid">

          <section className="checkout-card">
            <div className="checkout-card-header">
              <p>YOUR ORDER</p>
              <h2>Order Summary</h2>
            </div>

            <div className="checkout-items">
              {items.map((item) => (
                <div
                  className="checkout-item"
                  key={item.id}
                >
                  <div className="checkout-item-image">
                    {item.image ? (
                      <img
                        src={getProductImage(item.image) ?? ""}
                        alt={item.name}
                      />
                    ) : (
                      <span>T</span>
                    )}
                  </div>

                  <div className="checkout-item-info">
                    <h3>{item.name}</h3>

                    <span>
                      {item.quantity} ×{" "}
                      {item.price} MAD
                    </span>
                  </div>

                  <strong>
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toFixed(2)}{" "}
                    MAD
                  </strong>
                </div>
              ))}
            </div>

            <div className="checkout-total">
              <span>Total</span>

              <strong>
                {total.toFixed(2)} MAD
              </strong>
            </div>
          </section>

          <section className="checkout-card">
            <div className="checkout-card-header">
              <p>PAYMENT</p>
              <h2>Payment Method</h2>
            </div>

            <div className="checkout-payment-options">

              <button
                type="button"
                className={`checkout-payment-option ${
                  paymentMethod === "cash"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPaymentMethod("cash")
                }
                disabled={loading}
              >
                <span className="checkout-payment-icon">
                  💵
                </span>

                <span className="checkout-payment-text">
                  <strong>Cash</strong>
                  <small>
                    Pay at the café
                  </small>
                </span>

                <span className="payment-radio">
                  {paymentMethod === "cash"
                    ? "✓"
                    : ""}
                </span>
              </button>

              <button
                type="button"
                className={`checkout-payment-option ${
                  paymentMethod === "card"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPaymentMethod("card")
                }
                disabled={loading}
              >
                <span className="checkout-payment-icon">
                  💳
                </span>

                <span className="checkout-payment-text">
                  <strong>Card</strong>
                  <small>
                    Pay securely by card
                  </small>
                </span>

                <span className="payment-radio">
                  {paymentMethod === "card"
                    ? "✓"
                    : ""}
                </span>
              </button>

            </div>

            {paymentMethod === "card" && (
              <div className="card-message">
                <p>
                  Card payment will be processed
                  securely.
                </p>
              </div>
            )}

            {error && (
              <div className="card-message">
                <p>{error}</p>
              </div>
            )}

            <button
              type="button"
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : "Place Order"}

              {!loading && <span>→</span>}
            </button>

            <Link
              to="/menu"
              className="continue-shopping"
            >
              ← Continue Shopping
            </Link>
          </section>

        </div>
      </div>
    </main>
  );
}

export default Checkout;