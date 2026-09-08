import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllOrders, updateOrderStatus, type Order } from "../services/orderService";
const COLUMNS = [
  { key: "PENDING", label: "En attente", statuses: ["PENDING", "CONFIRMED"], next: "PREPARING" },
  { key: "PREPARING", label: "En préparation", statuses: ["PREPARING"], next: "READY" },
  { key: "READY", label: "Prêt", statuses: ["READY"], next: "COMPLETED" },
];

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleAdvance = async (orderId: number, nextStatus: string) => {
    try {
      await updateOrderStatus(orderId, nextStatus);
      fetchOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const activeOrders = orders.filter((o) =>
    ["PENDING", "CONFIRMED", "PREPARING", "READY"].includes(o.status)
  );

  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, order) => sum + Number(order.total), 0);

  if (loading) {
    return (
      <AdminLayout>
        <p>Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-header">
        <h1>Orders — Live Board</h1>
      </div>

      <div className="dashboard-stats" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
        <div className="stat-card">
          <span className="stat-label">Active Orders</span>
          <strong>{activeOrders.length}</strong>
        </div>

        <div className="stat-card">
          <span className="stat-label">Completed Revenue</span>
          <strong>{totalRevenue.toFixed(2)} MAD</strong>
        </div>
      </div>

      <div className="kanban-board">
        {COLUMNS.map((column) => {
          const columnOrders = activeOrders.filter((o) =>
            column.statuses.includes(o.status)
          );

          return (
            <div className="kanban-column" key={column.key}>
              <div className="kanban-column-header">
                <h3>{column.label}</h3>
                <span>{columnOrders.length}</span>
              </div>

              <div className="kanban-cards">
                {columnOrders.length === 0 && (
                  <p className="kanban-empty">Aucune commande</p>
                )}

                {columnOrders.map((order) => (
                  <div className="kanban-card" key={order.id}>
                    <div className="kanban-card-top">
                      <strong>#{order.id}</strong>
                      <span>{Number(order.total).toFixed(2)} MAD</span>
                    </div>

                    <ul className="kanban-card-items">
                      {order.orderItems?.map((item) => (
                        <li key={item.id}>
                          {item.quantity} × {item.product.name}
                        </li>
                      ))}
                    </ul>

                    <button
                      className="kanban-advance-btn"
                      onClick={() => handleAdvance(order.id, column.next)}
                    >
                      {column.next === "PREPARING" && "Démarrer la préparation →"}
                      {column.next === "READY" && "Marquer comme prêt →"}
                      {column.next === "COMPLETED" && "Marquer comme terminé →"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;