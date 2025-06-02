// src/pages/admin/AdminCategories.jsx

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "" });
  const [iconFile, setIconFile] = useState(null);
  const [editing, setEditing] = useState(null); // category ID being edited
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef();

  // 1) Fetch categories (with itemsCount) on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/categories", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // 2) Handle text input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3) Handle file input change
  const handleFileChange = (e) => {
    setIconFile(e.target.files[0]);
  };

  // 4) Reset form
  const resetForm = () => {
    setFormData({ name: "" });
    setIconFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setEditing(null);
  };

  // 5) Submit Add or Update
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!formData.name.trim() || (!iconFile && !editing)) {
      // For Add: both name+icon required. For Edit: name required, icon optional.
      alert("Category name is required. Icon is required when adding.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name.trim());
    if (iconFile) data.append("icon", iconFile);

    if (editing) {
      // Update existing
      axios
        .put(`/categories/${editing}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setCategories((prev) =>
            prev.map((c) => (c._id === editing ? res.data : c))
          );
          resetForm();
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to update category.");
        });
    } else {
      // Add new
      axios
        .post("/categories", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // The new category object does NOT include itemsCount; set it to 0
          const newCat = { ...res.data, itemsCount: 0 };
          setCategories((prev) => [...prev, newCat]);
          resetForm();
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to add category.");
        });
    }
  };

  // 6) Edit button: populate form
  const handleEditClick = (cat) => {
    setEditing(cat._id);
    setFormData({ name: cat.name });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIconFile(null);
  };

  // 7) Delete category (only if itemsCount === 0)
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    const token = localStorage.getItem("token");
    axios
      .delete(`/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      })
      .catch((err) => {
        console.error(err);
        alert(
          err.response?.data?.message ||
            "Failed to delete category (maybe it has items)."
        );
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
      <h2 className="mb-4">Manage Categories</h2>

      {/* ─────────────────────── Form to Add / Edit ───────────────────────────── */}
      <form className="row g-2 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Category Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <small className="text-muted">
            {editing
              ? "Choose a new icon only if you want to replace existing."
              : "Icon is required (image file)."}
          </small>
        </div>
        <div className="col-md-4">
          <button type="submit" className="btn btn-success">
            {editing ? "Update Category" : "Add Category"}
          </button>
          {editing && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ─────────────────────── List of Categories ────────────────────────────── */}
      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Items Count</th>
              <th style={{ width: "150px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td>
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    style={{ width: "32px", height: "32px", objectFit: "cover" }}
                  />
                </td>
                <td>{cat.name}</td>
                <td>
                  <span
                    className={`badge ${
                      cat.itemsCount === 0 ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {cat.itemsCount}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEditClick(cat)}
                  >
                    Edit
                  </button>
                  {cat.itemsCount === 0 ? (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(cat._id)}
                    >
                      Delete
                    </button>
                  ) : (
                    <button className="btn btn-sm btn-outline-secondary" disabled>
                      Cannot Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCategories;
