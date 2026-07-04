import express from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { firstName, lastName, username, password } = req.body;

  if (!firstName || !lastName || !username || !password) {
    return res.status(400).send({ error: "All fields are required." });
  }

  const existing = await db.query("SELECT id FROM users WHERE username = $1", [
    username,
  ]);
  if (existing.rows.length > 0) {
    return res.status(409).send({ error: "Username is already taken." });
  }

  const hashed = await bcrypt.hash(password, 10);

  const result = await db.query(
    "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, username",
    [firstName, lastName, username, hashed]
  );

  const user = result.rows[0];
  req.session.userId = user.id;
  res.status(201).send({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({ error: "Invalid username or password." });
  }

  req.session.userId = user.id;
  res.send({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.status(204).send();
  });
});

router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.json(null);
  }

  const result = await db.query(
    "SELECT id, first_name, last_name, username FROM users WHERE id = $1",
    [req.session.userId]
  );
  const user = result.rows[0];
  if (!user) {
    return res.json(null);
  }

  res.json({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
  });
});

export default router;
