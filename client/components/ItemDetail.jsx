import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteItem, getItem, updateItem } from "../api.js";
import { useAuth } from "./AuthContext.jsx";

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  const [editItemName, setEditItemName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editQuantity, setEditQuantity] = useState(0);

  useEffect(() => {
    getItem(id)
      .then((data) => setItem(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!item) {
    return <p>Item not found.</p>;
  }

  const isOwner = user && user.id === item.user_id;

  const startEditing = () => {
    setEditItemName(item.item_name);
    setEditDescription(item.description);
    setEditQuantity(item.quantity);
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);

    const updatedFields = {
      itemName: editItemName,
      description: editDescription,
      quantity: editQuantity,
    };

    try {
      await updateItem(id, updatedFields);
      setItem({
        ...item,
        item_name: editItemName,
        description: editDescription,
        quantity: editQuantity,
      });
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    await deleteItem(id);
    navigate("/inventory");
  };

  if (editing) {
    return (
      <div className="form-page">
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSave}>
          <label>
            Item Name
            <input
              value={editItemName}
              onChange={(e) => setEditItemName(e.target.value)}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={4}
            />
          </label>
          <label>
            Quantity
            <input
              type="number"
              min="0"
              value={editQuantity}
              onChange={(e) => setEditQuantity(Number(e.target.value))}
            />
          </label>
          <div className="button-row">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="form-page">
      {error && <p className="error">{error}</p>}
      <h1>{item.item_name}</h1>
      <p className="item-meta">
        Qty: {item.quantity} &middot; by {item.username}
      </p>
      <p>{item.description}</p>
      {isOwner && (
        <div className="button-row">
          <button onClick={startEditing}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
