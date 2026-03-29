const mongoose = require("mongoose");

// models/Task.js
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    user_name: { type: String, required: true },
    languages: { type: [String], default: [] },
    description: { type: String, default: null },
    groups: { type: [String], default: ["public"] },
    price: { type: Number, required: true },
    code: { type: String, default: null },
    reviewer: { type: String, default: null },
    review_content: { type: String, default: null }, // ✅ Nouveau
    status: {
      type: String,
      enum: ["pending", "review in process", "reviewed"],
      default: "pending",
    },
    rating: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
