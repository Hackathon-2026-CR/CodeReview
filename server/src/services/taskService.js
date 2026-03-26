const taskDal = require("../dal/taskDal");
const userDal = require("../dal/userDal");

const getMyTasks = (username) => taskDal.findByUserName(username);

const getWorkingTasks = (reviewerName) =>
  taskDal.findWorkingByReviewer(reviewerName);

const getFinishedTasks = (reviewerName) =>
  taskDal.findFinishedByReviewer(reviewerName);

const getAvailableTasks = async (username) => {
  const user = await userDal.findByName(username);
  const groups = user ? user.groups : [];
  return taskDal.findAvailableForUser(groups, username);
};

const getTaskById = (id) => taskDal.findById(id);

const addTask = async ({ title, user_name, price, languages, description, groups, code }) => {
  const langs = typeof languages === "string"
    ? languages.split(",").map((l) => l.trim()).filter(Boolean)
    : languages || [];

  const grps = typeof groups === "string"
    ? groups.split(",").map((g) => g.trim()).filter(Boolean)
    : groups || ["public"];

  const task = await taskDal.createTask({
    title,
    user_name,
    price: parseInt(price),
    languages: langs,
    description: description || null,
    groups: grps,
    code: code || null,
  });

  return { status: "success", message: `Task '${task.title}' added successfully`, id: task._id };
};

// ✅ Nouveau — prendre une task
const takeTask = async (taskId, reviewerUsername) => {
  const task = await taskDal.findById(taskId);
  if (!task) throw new Error("Task not found");
  if (task.status !== "pending") throw new Error("Task is not available");
  if (task.user_name === reviewerUsername) throw new Error("You cannot review your own task");

  const reviewer = await userDal.findByName(reviewerUsername);
  if (!reviewer) throw new Error("Reviewer not found");
  if (reviewer.credits < task.price) throw new Error("Not enough credits");

  // Déduit les crédits du reviewer
  await userDal.updateByName(reviewerUsername, {
    credits: reviewer.credits - task.price,
  });

  // Met à jour la task
  await taskDal.updateTask(taskId, {
    reviewer: reviewerUsername,
    status: "review in process",
  });

  return { status: "success", message: `Task taken successfully` };
};

// ✅ Nouveau — soumettre une review
const submitReview = async (taskId, reviewerUsername, rating) => {
  const task = await taskDal.findById(taskId);
  if (!task) throw new Error("Task not found");
  if (task.status !== "review in process") throw new Error("Task is not in review");
  if (task.reviewer !== reviewerUsername) throw new Error("You are not the reviewer of this task");

  if (!rating || rating < 1 || rating > 5)
    throw new Error("Rating must be between 1 and 5");

  // Crédite le créateur de la task
  const creator = await userDal.findByName(task.user_name);
  if (creator) {
    await userDal.updateByName(task.user_name, {
      credits: creator.credits + task.price,
    });
  }

  // Finalise la task
  await taskDal.updateTask(taskId, {
    status: "reviewed",
    rating,
  });

  return { status: "success", message: "Review submitted successfully" };
};

module.exports = {
  getMyTasks,
  getWorkingTasks,
  getFinishedTasks,
  getAvailableTasks,
  getTaskById,
  addTask,
  takeTask,
  submitReview,
};
