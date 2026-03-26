const express = require("express");
const multer = require("multer");
const userController = require("../controllers/userController");
const taskController = require("../controllers/taskController");

const router = express.Router();
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ── User routes ──────────────────────────────────────
router.get("/users/:userName", userController.getUser);
router.post("/add-user", userController.addUser);
router.post("/login", userController.login);
router.post("/update-user", userController.updateUser);

// ── Task routes ───────────────────────────────────────
router.get("/my-tasks/:userName", taskController.getMyTasks);
router.get("/working-tasks/:reviewerName", taskController.getWorkingTasks);
router.get("/finished-tasks/:reviewerName", taskController.getFinishedTasks);
router.get("/all-tasks/:userName", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);

router.post("/add-task", upload.single("file"), taskController.addTask);

// ✅ Nouvelles routes
router.post("/take-task/:id", taskController.takeTask);
router.post("/cancel-task/:id", taskController.cancelTask); // ← présent ?
router.post("/submit-review/:id", taskController.submitReview);
router.post("/rate-review/:id", taskController.rateReview);
module.exports = router;
