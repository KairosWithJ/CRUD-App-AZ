import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";

dotenv.config({ path: "../.env" });

const { PORT, SESSION_SECRET } = process.env;

const app = express();

app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" },
  })
);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
