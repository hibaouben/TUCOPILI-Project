import { useState } from "react";

function Reservation() {
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const times = ["12:00", "13:00", "14:00", "18:00", "19:00", "20:00"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !time) {
      alert("Please choose a date and time.");
      return;
    }

    alert(
      `Reservation for ${guests} ${
        guests > 1 ? "people" : "person"
      } on ${date} at ${time}. Payment: ${
        paymentMethod === "cash" ? "Cash" : "Card"
      }.`
    );
  };

  return (
    <main className="reservation-page">
      <div className="reservation-header">
        <p className="section-small-title">
          your moment at tucopili
        </p>

        <h1>
          Book
          <br />
          <i>a table.</i>
        </h1>

        <p>
          Choose your date, time, and number of guests.
          We'll take care of the rest.
        </p>
      </div>

      <form className="reservation-card" onSubmit={handleSubmit}>
        {/* DATE */}
        <div className="reservation-field">
          <label htmlFor="date">Date</label>

          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {/* TIME */}
        <div className="reservation-field">
          <label>Time</label>

          <div className="time-options">
            {times.map((item) => (
              <button
                type="button"
                key={item}
                className={`time-pill ${
                  time === item ? "active" : ""
                }`}
                onClick={() => setTime(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* GUESTS */}
        <div className="reservation-field">
          <label>Number of guests</label>

          <div className="guests-counter">
            <button
              type="button"
              onClick={() =>
                setGuests((value) => Math.max(1, value - 1))
              }
            >
              −
            </button>

            <span>
              {guests} {guests > 1 ? "people" : "person"}
            </span>

            <button
              type="button"
              onClick={() =>
                setGuests((value) => Math.min(12, value + 1))
              }
            >
              +
            </button>
          </div>
        </div>

        {/* NAME */}
        <div className="reservation-field">
          <label htmlFor="name">Name</label>

          <input
            id="name"
            type="text"
            placeholder="Your name"
            required
          />
        </div>

        {/* EMAIL */}
        <div className="reservation-field">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>

        {/* PHONE */}
        <div className="reservation-field">
          <label htmlFor="phone">Phone</label>

          <input
            id="phone"
            type="tel"
            placeholder="+212 6..."
            required
          />
        </div>

        {/* PAYMENT */}
        <div className="reservation-field">
          <label>Payment Method</label>

          <div className="payment-options">
            <button
              type="button"
              className={`payment-option ${
                paymentMethod === "cash" ? "active" : ""
              }`}
              onClick={() => setPaymentMethod("cash")}
            >
              <span className="payment-icon">💵</span>
              <span>
                <strong>Cash</strong>
                <small>Pay at the café</small>
              </span>
            </button>

            <button
              type="button"
              className={`payment-option ${
                paymentMethod === "card" ? "active" : ""
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <span className="payment-icon">💳</span>
              <span>
                <strong>Card</strong>
                <small>Pay by card</small>
              </span>
            </button>
          </div>
        </div>

        <button type="submit" className="reservation-submit">
          Book My Table
        </button>
      </form>
    </main>
  );
}

export default Reservation;