// src/pages/admin/AdminGeneral.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminGeneral = () => {
  const [general, setGeneral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    contactPhone: "",
    contactEmail: "",
    contactAddress: "",
    Instagram: "",
    Facebook: "",
    Whatsaap: "",
  });

  // 1) Fetch the general document on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/general", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        // If array: take first one. Or if single object, use directly.
        const doc = Array.isArray(res.data) ? res.data[0] : res.data;
        setGeneral(doc);
        console.log(doc)
        setFormData({
          contactPhone: doc.contactPhone,
          contactEmail: doc.contactEmail,
          contactAddress: doc.contactAddress,
          Instagram: doc.Instagram,
          Facebook: doc.Facebook,
          Whatsaap: doc.Whatsaap,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // 2) Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 3) Submit update
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!general) return;
    axios
      .put(
        `/general`,
        {
          contactPhone: formData.contactPhone.trim(),
          contactEmail: formData.contactEmail.trim(),
          contactAddress: formData.contactAddress.trim(),
          Instagram: formData.Instagram.trim(),
          Facebook: formData.Facebook.trim(),
          Whatsaap: formData.Whatsaap.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setGeneral(res.data);
        alert("General info updated.");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update general info.");
      });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-dark" role="status"></div>
      </div>
    );
  }

  if (!general) {
    return <p className="text-center py-5">No general info found.</p>;
  }

  return (
    <div className="container py-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">General Info</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Contact Phone</label>
          <input
            type="text"
            className="form-control"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Email</label>
          <input
            type="email"
            className="form-control"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contact Address</label>
          <textarea
            className="form-control"
            name="contactAddress"
            rows="2"
            value={formData.contactAddress}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Instagram Link</label>
          <input
            type="text"
            className="form-control"
            name="Instagram"
            value={formData.Instagram}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Facebook Link</label>
          <input
            type="text"
            className="form-control"
            name="Facebook"
            value={formData.Facebook}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">WhatsApp Number/Link</label>
          <input
            type="text"
            className="form-control"
            name="Whatsaap"
            value={formData.Whatsaap}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success">
          Update General Info
        </button>
      </form>
    </div>
  );
};

export default AdminGeneral;
