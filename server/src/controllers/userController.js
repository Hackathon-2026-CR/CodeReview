const userService = require("../services/userService");
const jwt = require("jsonwebtoken");

const getUser = async (req, res) => {
  try {
    const user = await userService.getUserByName(req.params.userName);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

const addUser = async (req, res) => {
  try {
    const result = await userService.registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    const status = err.message === "Username already taken" ? 409 : 500;
    res.status(status).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const userData = await userService.loginUser(req.body);

    // ✅ Génère le JWT
    const token = jwt.sign(
      { username: userData.username, id: userData.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ ok: true, user: userData, token });
  } catch (err) {
    res.status(401).json({ ok: false, error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const result = await userService.updateUser(req.body, req.body.name);
    res.json(result);
  } catch (err) {
    const status =
      err.message === "Unauthorized"
        ? 403
        : err.message.includes("not found")
          ? 404
          : 500;
    res.status(status).json({ error: err.message });
  }
};

module.exports = { getUser, addUser, login, updateUser };
