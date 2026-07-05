import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { truncate } from "../api.js";

const ItemList = ({ title, fetchItems }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems()
      .then(setItems)
      .finally(() => setLoading(false));
  }, [fetchItems]);

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  return (
    <div className="item-list-page">
      <h1 className="page-title">{title}</h1>
      {items.length === 0 && <p className="empty-text">No items yet.</p>}
      <div className="item-list">
        {items.map((item) => (
          <Link to={`/items/${item.id}`} className="item-card" key={item.id}>
            <h2 className="item-title">{item.item_name}</h2>
            <p className="item-description">{truncate(item.description)}</p>
            <p className="item-meta">
              Qty: {item.quantity} &middot; by {item.username}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
