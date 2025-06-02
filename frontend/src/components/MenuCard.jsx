import React from "react";

const MenuCard = ({ item, onAdd }) => {
  return (
    <div className="menu-card mb-4">
      <img src={"/" + item.img} alt={item.name} />
      <div className="p-3 d-flex flex-column" style={{ minHeight: "220px" }}>
        <h5 className="font-heading">{item.name}</h5>
        <p className="text-secondary small flex-grow-1">
          {item.description}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="fw-bold">${item.price.toFixed(2)}</span>
          <button
            className="btn btn-sm"
            style={{
              backgroundColor: "#ffbe33",
              color: "#222831",
            }}
            onClick={() => onAdd(item)}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
