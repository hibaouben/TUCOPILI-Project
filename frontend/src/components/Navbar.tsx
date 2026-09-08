import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo.png";

function Navbar() {
  const {
    itemCount,
    items,
    removeFromCart,
    updateQuantity,
    total,
  } = useCart();

  const [cartOpen, setCartOpen] =
    useState(false);

  return (
    <>
      <header className="navbar">

        <div className="logo">
          <Link to="/">
            <img
              src={logo}
              alt="Tucopili Café"
            />
          </Link>
        </div>

        <nav>
          <Link to="/menu">
            Menu
          </Link>

          <Link to="/reservation">
            Book a Table
          </Link>

          <Link to="/reviews">
            Reviews
          </Link>

          <Link to="/track-order">
            Track Order
          </Link>

          
        </nav>

        <button
          className="order-btn"
          onClick={() =>
            setCartOpen(true)
          }
        >
          Order Now

          {itemCount > 0 && (
            <span className="cart-badge">
              {itemCount}
            </span>
          )}
        </button>

      </header>

      {cartOpen && (
        <div
          className="cart-overlay"
          onClick={() =>
            setCartOpen(false)
          }
        >
          <aside
            className="cart-drawer"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="cart-header">

              <div>
                <p className="cart-small-title">
                  your selection
                </p>

                <h2>
                  Your Order
                </h2>
              </div>

              <button
                className="cart-close"
                onClick={() =>
                  setCartOpen(false)
                }
              >
                ×
              </button>

            </div>

            {items.length === 0 ? (
              <div className="empty-cart">

                <p>
                  Your cart is empty.
                </p>

                <Link
                  to="/menu"
                  onClick={() =>
                    setCartOpen(false)
                  }
                >
                  Discover our menu →
                </Link>

              </div>
            ) : (
              <>
                <div className="cart-items">

                  {items.map((item) => (
                    <div
                      className="cart-item"
                      key={item.id}
                    >

                      <div className="cart-item-image">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                          />
                        ) : (
                          <span>T</span>
                        )}
                      </div>

                      <div className="cart-item-info">

                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          {item.price} MAD
                        </p>

                        <div className="quantity-control">

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </button>

                        </div>

                      </div>

                      <div className="cart-item-right">

                        <span>
                          {(
                            parseFloat(
                              item.price
                            ) *
                            item.quantity
                          ).toFixed(2)}{" "}
                          MAD
                        </span>

                        <button
                          className="remove-item"
                          onClick={() =>
                            removeFromCart(
                              item.id
                            )
                          }
                        >
                          Remove
                        </button>

                      </div>

                    </div>
                  ))}

                </div>

                <div className="cart-summary">

                  <div className="summary-line">
                    <span>
                      Subtotal
                    </span>

                    <span>
                      {total.toFixed(2)} MAD
                    </span>
                  </div>

                  <div className="summary-line total-line">
                    <span>
                      Total
                    </span>

                    <span>
                      {total.toFixed(2)} MAD
                    </span>
                  </div>

                  <Link
                    to="/checkout"
                    className="checkout-btn"
                    onClick={() =>
                      setCartOpen(false)
                    }
                  >
                    Checkout
                  </Link>

                </div>
              </>
            )}

          </aside>
        </div>
      )}
    </>
  );
}

export default Navbar;