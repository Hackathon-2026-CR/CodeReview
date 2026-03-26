const taskService = require("../services/taskService");
const fs = require("fs");

const getMyTasks = async (req, res) => {
  try {
    const tasks = await taskService.getMyTasks(req.params.userName);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getWorkingTasks = async (req, res) => {
  try {
    const tasks = await taskService.getWorkingTasks(req.params.reviewerName);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFinishedTasks = async (req, res) => {
  try {
    const tasks = await taskService.getFinishedTasks(req.params.reviewerName);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAvailableTasks(req.params.userName);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addTask = async (req, res) => {
  try {
    let code = req.body.code || null;
    if (req.file) {
      code = fs.readFileSync(req.file.path, "utf-8");
      fs.unlinkSync(req.file.path);
    }
    const result = await taskService.addTask({ ...req.body, code });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Nouveau
const takeTask = async (req, res) => {
  try {
    const result = await taskService.takeTask(
      req.params.id,
      req.body.reviewer
    );
    res.json(result);
  } catch (err) {
    const status =
      err.message === "Task not found" ? 404
      : err.message === "Not enough credits" ? 402
      : err.message === "Unauthorized" ? 403
      : 400;
    res.status(status).json({ error: err.message });
  }
};

// ✅ Nouveau
const submitReview = async (req, res) => {
  try {
    const result = await taskService.submitReview(
      req.params.id,
      req.body.reviewer,
      req.body.rating
    );
    res.json(result);
  } catch (err) {
    const status =
      err.message === "Task not found" ? 404
      : err.message === "Unauthorized" || err.message === "You are not the reviewer of this task" ? 403
      : 400;
    res.status(status).json({ error: err.message });
  }
};
const cancelTask = async (req, res) => {
  try {
    const result = await taskService.cancelTask(req.params.id, req.body.reviewer);
    res.json(result);
  } catch (err) {
    const status =
      err.message === "Task not found" ? 404
      : err.message === "You are not the reviewer of this task" ? 403
      : 400;
    res.status(status).json({ error: err.message });
  }
};


const rateReview = async (req, res) => {
  try {
    const result = await taskService.rateReview(
      req.params.id,
      req.body.creator,
      req.body.rating
    );
    res.json(result);
  } catch (err) {
    const status =
      err.message === "Task not found" ? 404
      : err.message === "Only the task creator can rate the review" ? 403
      : 400;
    res.status(status).json({ error: err.message });
  }
};

module.exports = {
  getMyTasks,
  getWorkingTasks,
  getFinishedTasks,
  getAllTasks,
  getTaskById,
  addTask,
  takeTask,
  cancelTask,   
  submitReview, 
  rateReview,   
};

