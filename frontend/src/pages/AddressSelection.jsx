// src/pages/AddressSelection.jsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import AddressModal from "../components/AddressModal";
import { BiPencil, BiTrash, BiPlus } from "react-icons/bi";

const AddressSelection = () => {
  const navigate = useNavigate();
  const { shippingAddress, setShippingAddress } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(shippingAddress || null);

  // For the modal
  const [addressModalMode, setAddressModalMode] = useState("add"); // "add" or "edit"
  const [currentAddress, setCurrentAddress] = useState({
    title: "",
    address: "",
    oldTitle: "",
    oldAddress: "",
  });
  const addressModalRef = useRef();

  // 1) Fetch user addresses on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    axios
      .get("/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setAddresses(res.data.user.addresses || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [navigate]);

  // 2) Open the modal in “add” or “edit” mode
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

  // 3) Handle form input change inside the modal
  const handleAddressInputChange = (e) => {
    setCurrentAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 4) Submit (add or edit) address
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

  // 5) Remove an address
  const removeAddress = (addr) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    axios
      .delete("/users/me/addresses", {
        headers: { Authorization: `Bearer ${token}` },
        data: { title: addr.title, address: addr.address },
      })
      .then((res) => {
        setAddresses(res.data);
        // If the removed address was selected, clear selection
        if (
          selected &&
          selected.title === addr.title &&
          selected.address === addr.address
        ) {
          setSelected(null);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to remove address.");
      });
  };

  // 6) Proceed to Payment page
  const handleNext = () => {
    if (!selected) {
      alert("Please select an address.");
      return;
    }
    setShippingAddress(selected);
    navigate("/checkout/payment");
  };

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center font-heading mb-4">
          Select Shipping Address
        </h2>

        {addresses.length === 0 ? (
          <p>No saved addresses. Please add one:</p>
        ) : (
          <ul className="list-group mb-3">
            {addresses.map((addr, idx) => (
              <li
                key={`${addr.title}-${addr.address}-${idx}`}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  selected &&
                  selected.title === addr.title &&
                  selected.address === addr.address
                    ? "border-primary bg-primary-subtle"
                    : ""
                }`}
                onClick={() => setSelected(addr)}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <strong>{addr.title}</strong>
                  <div className="small">{addr.address}</div>
                </div>
                <div className="d-flex flex-column">
                  <button
                    className="btn btn-sm btn-outline-primary mb-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddressModal("edit", addr);
                    }}
                  >
                    <BiPencil size={16} />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAddress(addr);
                    }}
                  >
                    <BiTrash size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          className="btn btn-sm btn-outline-success mb-3"
          onClick={() => openAddressModal("add")}
        >
          <BiPlus size={16} /> Add New Address
        </button>

        <hr className="my-4" />
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary" onClick={handleNext}>
            Next: Payment
          </button>
        </div>
      </div>

      <AddressModal
        ref={addressModalRef}
        mode={addressModalMode}
        currentAddress={currentAddress}
        onChange={handleAddressInputChange}
        onSubmit={submitAddress}
      />
    </section>
  );
};

export default AddressSelection;
