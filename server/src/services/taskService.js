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

  const creator = await userDal.findByName(user_name);
  if (!creator) throw new Error("User not found");
  if (creator.credits < parseInt(price))
    throw new Error("Not enough credits to create this task");

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

const takeTask = async (taskId, reviewerUsername) => {
  const task = await taskDal.findById(taskId);
  if (!task) throw new Error("Task not found");
  if (task.status !== "pending") throw new Error("Task is not available");
  if (task.user_name === reviewerUsername)
    throw new Error("You cannot review your own task");

  const creator = await userDal.findByName(task.user_name);
  if (!creator) throw new Error("Creator not found");
  if (creator.credits < task.price)
    throw new Error(
      "This task cannot be taken — creator has insufficient credits",
    );

  const reviewer = await userDal.findByName(reviewerUsername);
  if (!reviewer) throw new Error("Reviewer not found");

  await taskDal.updateTask(taskId, {
    reviewer: reviewerUsername,
    status: "review in process",
  });

  return { status: "success", message: "Task taken successfully" };
};

const cancelTask = async (taskId, reviewerUsername) => {
  const task = await taskDal.findById(taskId);
  if (!task) throw new Error("Task not found");
  if (task.status !== "review in process")
    throw new Error("Task is not in review");
  if (task.reviewer?.toString().trim() !== reviewerUsername?.toString().trim())
    throw new Error("You are not the reviewer of this task");

  await taskDal.updateTask(taskId, {
    reviewer: null,
    status: "pending",
    review_content: null,
  });

  return { status: "success", message: "Task cancelled successfully" };
};

const submitReview = async (taskId, reviewerUsername, reviewContent) => {
  const task = await taskDal.findById(taskId);
  if (!task) throw new Error("Task not found");
  if (task.status !== "review in process")
    throw new Error("Task is not in review");
  if (task.reviewer?.toString().trim() !== reviewerUsername?.toString().trim())
    throw new Error("You are not the reviewer of this task");
  if (!reviewContent || reviewContent.trim() === "")
    throw new Error("Review content is required");

  const creator = await userDal.findByName(task.user_name);
  if (!creator) throw new Error("Creator not found");
  if (creator.credits < task.price)
    throw new Error("Creator does not have enough credits");

  await userDal.updateByName(task.user_name, {
    credits: creator.credits - task.price,
  });

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

  await taskDal.updateTask(taskId, { rating });

  const ratedTasks = await taskDal.findRatedTasksByReviewer(task.reviewer);
  const allRatings = [...ratedTasks.map((t) => t.rating), rating];
  const avg = allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;
  const roundedAvg = Math.round(avg * 10) / 10;

  await userDal.updateByName(task.reviewer, { rating: roundedAvg });

  return { status: "success", message: "Review rated successfully" };
};

// ✅ removeTask était manquant
const removeTask = async (taskId, username) => {
  const task = await taskDal.findById(taskId);
  if (!task) throw new Error("Task not found");
  if (task.user_name !== username)
    throw new Error("You can only delete your own tasks");
  if (task.status !== "pending")
    throw new Error("Cannot delete a task that is already in review");

  await taskDal.deleteTask(taskId);
  return { status: "success", message: "Task deleted successfully" };
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
  removeTask, // ✅
};
