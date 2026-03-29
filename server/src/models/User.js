const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    credits: { type: Number, default: 200 },
    groups: { type: [String], default: [] },
    price: { type: Number, default: null },
    languages: { type: [String], default: [] },
    rating: { type: Number, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
