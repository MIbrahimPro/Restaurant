// src/pages/admin/AdminUsers.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1) Fetch all users on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/users", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // 2) Handle role change
  const handleRoleChange = (userId, newRole) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `/users/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? res.data : u))
        );
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to change role.");
      });
  };

  // 3) Delete user
  const handleDelete = (userId) => {
    if (!window.confirm("Delete this user?")) return;
    const token = localStorage.getItem("token");
    axios
      .delete(`/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to delete user.");
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
      <h2 className="mb-4">Manage Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th style={{ width: "150px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    disabled={u._id === "your‐own‐user‐id‐here"} 
                    // (optional) disable changing role on yourself
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(u._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
