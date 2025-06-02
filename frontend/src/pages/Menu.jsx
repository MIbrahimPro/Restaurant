import React, { useState, useEffect } from "react";
import MenuCard from "../components/MenuCard";
import axios from "axios";
import { useCart } from "../context/CartContext";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCat, setSelectedCat] = useState("All");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories([{ name: "All", icon: "/all-icon.png" }, ...response.data]);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("/items");
        setItems(response.data);
        setFiltered(response.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Filter when category changes
  useEffect(() => {
    if (selectedCat === "All") {
      setFiltered(items);
    } else {
      setFiltered(items.filter((it) => it.category.name === selectedCat));
    }
  }, [selectedCat, items]);

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center font-heading mb-4 text-dark">Our Menu</h2>

        {/* Category Pills */}
        <div className="d-flex flex-wrap justify-content-center mb-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`me-2 mb-2 category-pill ${
                selectedCat === cat.name ? "active" : ""
              }`}
              onClick={() => setSelectedCat(cat.name)}
            >
              <img src={cat.icon} alt={cat.name} className="category-icon me-1" />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Items Grid */}
        {loading ? (
          <p className="text-center">Loading menu…</p>
        ) : (
          <div className="row g-4">
            {filtered.map((item) => (
              <div key={item._id} className="col-sm-6 col-md-4 col-lg-3">
                <MenuCard
                  item={item}
                  onAdd={() => addToCart(item)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu;
