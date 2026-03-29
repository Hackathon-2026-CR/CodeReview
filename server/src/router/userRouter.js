const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/:userName", userController.getUser);
router.post("/login", userController.login);
router.post("/add-user", userController.addUser);
router.post("/update-user", userController.updateUser);

module.exports = router;
