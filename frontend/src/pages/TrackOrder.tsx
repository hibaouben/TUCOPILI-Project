import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById, type Order } from "../services/orderService";
function TrackOrder() {
  const { id } = useParams();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await getOrderById(Number(id));
        setActiveOrder(data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        setActiveOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return <main className="track-order-page">Loading...</main>;
  }

  if (!activeOrder) {
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
            <p>You don't have an active order yet.</p>
          </div>
          <Link to="/menu" className="track-menu-btn">
            Explore Menu
            <span>→</span>
          </Link>
        </div>
      </main>
    );
  }

  const steps = [
    { title: "Order placed", description: "Your order has been received.", completed: true, current: false },
    {
      title: "Confirmed",
      description: "Your order has been confirmed.",
      completed: ["CONFIRMED", "PREPARING", "READY", "COMPLETED"].includes(activeOrder.status),
      current: activeOrder.status === "CONFIRMED",
    },
    {
      title: "Preparing",
      description: "Our team is preparing your order.",
      completed: ["PREPARING", "READY", "COMPLETED"].includes(activeOrder.status),
      current: activeOrder.status === "PREPARING",
    },
    {
      title: "Ready",
      description: "Your order is ready to enjoy.",
      completed: ["READY", "COMPLETED"].includes(activeOrder.status),
      current: activeOrder.status === "READY",
    },
    {
      title: "Completed",
      description: "Thank you for choosing TUCOPILI.",
      completed: activeOrder.status === "COMPLETED",
      current: activeOrder.status === "COMPLETED",
    },
  ];

  const statusMessage =
    activeOrder.status === "PENDING" ? "Order received" :
    activeOrder.status === "CONFIRMED" ? "Order confirmed" :
    activeOrder.status === "PREPARING" ? "Preparing your order" :
    activeOrder.status === "READY" ? "Your order is ready" :
    activeOrder.status === "CANCELLED" ? "Order cancelled" :
    "Order completed";

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
          <p>Follow your order from preparation to completion.</p>
        </div>

        <div className="order-number">
          <span>ORDER NUMBER</span>
          <strong>#{activeOrder.id}</strong>
        </div>

        <section className="order-status-card">
          <div className="status-header">
            <div>
              <p className="status-label">CURRENT STATUS</p>
              <h2>{statusMessage}</h2>
            </div>
            <span className="status-badge">{activeOrder.status}</span>
          </div>

          <div className="order-timeline">
            {steps.map((step, index) => (
              <div
                className={`timeline-step ${step.completed ? "completed" : step.current ? "current" : "pending"}`}
                key={step.title}
              >
                <div className="timeline-marker">{step.completed ? "✓" : index + 1}</div>
                <div className="timeline-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="order-summary-card">
          <div className="summary-header">
            <p className="status-label">YOUR ORDER</p>
            <h2>Order Summary</h2>
          </div>

          {activeOrder.orderItems.map((item) => (
            <div className="order-item" key={item.id}>
              <div>
                <h3>{item.product.name}</h3>
                <span>× {item.quantity}</span>
              </div>
              <strong>{(parseFloat(item.unitPrice) * item.quantity).toFixed(2)} MAD</strong>
            </div>
          ))}

          <div className="order-total">
            <span>Total</span>
            <strong>{Number(activeOrder.total).toFixed(2)} MAD</strong>
          </div>
        </section>

        <Link to="/menu" className="track-menu-btn">
          Back to Menu
          <span>→</span>
        </Link>
      </div>
    </main>
  );
}

export default TrackOrder;