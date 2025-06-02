// // src/pages/Profile.jsx

// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   BiPencil,
//   BiTrash,
//   BiKey,
//   BiPlus,
//   BiSave,
//   BiLogOut,
// } from "react-icons/bi";
// import { useCart } from "../context/CartContext";
// import AddressModal from "../components/AddressModal";

// const Profile = () => {
//   const navigate = useNavigate();
//   const { clearCart } = useCart();

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({ name: "", phone: "" });
//   const [addresses, setAddresses] = useState([]);
//   const [orders, setOrders] = useState([]);

//   // Address modal
//   const [addressModalMode, setAddressModalMode] = useState("add"); // "add" or "edit"
//   const [currentAddress, setCurrentAddress] = useState({
//     title: "",
//     address: "",
//     oldTitle: "",
//     oldAddress: "",
//   });
//   const addressModalRef = useRef();

//   // Change Password modal
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [passwordError, setPasswordError] = useState("");
//   const passwordModalRef = useRef();

//   // ────────────────────────────────────────────────────────────────────────────
//   // 1) Fetch user + orders on mount
//   // ────────────────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/signin");
//       return;
//     }

//     // 1. Fetch user and saved addresses
//     axios
//       .get("/users/me", { headers: { Authorization: `Bearer ${token}` } })
//       .then((res) => {
//         const u = res.data.user;
//         setUser(u);
//         setFormData({ name: u.name, phone: u.phone });
//         setAddresses(u.addresses || []);
//         setLoading(false);

//         // 2. Now fetch orders
//         return axios.get("/orders", { headers: { Authorization: `Bearer ${token}` } });
//       })
//       .then((res) => {
//         setOrders(res.data);
//       })
//       .catch((err) => {
//         console.error(err);
//         navigate("/signin");
//       });
//   }, [navigate]);

//   // ────────────────────────────────────────────────────────────────────────────
//   // 2) Open Address Modal
//   // ────────────────────────────────────────────────────────────────────────────
//   const openAddressModal = (mode, addr = { title: "", address: "" }) => {
//     setAddressModalMode(mode);
//     if (mode === "edit") {
//       setCurrentAddress({
//         oldTitle: addr.title,
//         oldAddress: addr.address,
//         title: addr.title,
//         address: addr.address,
//       });
//     } else {
//       setCurrentAddress({ oldTitle: "", oldAddress: "", title: "", address: "" });
//     }
//     addressModalRef.current.show();
//   };

//   const handleAddressInputChange = (e) => {
//     setCurrentAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const submitAddress = () => {
//     const { oldTitle, oldAddress, title, address } = currentAddress;
//     if (!title.trim() || !address.trim()) {
//       alert("Both title and address are required.");
//       return;
//     }
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/signin");
//       return;
//     }
//     if (addressModalMode === "add") {
//       axios
//         .post(
//           "/users/me/addresses",
//           { title: title.trim(), address: address.trim() },
//           { headers: { Authorization: `Bearer ${token}` } }
//         )
//         .then((res) => {
//           setAddresses(res.data);
//           addressModalRef.current.hide();
//         })
//         .catch((err) => {
//           console.error(err);
//           alert("Failed to add address.");
//         });
//     } else {
//       axios
//         .put(
//           "/users/me/addresses",
//           {
//             oldTitle,
//             oldAddress,
//             title: title.trim(),
//             address: address.trim(),
//           },
//           { headers: { Authorization: `Bearer ${token}` } }
//         )
//         .then((res) => {
//           setAddresses(res.data);
//           addressModalRef.current.hide();
//         })
//         .catch((err) => {
//           console.error(err);
//           alert("Failed to update address.");
//         });
//     }
//   };

//   const removeAddress = (addr) => {
//     const token = localStorage.getItem("token");
//     axios
//       .delete("/users/me/addresses", {
//         headers: { Authorization: `Bearer ${token}` },
//         data: { title: addr.title, address: addr.address },
//       })
//       .then((res) => {
//         setAddresses(res.data);
//       })
//       .catch((err) => {
//         console.error(err);
//         alert("Failed to remove address.");
//       });
//   };

//   // ────────────────────────────────────────────────────────────────────────────
//   // 3) Open Password Modal
//   // ────────────────────────────────────────────────────────────────────────────
//   const openPasswordModal = () => {
//     setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
//     setPasswordError("");
//     passwordModalRef.current.show();
//   };

//   const handlePasswordChange = (e) => {
//     setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const submitPasswordChange = () => {
//     const { currentPassword, newPassword, confirmPassword } = passwordData;
//     if (newPassword !== confirmPassword) {
//       setPasswordError("New passwords do not match.");
//       return;
//     }
//     if (newPassword.length < 6) {
//       setPasswordError("Password must be at least 6 characters.");
//       return;
//     }
//     const token = localStorage.getItem("token");
//     axios
//       .put(
//         "/users/me/change-password",
//         { currentPassword, newPassword },
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       .then(() => {
//         passwordModalRef.current.hide();
//         alert("Password changed successfully.");
//       })
//       .catch((err) => {
//         console.error(err);
//         setPasswordError(err.response?.data?.message || "Failed to change password.");
//       });
//   };

//   // ────────────────────────────────────────────────────────────────────────────
//   // 4) Edit Profile Details (name & phone only)
//   // ────────────────────────────────────────────────────────────────────────────
//   const handleEditToggle = () => {
//     if (editMode) {
//       const token = localStorage.getItem("token");
//       axios
//         .put(
//           "/users/me",
//           { name: formData.name.trim(), phone: formData.phone.trim() },
//           { headers: { Authorization: `Bearer ${token}` } }
//         )
//         .then((res) => {
//           setUser(res.data);
//           setEditMode(false);
//         })
//         .catch((err) => {
//           console.error(err);
//           alert("Failed to update details.");
//         });
//     } else {
//       setEditMode(true);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   // ────────────────────────────────────────────────────────────────────────────
//   // 5) Logout
//   // ────────────────────────────────────────────────────────────────────────────
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     clearCart();
//     navigate("/signin");
//   };

//   // ────────────────────────────────────────────────────────────────────────────
//   // 6) Render
//   // ────────────────────────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center py-5">
//         <div className="spinner-border text-dark" role="status"></div>
//       </div>
//     );
//   }

//   return (
//     <section className="py-5">
//       <div className="container">
//         <h2 className="text-center font-heading mb-4">My Profile</h2>
//         <div className="row g-4">
//           {/* ──────────────────────────────────────────────────────────────── */}
//           {/* Left: Account Details & Addresses */}
//           {/* ──────────────────────────────────────────────────────────────── */}
//           <div className="col-md-6">
//             <div className="card shadow-sm mb-4">
//               <div className="card-body">
//                 {/* Account Details */}
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <h5 className="card-title">Account Details</h5>
//                   <button
//                     className="btn btn-sm btn-outline-secondary"
//                     onClick={handleEditToggle}
//                   >
//                     {editMode ? <BiSave size={20} /> : <BiPencil size={20} />}
//                   </button>
//                 </div>

//                 {editMode ? (
//                   <>
//                     <div className="mb-3">
//                       <label className="form-label">Name</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     <div className="mb-3">
//                       <label className="form-label">Phone</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                       />
//                     </div>
//                     {/* Email is omitted from the form */}
//                   </>
//                 ) : (
//                   <>
//                     <p className="mb-1">
//                       <strong>Name: </strong> {user.name}
//                     </p>
//                     <p className="mb-1">
//                       <strong>Email: </strong> {user.email}
//                     </p>
//                     <p className="mb-3">
//                       <strong>Phone: </strong> {user.phone}
//                     </p>

//                     <div className="d-flex mb-3">
//                       <button
//                         className="btn btn-sm btn-outline-secondary me-2"
//                         onClick={openPasswordModal}
//                       >
//                         <BiKey size={18} className="me-1" />
//                         Change Password
//                       </button>
//                       <button
//                         className="btn btn-sm btn-outline-danger"
//                         onClick={handleLogout}
//                       >
//                         <BiLogOut size={18} className="me-1" />
//                         Logout
//                       </button>
//                     </div>
//                   </>
//                 )}

//                 {/* Addresses Section */}
//                 <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
//                   <h6 className="mb-0">Addresses</h6>
//                   <button
//                     className="btn btn-sm btn-outline-success"
//                     onClick={() => openAddressModal("add")}
//                   >
//                     <BiPlus size={18} />
//                   </button>
//                 </div>
//                 <div>
//                   {addresses && addresses.length > 0 ? (
//                     addresses.map((addr, idx) => (
//                       <div
//                         key={`${addr.title}-${addr.address}-${idx}`}
//                         className="d-flex justify-content-between align-items-start mb-3 border-bottom pb-2"
//                       >
//                         <div>
//                           <p className="mb-0">
//                             <strong>{addr.title}</strong>
//                           </p>
//                           <small className="text-secondary">{addr.address}</small>
//                         </div>
//                         <div className="d-flex flex-column">
//                           <button
//                             className="btn btn-sm btn-outline-primary mb-1"
//                             onClick={() => openAddressModal("edit", addr)}
//                           >
//                             <BiPencil size={16} />
//                           </button>
//                           <button
//                             className="btn btn-sm btn-outline-danger"
//                             onClick={() => removeAddress(addr)}
//                           >
//                             <BiTrash size={16} />
//                           </button>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p>No addresses saved.</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ──────────────────────────────────────────────────────────────── */}
//           {/* Right: My Orders (detailed view) */}
//           {/* ──────────────────────────────────────────────────────────────── */}
//           <div className="col-md-6">
//             <div className="card shadow-sm mb-4">
//               <div className="card-body">
//                 <h5 className="card-title mb-3">My Orders</h5>
//                 {orders.length === 0 ? (
//                   <p>You have no orders yet.</p>
//                 ) : (
//                   orders.map((o) => (
//                     <div
//                       key={o._id}
//                       className="mb-4 p-3 border rounded"
//                       style={{ backgroundColor: "#f9f9f9" }}
//                     >
//                       {/* 1) Order Date & Status */}
//                       <div className="d-flex justify-content-between align-items-center mb-2">
//                         <small className="text-muted">
//                           {new Date(o.createdAt).toLocaleString(undefined, {
//                             year: "numeric",
//                             month: "short",
//                             day: "numeric",
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </small>
//                         <span
//                           className={`badge ${
//                             o.status === "Delivered"
//                               ? "bg-success"
//                               : o.status === "Cancelled"
//                               ? "bg-danger"
//                               : "bg-warning text-dark"
//                           }`}
//                         >
//                           {o.status}
//                         </span>
//                       </div>

//                       {/* 2) Items Table */}
//                       <div className="table-responsive">
//                         <table className="table mb-2">
//                           <thead>
//                             <tr>
//                               <th>Item</th>
//                               <th>Qty</th>
//                               <th>Price</th>
//                               <th>Subtotal</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {o.items.map((it, idx) => (
//                               <tr key={idx}>
//                                 <td>{it.name}</td>
//                                 <td>{it.quantity}</td>
//                                 <td>${it.price.toFixed(2)}</td>
//                                 <td>${it.subtotal.toFixed(2)}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>

//                       {/* 3) Total Price */}
//                       <div className="d-flex justify-content-end">
//                         <strong>Total:&nbsp;${o.totalPrice.toFixed(2)}</strong>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Address Modal */}
//       <AddressModal
//         ref={addressModalRef}
//         mode={addressModalMode}
//         currentAddress={currentAddress}
//         onChange={handleAddressInputChange}
//         onSubmit={submitAddress}
//       />

//       {/* Change Password Modal */}
//       <div
//         className="modal fade"
//         id="passwordModal"
//         tabIndex="-1"
//         aria-labelledby="passwordModalLabel"
//         aria-hidden="true"
//         ref={passwordModalRef}
//       >
//         <div className="modal-dialog">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h5 className="modal-title" id="passwordModalLabel">
//                 Change Password
//               </h5>
//               <button
//                 type="button"
//                 className="btn-close"
//                 aria-label="Close"
//                 onClick={() => passwordModalRef.current._bs_modal.hide()}
//               ></button>
//             </div>
//             <div className="modal-body">
//               {passwordError && (
//                 <div className="alert alert-danger">{passwordError}</div>
//               )}
//               <div className="mb-3">
//                 <label className="form-label">Current Password</label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   name="currentPassword"
//                   value={passwordData.currentPassword}
//                   onChange={handlePasswordChange}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">New Password</label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   name="newPassword"
//                   value={passwordData.newPassword}
//                   onChange={handlePasswordChange}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Confirm New Password</label>
//                 <input
//                   type="password"
//                   className="form-control"
//                   name="confirmPassword"
//                   value={passwordData.confirmPassword}
//                   onChange={handlePasswordChange}
//                 />
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button
//                 className="btn btn-secondary"
//                 onClick={() => passwordModalRef.current._bs_modal.hide()}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="btn btn-warning"
//                 onClick={submitPasswordChange}
//               >
//                 <BiKey size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Profile;


import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BiPencil,
  BiTrash,
  BiKey,
  BiPlus,
  BiSave,
  BiLogOut,
} from "react-icons/bi";
import { useCart } from "../context/CartContext";
import AddressModal from "../components/AddressModal";
import PasswordModal from "../components/PasswordModal";

const Profile = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  // Address modal
  const [addressModalMode, setAddressModalMode] = useState("add"); // "add" or "edit"
  const [currentAddress, setCurrentAddress] = useState({
    title: "",
    address: "",
    oldTitle: "",
    oldAddress: "",
  });
  const addressModalRef = useRef();

  // Change Password modal
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const passwordModalRef = useRef();

  // Fetch user + orders on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    axios
      .get("/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const u = res.data.user;
        setUser(u);
        setFormData({ name: u.name, phone: u.phone });
        setAddresses(u.addresses || []);
        setLoading(false);
        return axios.get("/orders", { headers: { Authorization: `Bearer ${token}` } });
      })
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error(err);
        navigate("/signin");
      });
  }, [navigate]);

  // Open Address Modal
  const openAddressModal = (mode, addr = { title: "", address: "" }) => {
    setAddressModalMode(mode);
    if (mode === "edit") {
      setCurrentAddress({
        oldTitle: addr.title,
        oldAddress: addr.address,
        title: addr.title,
        address: addr.address,
      });
    } else {
      setCurrentAddress({ oldTitle: "", oldAddress: "", title: "", address: "" });
    }
    addressModalRef.current.show();
  };

  const handleAddressInputChange = (e) => {
    setCurrentAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitAddress = () => {
    const { oldTitle, oldAddress, title, address } = currentAddress;
    if (!title.trim() || !address.trim()) {
      alert("Both title and address are required.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    if (addressModalMode === "add") {
      axios
        .post(
          "/users/me/addresses",
          { title: title.trim(), address: address.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setAddresses(res.data);
          addressModalRef.current.hide();
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to add address.");
        });
    } else {
      axios
        .put(
          "/users/me/addresses",
          {
            oldTitle,
            oldAddress,
            title: title.trim(),
            address: address.trim(),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setAddresses(res.data);
          addressModalRef.current.hide();
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to update address.");
        });
    }
  };

  const removeAddress = (addr) => {
    const token = localStorage.getItem("token");
    axios
      .delete("/users/me/addresses", {
        headers: { Authorization: `Bearer ${token}` },
        data: { title: addr.title, address: addr.address },
      })
      .then((res) => {
        setAddresses(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to remove address.");
      });
  };

  // Open Password Modal
  const openPasswordModal = () => {
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
    passwordModalRef.current.show();
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitPasswordChange = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    const token = localStorage.getItem("token");
    axios
      .put(
        "/users/me/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        passwordModalRef.current.hide();
        alert("Password changed successfully.");
      })
      .catch((err) => {
        console.error(err);
        setPasswordError(err.response?.data?.message || "Failed to change password.");
      });
  };

  // Edit Profile Details (name & phone only)
  const handleEditToggle = () => {
    if (editMode) {
      const token = localStorage.getItem("token");
      axios
        .put(
          "/users/me",
          { name: formData.name.trim(), phone: formData.phone.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          setUser(res.data);
          setEditMode(false);
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to update details.");
        });
    } else {
      setEditMode(true);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    clearCart();
    navigate("/signin");
  };

  // Render
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-dark" role="status"></div>
      </div>
    );
  }

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center font-heading mb-4">My Profile</h2>
        <div className="row g-4">
          {/* Left: Account Details & Addresses */}
          <div className="col-md-6">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                {/* Account Details */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title">Account Details</h5>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleEditToggle}
                  >
                    {editMode ? <BiSave size={20} /> : <BiPencil size={20} />}
                  </button>
                </div>

                {editMode ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mb-1">
                      <strong>Name: </strong> {user.name}
                    </p>
                    <p className="mb-1">
                      <strong>Email: </strong> {user.email}
                    </p>
                    <p className="mb-3">
                      <strong>Phone: </strong> {user.phone}
                    </p>

                    <div className="d-flex mb-3">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={openPasswordModal}
                      >
                        <BiKey size={18} className="me-1" />
                        Change Password
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={handleLogout}
                      >
                        <BiLogOut size={18} className="me-1" />
                        Logout
                      </button>
                    </div>
                  </>
                )}

                {/* Addresses Section */}
                <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
                  <h6 className="mb-0">Addresses</h6>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => openAddressModal("add")}
                  >
                    <BiPlus size={18} />
                  </button>
                </div>
                <div>
                  {addresses && addresses.length > 0 ? (
                    addresses.map((addr, idx) => (
                      <div
                        key={`${addr.title}-${addr.address}-${idx}`}
                        className="d-flex justify-content-between align-items-start mb-3 border-bottom pb-2"
                      >
                        <div>
                          <p className="mb-0">
                            <strong>{addr.title}</strong>
                          </p>
                          <small className="text-secondary">{addr.address}</small>
                        </div>
                        <div className="d-flex flex-column">
                          <button
                            className="btn btn-sm btn-outline-primary mb-1"
                            onClick={() => openAddressModal("edit", addr)}
                          >
                            <BiPencil size={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeAddress(addr)}
                          >
                            <BiTrash size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No addresses saved.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: My Orders */}
          <div className="col-md-6">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">My Orders</h5>
                {orders.length === 0 ? (
                  <p>You have no orders yet.</p>
                ) : (
                  orders.map((o) => (
                    <div
                      key={o._id}
                      className="mb-4 p-3 border rounded"
                      style={{ backgroundColor: "#f9f9f9" }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">
                          {new Date(o.createdAt).toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                        <span
                          className={`badge ${
                            o.status === "Delivered"
                              ? "bg-success"
                              : o.status === "Cancelled"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {o.status}
                        </span>
                      </div>

                      <div className="table-responsive">
                        <table className="table mb-2">
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

                      <div className="d-flex justify-content-end">
                        <strong>Total: ${o.totalPrice.toFixed(2)}</strong>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        ref={addressModalRef}
        mode={addressModalMode}
        currentAddress={currentAddress}
        onChange={handleAddressInputChange}
        onSubmit={submitAddress}
      />

      {/* Password Modal */}
      <PasswordModal
        ref={passwordModalRef}
        passwordData={passwordData}
        passwordError={passwordError}
        onChange={handlePasswordChange}
        onSubmit={submitPasswordChange}
      />
    </section>
  );
};

export default Profile;