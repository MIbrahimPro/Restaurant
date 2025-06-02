// src/pages/Cart.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQty,
    removeFromCart,
    totalPrice,
  } = useCart();

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    navigate("/checkout/address");
  };

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center font-heading mb-4">Your Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-center">Your cart is empty.</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th style={{ width: "120px" }}>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((ci) => (
                    <tr key={ci.id}>
                      <td className="d-flex align-items-center">
                        <img
                          src={ci.img}
                          alt={ci.name}
                          className="me-3"
                          style={{
                            width: "64px",
                            height: "64px",
                            objectFit: "cover",
                            borderRadius: "0.5rem",
                          }}
                        />
                        <span>{ci.name}</span>
                      </td>
                      <td>${ci.price.toFixed(2)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => updateQty(ci.id, -1)}
                          >
                            –
                          </button>
                          <input
                            type="text"
                            className="form-control text-center mx-1"
                            value={ci.quantity}
                            readOnly
                            style={{ width: "40px" }}
                          />
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => updateQty(ci.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>${(ci.price * ci.quantity).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeFromCart(ci.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <h5>Total: ${totalPrice.toFixed(2)}</h5>
              <button
                className="btn"
                style={{ backgroundColor: "#ffbe33", color: "#222831" }}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Cart;
