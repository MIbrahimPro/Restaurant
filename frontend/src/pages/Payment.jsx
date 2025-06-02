// src/pages/PaymentPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const PaymentPage = () => {
    const navigate = useNavigate();
    const {
        cartItems,
        totalPrice,
        shippingAddress,
        paymentMethod,
        setPaymentMethod,
        clearCart,
    } = useCart();

    const [placingOrder, setPlacingOrder] = useState(false);

    if (!shippingAddress) {
        navigate("/checkout/address");
        return null;
    }

    const submitOrder = () => {

        setPlacingOrder(true);
        const token = localStorage.getItem("token");

        const orderItems = cartItems.map((ci) => ({
            item: ci.id,
            quantity: ci.quantity,
        }));

        console.log(orderItems);
        console.log(shippingAddress);
        console.log(paymentMethod);
        axios
            .post(
                "/orders",
                {
                    items: orderItems,
                    shippingAddress: {
                        title: shippingAddress.title,
                        address: shippingAddress.address,
                    },
                    paymentMethod,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                setPlacingOrder(false);
                clearCart();
                alert("Order placed successfully!");
                navigate("/");
            })
            .catch((err) => {
                console.error(err);
                setPlacingOrder(false);
                alert("Failed to place order.");
            });
    };

    return (
        <section className="py-5">
            <div className="container">
                <h2 className="text-center font-heading mb-4">Payment</h2>

                {/* Shipping Address Summary */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Shipping Address</h5>
                        <p className="mb-1">
                            <strong>{shippingAddress.title}</strong>
                        </p>
                        <p>{shippingAddress.address}</p>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => navigate("/checkout/address")}
                        >
                            Change Address
                        </button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Order Summary</h5>
                        {cartItems.map((ci) => (
                            <div
                                key={ci.id}
                                className="d-flex justify-content-between align-items-center mb-2"
                            >
                                <span>
                                    {ci.name} x {ci.quantity}
                                </span>
                                <span>${(ci.price * ci.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <hr />
                        <div className="d-flex justify-content-between">
                            <strong>Total</strong>
                            <strong>${totalPrice.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Select Payment Method</h5>
                        <div className="mb-3">
                            {["Cash on Delivery", "Credit Card", "Debit Card", "Online Payment"].map(
                                (m) => (
                                    <div key={m} className="form-check mb-2">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="payment"
                                            id={`pay-${m}`}
                                            value={m}
                                            checked={paymentMethod === m}
                                            onChange={() => setPaymentMethod(m)}
                                        />
                                        <label className="form-check-label" htmlFor={`pay-${m}`}>
                                            {m}
                                        </label>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Place Order Button */}
                <div className="d-flex justify-content-end">
                    <button
                        className="btn btn-success"
                        onClick={submitOrder}
                        disabled={placingOrder}
                    >
                        {placingOrder ? "Placing Order..." : `Pay $${totalPrice.toFixed(2)}`}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default PaymentPage;
