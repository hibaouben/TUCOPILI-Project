import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function OrderConfirmation() {
  return (
    <section className="order-confirmation">
      <div className="confirmation-content">

        {/* LOGO */}
        <div className="confirmation-logo">
          <img src={logo} alt="Tucopili Café" />
        </div>

        {/* CHECK */}
        <div className="confirmation-check">
          ✓
        </div>

        {/* TEXT */}
        <p className="confirmation-eyebrow">
          ORDER RECEIVED
        </p>

        <h1>
          Thank you for your order.
        </h1>

        <p className="confirmation-text">
          Your order has been received and is being prepared with care.
          We can't wait to serve you.
        </p>

        {/* ORDER INFO */}
        <div className="confirmation-details">
          <div className="confirmation-detail">
            <span>STATUS</span>
            <strong>Preparing</strong>
          </div>

          <div className="confirmation-detail">
            <span>ORDER</span>
            <strong>#TUCOPILI</strong>
          </div>
        </div>

        {/* BUTTON */}
        <Link
          to="/menu"
          className="confirmation-btn"
        >
          Back to Menu
          <span>→</span>
        </Link>

        <p className="confirmation-note">
          Thank you for choosing TUCOPILI Café
        </p>

      </div>
    </section>
  );
}

export default OrderConfirmation;