const User = require("../models/User");

const findByName = (name) => User.findOne({ name });

const createUser = (userData) => User.create(userData);

const updateByName = (name, updates) =>
  User.findOneAndUpdate({ name }, updates, { new: true });

module.exports = { findByName, createUser, updateByName };
