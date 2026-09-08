import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Reservation from "./pages/Reservation";
import OrderConfirmation from "./pages/OrderConfirmation";
import Reviews from "./pages/Reviews";
import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";
import TrackOrderLookup from "./pages/TrackOrderLookup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app">
            <Navbar />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/track-order" element={<TrackOrderLookup />} />
              <Route path="/track-order/:id" element={<TrackOrder />} />
              <Route path="/order-confirmed" element={<OrderConfirmation />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/login" element={<Login />} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminOrders />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;