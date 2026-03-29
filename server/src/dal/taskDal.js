const Task = require("../models/Task");

const findByUserName = (user_name) => Task.find({ user_name });

const findWorkingByReviewer = (reviewer) =>
  Task.find({ reviewer, status: "review in process" });

const findFinishedByReviewer = (reviewer) =>
  Task.find({ reviewer, status: "reviewed" });

const findAvailableForUser = (groups, username) =>
  Task.find({
    user_name: { $ne: username },
    status: "pending",
    $or: [{ groups: { $in: groups } }, { groups: "public" }],
  });

const findById = (id) => Task.findById(id);

const createTask = (taskData) => Task.create(taskData);

const updateTask = (id, updates) =>
  Task.findByIdAndUpdate(id, updates, { new: true });

const deleteTask = (id) => Task.findByIdAndDelete(id);

const findRatedTasksByReviewer = (reviewer) =>
  Task.find({ reviewer, rating: { $ne: null } });

module.exports = {
  findByUserName,
  findWorkingByReviewer,
  findFinishedByReviewer,
  findAvailableForUser,
  findById,
  createTask,
  updateTask,
  deleteTask,
  findRatedTasksByReviewer, // ✅
};
