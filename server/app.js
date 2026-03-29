require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const paymentRouter = require("./src/router/paymentRouter");
const taskRouter = require("./src/router/taskRouter");
const userRouter = require("./src/router/userRouter");

const app = express();
const PORT = process.env.PORT || 8000;

// ── Middleware ────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  }),
);

// ✅ webhook avant express.json()
app.use("/api/payments", paymentRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────
app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);

// ── Health check ──────────────────────────────────────
app.get("/health", (_req, res) =>
  res.json({ ok: true, message: "Server is running" }),
);

// ── 404 handler ───────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

// ── Global error handler ──────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// ── MongoDB + démarrage ───────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
