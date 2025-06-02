// src/pages/admin/AdminOrders.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1) Fetch all orders on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // 2) Handle status change
  const handleStatusChange = (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data : o))
        );
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to change status.");
      });
  };

  // 3) Handle payment status change
  const handlePaymentChange = (orderId, newPayment) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `/orders/${orderId}`,
        { paymentStatus: newPayment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data : o))
        );
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to change payment status.");
      });
  };

  // 4) Delete order
  const handleDelete = (orderId) => {
    if (!window.confirm("Delete this order?")) return;
    const token = localStorage.getItem("token");
    axios
      .delete(`/orders/${orderId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to delete order.");
      });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-dark" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Manage Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((o) => (
          <div
            key={o._id}
            className="mb-5 p-4 border rounded"
            style={{ backgroundColor: "#f9f9f9" }}
          >
            {/* Header: Order Date & User */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <small className="text-muted">
                  {new Date(o.createdAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
                <p className="mb-0">
                  <strong>User: </strong> {o.user.name} ({o.user.email})
                </p>
              </div>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDelete(o._id)}
              >
                Delete Order
              </button>
            </div>

            {/* Items Table */}
            <div className="table-responsive mb-3">
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {o.items.map((it, idx) => (
                    <tr key={idx}>
                      <td>{it.name}</td>
                      <td>{it.quantity}</td>
                      <td>${it.price.toFixed(2)}</td>
                      <td>${it.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer: Total, Status, Payment Status */}
            <div className="d-flex justify-content-between align-items-center">
              <h5>Total: ${o.totalPrice.toFixed(2)}</h5>

              <div className="d-flex align-items-center">
                <div className="me-3">
                  <label className="form-label me-1">Status:</label>
                  <select
                    className="form-select form-select-sm d-inline-block"
                    style={{ width: "160px" }}
                    value={o.status}
                    onChange={(e) =>
                      handleStatusChange(o._id, e.target.value)
                    }
                  >
                    {["Pending", "Processing", "Out for Delivery", "Delivered", "Cancelled"].map(
                      (st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="form-label me-1">Payment:</label>
                  <select
                    className="form-select form-select-sm d-inline-block"
                    style={{ width: "140px" }}
                    value={o.paymentStatus}
                    onChange={(e) =>
                      handlePaymentChange(o._id, e.target.value)
                    }
                  >
                    {["Pending", "Paid", "Failed", "Refunded"].map((pst) => (
                      <option key={pst} value={pst}>
                        {pst}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
