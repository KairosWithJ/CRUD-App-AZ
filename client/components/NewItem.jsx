import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../api.js";

const NewItem = () => {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await createItem({ itemName, description, quantity });
      navigate("/inventory");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-page">
      <h1 className="page-title">Add Item</h1>
      {error && <p className="error">{error}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
          Item Name
          <input
            className="form-input"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </label>
        <label className="form-label">
          Description
          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </label>
        <label className="form-label">
          Quantity
          <input
            className="form-input"
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>
        <button className="btn btn-primary" type="submit">
          Create Item
        </button>
      </form>
    </div>
  );
};

export default NewItem;
