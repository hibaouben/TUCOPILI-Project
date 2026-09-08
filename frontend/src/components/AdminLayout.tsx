import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export type AdminTab =
  | "dashboard"
  | "orders"
  | "reservations"
  | "products"
  | "categories"
  | "users"
  | "employees";

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const NAV_ITEMS: {
  key: AdminTab;
  label: string;
}[] = [
  {
    key: "dashboard",
    label: "Dashboard",
  },
  {
    key: "orders",
    label: "Orders",
  },
  {
    key: "reservations",
    label: "Reservations",
  },
  {
    key: "products",
    label: "Products",
  },
  {
    key: "categories",
    label: "Categories",
  },
  {
    key: "users",
    label: "Users",
  },
  {
    key: "employees",
    label: "Employees",
  },
];

function AdminLayout({
  children,
  activeTab,
  onTabChange,
}: AdminLayoutProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      {/* =========================================
          ADMIN NAVIGATION
          ========================================= */}

      <header className="admin-sidebar">
        {/* LOGO */}

        <div className="admin-sidebar-title">
          TUCOPILI
        </div>

        {/* NAVIGATION */}

        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`admin-nav-link ${
                activeTab === item.key
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                onTabChange(item.key)
              }
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* LOGOUT */}

        <button
          type="button"
          className="admin-sidebar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* =========================================
          CONTENT
          ========================================= */}

      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;

