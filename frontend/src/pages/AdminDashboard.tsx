import { useEffect, useMemo, useState } from "react";
import AdminLayout, { type AdminTab } from "../components/AdminLayout";

import {
  getAllOrders,
  updateOrderStatus,
} from "../services/orderService";

import { getAllReservations } from "../services/reservationService";

import {
  getAllUsers,
  createEmployee,
} from "../services/userService";

import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";

interface Order {
  id: number;
  status: string;
  total: number | string;
  orderDate: string;
  type?: string;

  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };

  orderItems?: {
    id: number;
    quantity: number;
    unitPrice: string;

    product?: {
      id: number;
      name: string;
      price: string;
    };
  }[];
}

interface Reservation {
  id: number;
  date: string;
  time?: string;
  heure?: string;
  numberOfPeople?: number;
  nombrePersonnes?: number;
  status: string;

  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };

  table?: {
    number: number;
    capacity: number;
  };
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: string;
  position?: "CUISINIER" | "CAISSIER" | null;
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  available: boolean;
  price: string | number;
  image?: string;

  category?: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

function AdminDashboard() {
  const [activeTab, setActiveTab] =
    useState<AdminTab>("dashboard");

  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] =
    useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  /* =========================
     EMPLOYEE FORM
  ========================= */

  const [showEmployeeForm, setShowEmployeeForm] =
    useState(false);

  const [employeeLoading, setEmployeeLoading] =
    useState(false);

  const [employeeError, setEmployeeError] =
    useState("");

  const [employeeSuccess, setEmployeeSuccess] =
    useState("");

  const [employeeForm, setEmployeeForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    position: "CUISINIER" as
      | "CUISINIER"
      | "CAISSIER",
  });

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          ordersData,
          reservationsData,
          usersData,
          productsData,
          categoriesData,
        ] = await Promise.all([
          getAllOrders(),
          getAllReservations(),
          getAllUsers(),
          getProducts(),
          getCategories(),
        ]);

        setOrders(ordersData || []);
        setReservations(reservationsData || []);
        setUsers(usersData || []);
        setProducts(productsData || []);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error(
          "Error loading dashboard:",
          err
        );

        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* =========================
     AVAILABLE YEARS
  ========================= */

  const availableYears = useMemo(() => {
    const years = new Set<number>();

    orders.forEach((order) => {
      const year = new Date(
        order.orderDate
      ).getFullYear();

      if (!Number.isNaN(year)) {
        years.add(year);
      }
    });

    reservations.forEach((reservation) => {
      const year = new Date(
        reservation.date
      ).getFullYear();

      if (!Number.isNaN(year)) {
        years.add(year);
      }
    });

    years.add(new Date().getFullYear());

    return Array.from(years).sort(
      (a, b) => b - a
    );
  }, [orders, reservations]);

  /* =========================
     YEAR DATA
  ========================= */

  const yearOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        new Date(order.orderDate).getFullYear() ===
        selectedYear
    );
  }, [orders, selectedYear]);

  const yearReservations = useMemo(() => {
    return reservations.filter(
      (reservation) =>
        new Date(reservation.date).getFullYear() ===
        selectedYear
    );
  }, [reservations, selectedYear]);

  /* =========================
     ORDER STATS
  ========================= */

  const completedOrders = useMemo(() => {
    return yearOrders.filter(
      (order) => order.status === "COMPLETED"
    );
  }, [yearOrders]);

  const cancelledOrders = useMemo(() => {
    return yearOrders.filter(
      (order) => order.status === "CANCELLED"
    );
  }, [yearOrders]);

  const annualRevenue = useMemo(() => {
    return completedOrders.reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    );
  }, [completedOrders]);

  const averageOrder = useMemo(() => {
    if (completedOrders.length === 0) {
      return 0;
    }

    return (
      annualRevenue / completedOrders.length
    );
  }, [annualRevenue, completedOrders]);

  /* =========================
     MONTHLY STATS
  ========================= */

  const monthlyStats = useMemo(() => {
    return Array.from(
      { length: 12 },
      (_, month) => {
        const monthOrders = yearOrders.filter(
          (order) => {
            const date = new Date(
              order.orderDate
            );

            return date.getMonth() === month;
          }
        );

        const monthCompleted =
          monthOrders.filter(
            (order) =>
              order.status === "COMPLETED"
          );

        const revenue =
          monthCompleted.reduce(
            (sum, order) =>
              sum + Number(order.total || 0),
            0
          );

        const monthReservations =
          yearReservations.filter(
            (reservation) => {
              const date = new Date(
                reservation.date
              );

              return date.getMonth() === month;
            }
          );

        return {
          month,
          name: new Date(
            selectedYear,
            month,
            1
          ).toLocaleDateString("en-US", {
            month: "short",
          }),
          orders: monthOrders.length,
          completedOrders:
            monthCompleted.length,
          revenue,
          reservations:
            monthReservations.length,
        };
      }
    );
  }, [
    yearOrders,
    yearReservations,
    selectedYear,
  ]);

  const bestMonth = useMemo(() => {
    if (monthlyStats.length === 0) {
      return null;
    }

    return monthlyStats.reduce(
      (best, current) =>
        current.revenue > best.revenue
          ? current
          : best
    );
  }, [monthlyStats]);

  /* =========================
     TOP PRODUCTS
  ========================= */

  const topProducts = useMemo(() => {
    const productMap = new Map<
      number,
      {
        id: number;
        name: string;
        quantity: number;
        revenue: number;
      }
    >();

    completedOrders.forEach((order) => {
      order.orderItems?.forEach((item) => {
        if (!item.product) {
          return;
        }

        const existing = productMap.get(
          item.product.id
        );

        const quantity = item.quantity;

        const revenue =
          quantity *
          Number(
            item.unitPrice ||
              item.product.price ||
              0
          );

        if (existing) {
          existing.quantity += quantity;
          existing.revenue += revenue;
        } else {
          productMap.set(
            item.product.id,
            {
              id: item.product.id,
              name: item.product.name,
              quantity,
              revenue,
            }
          );
        }
      });
    });

    return Array.from(
      productMap.values()
    )
      .sort(
        (a, b) =>
          b.quantity - a.quantity
      )
      .slice(0, 5);
  }, [completedOrders]);

  const maxMonthlyRevenue = useMemo(() => {
    return Math.max(
      ...monthlyStats.map(
        (month) => month.revenue
      ),
      1
    );
  }, [monthlyStats]);

  /* =========================
     EMPLOYEES
  ========================= */

  const employees = useMemo(() => {
    return users.filter(
      (user) => user.role === "EMPLOYEE"
    );
  }, [users]);

  /* =========================
     ORDER STATUS
  ========================= */

  const handleOrderStatusChange = async (
    orderId: number,
    status: string
  ) => {
    try {
      const updatedOrder =
        await updateOrderStatus(
          orderId,
          status
        );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                ...updatedOrder,
              }
            : order
        )
      );
    } catch (err) {
      console.error(
        "Error updating order status:",
        err
      );

      setError(
        "Unable to update the order status."
      );
    }
  };

  /* =========================
     ADD EMPLOYEE
  ========================= */

  const handleEmployeeFormChange = (
    field: string,
    value: string
  ) => {
    setEmployeeForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCreateEmployee = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setEmployeeLoading(true);
      setEmployeeError("");
      setEmployeeSuccess("");

      await createEmployee({
        firstName:
          employeeForm.firstName.trim(),

        lastName:
          employeeForm.lastName.trim(),

        email:
          employeeForm.email.trim(),

        phone:
          employeeForm.phone.trim(),

        password:
          employeeForm.password,

        position:
          employeeForm.position,
      });

      setEmployeeSuccess(
        "Employee added successfully."
      );

      setEmployeeForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        position: "CUISINIER",
      });

      // Refresh users
      const updatedUsers =
        await getAllUsers();

      setUsers(updatedUsers || []);

      // Close the form after success
      setTimeout(() => {
        setShowEmployeeForm(false);
        setEmployeeSuccess("");
      }, 1200);
    } catch (err: any) {
      console.error(
        "Error creating employee:",
        err
      );

      const message =
        err?.response?.data?.message;

      if (
        Array.isArray(message)
      ) {
        setEmployeeError(
          message.join(", ")
        );
      } else {
        setEmployeeError(
          message ||
            "Unable to add the employee."
        );
      }
    } finally {
      setEmployeeLoading(false);
    }
  };

  const handleOpenEmployeeForm = () => {
    setEmployeeError("");
    setEmployeeSuccess("");

    setEmployeeForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      position: "CUISINIER",
    });

    setShowEmployeeForm(true);
  };

  const handleCloseEmployeeForm = () => {
    if (employeeLoading) {
      return;
    }

    setShowEmployeeForm(false);
    setEmployeeError("");
    setEmployeeSuccess("");
  };

  /* =========================
     FORMATTERS
  ========================= */

  const formatMoney = (
    value: number | string
  ) => {
    return `${Number(value || 0).toFixed(
      2
    )} DH`;
  };

  const formatDate = (
    value: string
  ) => {
    if (!value) {
      return "-";
    }

    return new Date(
      value
    ).toLocaleDateString("en-US");
  };

  const getReservationTime = (
    reservation: Reservation
  ) => {
    return (
      reservation.time ||
      reservation.heure ||
      "-"
    );
  };

  const getReservationPeople = (
    reservation: Reservation
  ) => {
    return (
      reservation.numberOfPeople ??
      reservation.nombrePersonnes ??
      0
    );
  };

  const getStatusLabel = (
    status: string
  ) => {
    const labels: Record<
      string,
      string
    > = {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      PREPARING: "Preparing",
      READY: "Ready",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
    };

    return labels[status] || status;
  };

  const getEmployeePositionLabel = (
    position:
      | "CUISINIER"
      | "CAISSIER"
      | null
      | undefined
  ) => {
    if (position === "CUISINIER") {
      return "Cook";
    }

    if (position === "CAISSIER") {
      return "Cashier";
    }

    return "-";
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <AdminLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <div className="dashboard-loading">
          Loading dashboard...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* =========================
          HEADER
      ========================= */}

      <div className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">
            TUCOPILI CAFÉ
          </span>

          <h1>
            {activeTab === "dashboard" &&
              "Overview"}

            {activeTab === "orders" &&
              "Orders"}

            {activeTab ===
              "reservations" &&
              "Reservations"}

            {activeTab === "products" &&
              "Products"}

            {activeTab === "categories" &&
              "Categories"}

            {activeTab === "users" &&
              "Users"}

            {activeTab === "employees" &&
              "Employees"}
          </h1>

          <p>
            Manage and monitor your
            business activity.
          </p>
        </div>

        {activeTab === "dashboard" && (
          <div className="dashboard-filters">
            <label htmlFor="year">
              Year
            </label>

            <select
              id="year"
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(
                  Number(e.target.value)
                )
              }
            >
              {availableYears.map(
                (year) => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                )
              )}
            </select>
          </div>
        )}
      </div>

      {/* =========================
          GLOBAL ERROR
      ========================= */}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* =========================
          DASHBOARD
      ========================= */}

      {activeTab === "dashboard" && (
        <>
          <section className="dashboard-stats">
            <article className="stat-card">
              <span>
                Revenue
              </span>

              <strong>
                {formatMoney(
                  annualRevenue
                )}
              </strong>

              <small>
                Year {selectedYear}
              </small>
            </article>

            <article className="stat-card">
              <span>
                Orders
              </span>

              <strong>
                {yearOrders.length}
              </strong>

              <small>
                {completedOrders.length}{" "}
                completed
              </small>
            </article>

            <article className="stat-card">
              <span>
                Average Order
              </span>

              <strong>
                {formatMoney(
                  averageOrder
                )}
              </strong>

              <small>
                Completed orders
              </small>
            </article>

            <article className="stat-card">
              <span>
                Reservations
              </span>

              <strong>
                {yearReservations.length}
              </strong>

              <small>
                Year {selectedYear}
              </small>
            </article>
          </section>

          {/* MONTHLY */}
          <section className="dashboard-monthly">
            <div className="dashboard-section-header">
              <div>
                <span className="dashboard-eyebrow">
                  ANALYTICS
                </span>

                <h2>
                  Monthly Activity
                </h2>
              </div>

              {bestMonth && (
                <div className="monthly-highlight">
                  Best month:{" "}
                  <strong>
                    {bestMonth.name}
                  </strong>
                </div>
              )}
            </div>

            <div className="monthly-grid">
              {monthlyStats.map(
                (month) => (
                  <div
                    className="monthly-card"
                    key={month.month}
                  >
                    <div className="monthly-card-top">
                      <span>
                        {month.name}
                      </span>

                      <strong>
                        {formatMoney(
                          month.revenue
                        )}
                      </strong>
                    </div>

                    <div className="monthly-card-info">
                      <span>
                        {month.orders} orders
                      </span>

                      <span>
                        {month.reservations}{" "}
                        reservations
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          {/* REVENUE + TOP PRODUCTS */}
          <section className="dashboard-bottom">
            <div className="dashboard-chart">
              <div className="dashboard-section-header">
                <div>
                  <span className="dashboard-eyebrow">
                    REVENUE
                  </span>

                  <h2>
                    Revenue Evolution
                  </h2>
                </div>
              </div>

              <div className="bar-chart">
                {monthlyStats.map(
                  (month) => {
                    const height =
                      (month.revenue /
                        maxMonthlyRevenue) *
                      100;

                    return (
                      <div
                        className="bar-chart-column"
                        key={month.month}
                      >
                        <div className="bar-chart-value">
                          {month.revenue >
                          0
                            ? `${Math.round(
                                month.revenue
                              )} DH`
                            : ""}
                        </div>

                        <div className="bar-chart-track">
                          <div
                            className="bar-chart-bar"
                            style={{
                              height: `${Math.max(
                                height,
                                month.revenue >
                                  0
                                  ? 5
                                  : 0
                              )}%`,
                            }}
                          />
                        </div>

                        <span>
                          {month.name}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            <div className="dashboard-top-products">
              <div className="dashboard-section-header">
                <div>
                  <span className="dashboard-eyebrow">
                    PRODUCTS
                  </span>

                  <h2>
                    Best Sellers
                  </h2>
                </div>
              </div>

              {topProducts.length ===
              0 ? (
                <p className="dashboard-empty">
                  No completed sales for
                  this year.
                </p>
              ) : (
                <div className="top-products-list">
                  {topProducts.map(
                    (
                      product,
                      index
                    ) => (
                      <div
                        className="top-product-item"
                        key={
                          product.id
                        }
                      >
                        <span className="top-product-rank">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <div>
                          <strong>
                            {
                              product.name
                            }
                          </strong>

                          <small>
                            {
                              product.quantity
                            }{" "}
                            sold
                          </small>
                        </div>

                        <span>
                          {formatMoney(
                            product.revenue
                          )}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </section>

          {/* SUMMARY */}
          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <div>
                <span className="dashboard-eyebrow">
                  SUMMARY
                </span>

                <h2>
                  Business Activity
                </h2>
              </div>
            </div>

            <div className="dashboard-summary-grid">
              <div>
                <span>
                  Cancelled Orders
                </span>

                <strong>
                  {
                    cancelledOrders.length
                  }
                </strong>
              </div>

              <div>
                <span>
                  Available Products
                </span>

                <strong>
                  {
                    products.filter(
                      (product) =>
                        product.available
                    ).length
                  }
                </strong>
              </div>

              <div>
                <span>
                  Categories
                </span>

                <strong>
                  {
                    categories.length
                  }
                </strong>
              </div>

              <div>
                <span>
                  Users
                </span>

                <strong>
                  {users.length}
                </strong>
              </div>
            </div>
          </section>
        </>
      )}

      {/* =========================
          ORDERS
      ========================= */}

      {activeTab === "orders" && (
        <section className="dashboard-table-section">
          <div className="dashboard-section-header">
            <div>
              <span className="dashboard-eyebrow">
                MANAGEMENT
              </span>

              <h2>
                All Orders
              </h2>
            </div>

            <span>
              {orders.length}{" "}
              {orders.length === 1
                ? "order"
                : "orders"}
            </span>
          </div>

          {orders.length === 0 ? (
            <p className="dashboard-empty">
              No orders found.
            </p>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map(
                    (order) => (
                      <tr
                        key={order.id}
                      >
                        <td>
                          #{order.id}
                        </td>

                        <td>
                          {order.user
                            ? `${order.user.firstName} ${order.user.lastName}`
                            : "Customer"}
                        </td>

                        <td>
                          {formatDate(
                            order.orderDate
                          )}
                        </td>

                        <td>
                          {formatMoney(
                            order.total
                          )}
                        </td>

                        <td>
                          <select
                            className="admin-status-select"
                            value={
                              order.status
                            }
                            onChange={(
                              e
                            ) =>
                              handleOrderStatusChange(
                                order.id,
                                e.target
                                  .value
                              )
                            }
                          >
                            {ORDER_STATUSES.map(
                              (
                                status
                              ) => (
                                <option
                                  key={
                                    status
                                  }
                                  value={
                                    status
                                  }
                                >
                                  {getStatusLabel(
                                    status
                                  )}
                                </option>
                              )
                            )}
                          </select>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* =========================
          RESERVATIONS
      ========================= */}

      {activeTab ===
        "reservations" && (
        <section className="dashboard-table-section">
          <div className="dashboard-section-header">
            <div>
              <span className="dashboard-eyebrow">
                MANAGEMENT
              </span>

              <h2>
                Reservations
              </h2>
            </div>

            <span>
              {reservations.length}{" "}
              {reservations.length ===
              1
                ? "reservation"
                : "reservations"}
            </span>
          </div>

          {reservations.length ===
          0 ? (
            <p className="dashboard-empty">
              No reservations found.
            </p>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>People</th>
                    <th>Table</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {reservations.map(
                    (
                      reservation
                    ) => (
                      <tr
                        key={
                          reservation.id
                        }
                      >
                        <td>
                          #
                          {
                            reservation.id
                          }
                        </td>

                        <td>
                          {reservation.user
                            ? `${reservation.user.firstName} ${reservation.user.lastName}`
                            : "-"}
                        </td>

                        <td>
                          {formatDate(
                            reservation.date
                          )}
                        </td>

                        <td>
                          {getReservationTime(
                            reservation
                          )}
                        </td>

                        <td>
                          {getReservationPeople(
                            reservation
                          )}
                        </td>

                        <td>
                          {reservation.table
                            ? `Table ${reservation.table.number}`
                            : "-"}
                        </td>

                        <td>
                          <span
                            className={`status-badge status-${reservation.status.toLowerCase()}`}
                          >
                            {getStatusLabel(
                              reservation.status
                            )}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* =========================
          PRODUCTS
      ========================= */}

      {activeTab === "products" && (
        <section className="dashboard-table-section">
          <div className="dashboard-section-header">
            <div>
              <span className="dashboard-eyebrow">
                CATALOG
              </span>

              <h2>
                Products
              </h2>
            </div>

            <span>
              {products.length}{" "}
              {products.length === 1
                ? "product"
                : "products"}
            </span>
          </div>

          {products.length === 0 ? (
            <p className="dashboard-empty">
              No products found.
            </p>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Availability</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map(
                    (product) => (
                      <tr
                        key={
                          product.id
                        }
                      >
                        <td>
                          <strong>
                            {
                              product.name
                            }
                          </strong>
                        </td>

                        <td>
                          {product
                            .category
                            ?.name ||
                            "-"}
                        </td>

                        <td>
                          {formatMoney(
                            product.price
                          )}
                        </td>

                        <td>
                          <span
                            className={`status-badge ${
                              product.available
                                ? "status-confirmed"
                                : "status-cancelled"
                            }`}
                          >
                            {product.available
                              ? "Available"
                              : "Unavailable"}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* =========================
          CATEGORIES
      ========================= */}

      {activeTab ===
        "categories" && (
        <section className="dashboard-table-section">
          <div className="dashboard-section-header">
            <div>
              <span className="dashboard-eyebrow">
                CATALOG
              </span>

              <h2>
                Categories
              </h2>
            </div>

            <span>
              {categories.length}{" "}
              {categories.length ===
              1
                ? "category"
                : "categories"}
            </span>
          </div>

          {categories.length ===
          0 ? (
            <p className="dashboard-empty">
              No categories found.
            </p>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map(
                    (category) => (
                      <tr
                        key={
                          category.id
                        }
                      >
                        <td>
                          #
                          {
                            category.id
                          }
                        </td>

                        <td>
                          <strong>
                            {
                              category.name
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            category.description ||
                            "—"
                          }
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* =========================
          USERS
      ========================= */}

      {activeTab === "users" && (
        <section className="dashboard-table-section">
          <div className="dashboard-section-header">
            <div>
              <span className="dashboard-eyebrow">
                USERS
              </span>

              <h2>
                Users
              </h2>
            </div>

            <span>
              {users.length}{" "}
              {users.length === 1
                ? "user"
                : "users"}
            </span>
          </div>

          {users.length === 0 ? (
            <p className="dashboard-empty">
              No users found.
            </p>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Registration</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map(
                    (user) => (
                      <tr
                        key={
                          user.id
                        }
                      >
                        <td>
                          <strong>
                            {
                              user.firstName
                            }{" "}
                            {
                              user.lastName
                            }
                          </strong>
                        </td>

                        <td>
                          {user.email}
                        </td>

                        <td>
                          {user.phone ||
                            "—"}
                        </td>

                        <td>
                          <span className="status-badge status-confirmed">
                            {
                              user.role
                            }
                          </span>
                        </td>

                        <td>
                          {formatDate(
                            user.createdAt
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* =========================
          EMPLOYEES
      ========================= */}

      {activeTab ===
        "employees" && (
        <section className="dashboard-table-section">
          <div className="dashboard-section-header">
            <div>
              <span className="dashboard-eyebrow">
                STAFF MANAGEMENT
              </span>

              <h2>
                Employees
              </h2>

              <p>
                Manage your café employees.
              </p>
            </div>

            <button
              type="button"
              className="admin-button"
              onClick={
                handleOpenEmployeeForm
              }
            >
              + Add Employee
            </button>
          </div>

          {employees.length === 0 ? (
            <p className="dashboard-empty">
              No employees found.
            </p>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Position</th>
                    <th>Registration</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map(
                    (employee) => (
                      <tr
                        key={
                          employee.id
                        }
                      >
                        <td>
                          <strong>
                            {
                              employee.firstName
                            }{" "}
                            {
                              employee.lastName
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            employee.email
                          }
                        </td>

                        <td>
                          {employee.phone ||
                            "—"}
                        </td>

                        <td>
                          <span className="status-badge status-confirmed">
                            {getEmployeePositionLabel(
                              employee.position
                            )}
                          </span>
                        </td>

                        <td>
                          {formatDate(
                            employee.createdAt
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* =========================
          ADD EMPLOYEE MODAL
      ========================= */}

      {showEmployeeForm && (
        <div
          className="admin-modal-overlay"
          onClick={
            handleCloseEmployeeForm
          }
        >
          <div
            className="admin-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="admin-modal-header">
              <div>
                <span className="dashboard-eyebrow">
                  STAFF
                </span>

                <h2>
                  Add Employee
                </h2>

                <p>
                  Create a new employee
                  account.
                </p>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={
                  handleCloseEmployeeForm
                }
                disabled={
                  employeeLoading
                }
              >
                ×
              </button>
            </div>

            {employeeError && (
              <div className="admin-error">
                {employeeError}
              </div>
            )}

            {employeeSuccess && (
              <div className="admin-success">
                {employeeSuccess}
              </div>
            )}

            <form
              className="employee-form"
              onSubmit={
                handleCreateEmployee
              }
            >
              <div className="employee-form-grid">
                <div className="employee-form-group">
                  <label htmlFor="employee-first-name">
                    First Name
                  </label>

                  <input
                    id="employee-first-name"
                    type="text"
                    value={
                      employeeForm.firstName
                    }
                    onChange={(e) =>
                      handleEmployeeFormChange(
                        "firstName",
                        e.target.value
                      )
                    }
                    required
                    disabled={
                      employeeLoading
                    }
                  />
                </div>

                <div className="employee-form-group">
                  <label htmlFor="employee-last-name">
                    Last Name
                  </label>

                  <input
                    id="employee-last-name"
                    type="text"
                    value={
                      employeeForm.lastName
                    }
                    onChange={(e) =>
                      handleEmployeeFormChange(
                        "lastName",
                        e.target.value
                      )
                    }
                    required
                    disabled={
                      employeeLoading
                    }
                  />
                </div>

                <div className="employee-form-group">
                  <label htmlFor="employee-email">
                    Email
                  </label>

                  <input
                    id="employee-email"
                    type="email"
                    value={
                      employeeForm.email
                    }
                    onChange={(e) =>
                      handleEmployeeFormChange(
                        "email",
                        e.target.value
                      )
                    }
                    required
                    disabled={
                      employeeLoading
                    }
                  />
                </div>

                <div className="employee-form-group">
                  <label htmlFor="employee-phone">
                    Phone
                  </label>

                  <input
                    id="employee-phone"
                    type="tel"
                    value={
                      employeeForm.phone
                    }
                    onChange={(e) =>
                      handleEmployeeFormChange(
                        "phone",
                        e.target.value
                      )
                    }
                    disabled={
                      employeeLoading
                    }
                  />
                </div>

                <div className="employee-form-group">
                  <label htmlFor="employee-password">
                    Password
                  </label>

                  <input
                    id="employee-password"
                    type="password"
                    value={
                      employeeForm.password
                    }
                    onChange={(e) =>
                      handleEmployeeFormChange(
                        "password",
                        e.target.value
                      )
                    }
                    minLength={6}
                    required
                    disabled={
                      employeeLoading
                    }
                  />
                </div>

                <div className="employee-form-group">
                  <label htmlFor="employee-position">
                    Position
                  </label>

                  <select
                    id="employee-position"
                    value={
                      employeeForm.position
                    }
                    onChange={(e) =>
                      handleEmployeeFormChange(
                        "position",
                        e.target.value
                      )
                    }
                    required
                    disabled={
                      employeeLoading
                    }
                  >
                    <option value="CUISINIER">
                      Cook
                    </option>

                    <option value="CAISSIER">
                      Cashier
                    </option>
                  </select>
                </div>
              </div>

              <div className="employee-form-actions">
                <button
                  type="button"
                  className="admin-button admin-button-secondary"
                  onClick={
                    handleCloseEmployeeForm
                  }
                  disabled={
                    employeeLoading
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-button"
                  disabled={
                    employeeLoading
                  }
                >
                  {employeeLoading
                    ? "Adding..."
                    : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;

