import express from "express";
import db from "../db.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// anyone can see every item, logged in or not
router.get("/", async (req, res) => {
  const result = await db.query(
    "SELECT items.id, items.user_id, items.item_name, items.description, items.quantity, users.username FROM items JOIN users ON users.id = items.user_id ORDER BY items.id DESC"
  );
  res.send(result.rows);
});

// only the items that belong to the logged in user
router.get("/mine", requireAuth, async (req, res) => {
  const result = await db.query(
    "SELECT items.id, items.user_id, items.item_name, items.description, items.quantity, users.username FROM items JOIN users ON users.id = items.user_id WHERE items.user_id = $1 ORDER BY items.id DESC",
    [req.session.userId]
  );
  res.send(result.rows);
});

// anyone can see one item, logged in or not
router.get("/:id", async (req, res) => {
  const result = await db.query(
    "SELECT items.id, items.user_id, items.item_name, items.description, items.quantity, users.username FROM items JOIN users ON users.id = items.user_id WHERE items.id = $1",
    [req.params.id]
  );
  const item = result.rows[0];

  if (!item) {
    return res.status(404).send({ error: "Item not found." });
  }

  res.send(item);
});

router.post("/", requireAuth, async (req, res) => {
  const { itemName, description, quantity } = req.body;

  if (!itemName) {
    return res.status(400).send({ error: "Item name is required." });
  }

  const result = await db.query(
    "INSERT INTO items (user_id, item_name, description, quantity) VALUES ($1, $2, $3, $4) RETURNING id",
    [req.session.userId, itemName, description || "", quantity || 0]
  );

  res.status(201).send({ id: result.rows[0].id });
});

router.put("/:id", requireAuth, async (req, res) => {
  const { itemName, description, quantity } = req.body;

  const existingItem = await getItemById(req.params.id);
  if (!existingItem) {
    return res.status(404).send({ error: "Item not found." });
  }
  if (existingItem.user_id !== req.session.userId) {
    return res.status(403).send({ error: "You can only edit your own items." });
  }

  const result = await db.query(
    "UPDATE items SET item_name = $1, description = $2, quantity = $3 WHERE id = $4 RETURNING id",
    [itemName, description, quantity, req.params.id]
  );

  res.send(result.rows[0]);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const existingItem = await getItemById(req.params.id);
  if (!existingItem) {
    return res.status(404).send({ error: "Item not found." });
  }
  if (existingItem.user_id !== req.session.userId) {
    return res
      .status(403)
      .send({ error: "You can only delete your own items." });
  }

  await db.query("DELETE FROM items WHERE id = $1", [req.params.id]);
  res.status(204).send();
});

// small helper just for checking who owns an item before edit/delete
async function getItemById(id) {
  const result = await db.query("SELECT user_id FROM items WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
}

export default router;
