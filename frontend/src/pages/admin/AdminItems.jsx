// src/pages/admin/AdminItems.jsx

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const AdminItems = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editing, setEditing] = useState(null); // ID of item being edited

  const fileInputRef = useRef();

  // 1) Fetch categories & items
  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      axios.get("/categories", { headers: { Authorization: `Bearer ${token}` } }),
      axios.get("/items", { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(([cRes, iRes]) => {
        setCategories(cRes.data);
        setItems(iRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // 2) Handle text input change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 3) Handle file change
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // 4) Reset form
  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", category: "" });
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setEditing(null);
  };

  // 5) Submit Add or Edit
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Basic validation
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.category ||
      (!imageFile && !editing)
    ) {
      alert(
        "All fields are required. When adding, an image is required; when editing, image is optional."
      );
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      alert("Enter a valid non-negative price.");
      return;
    }

    // Build FormData
    const data = new FormData();
    data.append("name", formData.name.trim());
    data.append("description", formData.description.trim());
    data.append("price", priceNum);
    data.append("category", formData.category);
    if (imageFile) data.append("img", imageFile);

    if (editing) {
      // PUT /items/:id
      axios
        .put(`/items/${editing}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setItems((prev) => prev.map((it) => (it._id === editing ? res.data : it)));
          resetForm();
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to update item.");
        });
    } else {
      // POST /items
      axios
        .post("/items", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setItems((prev) => [...prev, res.data]);
          resetForm();
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to add item.");
        });
    }
  };

  // 6) Edit click
  const handleEditClick = (it) => {
    setEditing(it._id);
    setFormData({
      name: it.name,
      description: it.description,
      price: it.price.toString(),
      category: it.category._id, // assuming populated
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setImageFile(null);
  };

  // 7) Delete click
  const handleDelete = (id) => {
    if (!window.confirm("Delete this item?")) return;
    const token = localStorage.getItem("token");
    axios
      .delete(`/items/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setItems((prev) => prev.filter((it) => it._id !== id));
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to delete item.");
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
      <h2 className="mb-4">Manage Items</h2>

      {/* ───── Form to Add / Edit ───── */}
      <form className="mb-5" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Price</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-8">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="col-md-4">
            <label className="form-label">Image {editing ? "(optional)" : ""}</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-success">
              {editing ? "Update Item" : "Add Item"}
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
        </div>
      </form>

      {/* ───── List of Items ───── */}
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Description</th>
              <th style={{ width: "150px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it._id}>
                <td>
                  <img
                    src={"/" + it.img}
                    alt={it.name}
                    style={{ width: "64px", height: "64px", objectFit: "cover" }}
                  />
                </td>
                <td>{it.name}</td>
                <td>{it.category.name}</td>
                <td>${it.price.toFixed(2)}</td>
                <td>{it.description.substring(0, 40)}…</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEditClick(it)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(it._id)}
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

export default AdminItems;
