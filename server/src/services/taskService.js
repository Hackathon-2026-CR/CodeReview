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

const addTask = async ({
  title,
  user_name,
  price,
  languages,
  description,
  groups,
  code,
}) => {
  const langs =
    typeof languages === "string"
      ? languages
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean)
      : languages || [];

  const grps =
    typeof groups === "string"
      ? groups
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean)
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

  return {
    status: "success",
    message: `Task '${task.title}' added successfully`,
    id: task._id,
  };
};

// ── Prendre une task (aucun transfert de crédits ici) ──
const takeTask = async (taskId, reviewerUsername) => {
  const task = await taskDal.findById(taskId);
  if (!task) throw new Error("Task not found");
  if (task.status !== "pending") throw new Error("Task is not available");
  if (task.user_name === reviewerUsername)
    throw new Error("You cannot review your own task");

  const reviewer = await userDal.findByName(reviewerUsername);
  if (!reviewer) throw new Error("Reviewer not found");

  // ✅ Pas de déduction ici — le reviewer prend juste la task
  await taskDal.updateTask(taskId, {
    reviewer: reviewerUsername,
    status: "review in process",
  });

  return { status: "success", message: "Task taken successfully" };
};

// ── Annuler (aucun remboursement car rien n'a été prélevé) ──
const cancelTask = async (taskId, reviewerUsername) => {
  const task = await taskDal.findById(taskId);
  if (!task) throw new Error("Task not found");
  if (task.status !== "review in process")
    throw new Error("Task is not in review");
  if (task.reviewer !== reviewerUsername)
    throw new Error("You are not the reviewer of this task");

  // ✅ Juste remettre la task en pending, pas de remboursement
  await taskDal.updateTask(taskId, {
    reviewer: null,
    status: "pending",
    review_content: null,
  });

  return { status: "success", message: "Task cancelled successfully" };
};

// ── Soumettre la review → reviewer reçoit les crédits ──
const submitReview = async (taskId, reviewerUsername, reviewContent) => {
  const task = await taskDal.findById(taskId);
  if (!task) throw new Error("Task not found");
  if (task.status !== "review in process")
    throw new Error("Task is not in review");
  if (task.reviewer !== reviewerUsername)
    throw new Error("You are not the reviewer of this task");
  if (!reviewContent || reviewContent.trim() === "")
    throw new Error("Review content is required");

  // ✅ Déduit les crédits du créateur
  const creator = await userDal.findByName(task.user_name);
  if (!creator) throw new Error("Creator not found");
  if (creator.credits < task.price)
    throw new Error("Creator does not have enough credits");
  await userDal.updateByName(task.user_name, {
    credits: creator.credits - task.price,
  });

  // ✅ Crédite le reviewer
  const reviewer = await userDal.findByName(reviewerUsername);
  if (reviewer) {
    await userDal.updateByName(reviewerUsername, {
      credits: reviewer.credits + task.price,
    });
  }

  await taskDal.updateTask(taskId, {
    status: "reviewed",
    review_content: reviewContent,
  });

  return {
    status: "success",
    message: "Review submitted and credits transferred",
  };
};

// ── Noter la review (créateur) — aucun transfert ici ──
const rateReview = async (taskId, creatorUsername, rating) => {
  const task = await taskDal.findById(taskId);
  if (!task) throw new Error("Task not found");
  if (task.status !== "reviewed")
    throw new Error("Task has not been reviewed yet");
  if (task.user_name !== creatorUsername)
    throw new Error("Only the task creator can rate the review");
  if (task.rating !== null) throw new Error("Review already rated");
  if (!rating || rating < 1 || rating > 5)
    throw new Error("Rating must be between 1 and 5");

  // ✅ Juste la note, plus de transfert de crédits
  await taskDal.updateTask(taskId, { rating });

  return { status: "success", message: "Review rated successfully" };
};

module.exports = {
  getMyTasks,
  getWorkingTasks,
  getFinishedTasks,
  getAvailableTasks,
  getTaskById,
  addTask,
  takeTask,
  cancelTask,
  submitReview,
  rateReview,
};
