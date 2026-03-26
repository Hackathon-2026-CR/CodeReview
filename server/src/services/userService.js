const bcrypt = require("bcrypt");
const userDal = require("../dal/userDal");

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

const getUserByName = async (name) => {
  const user = await userDal.findByName(name);
  if (!user) return null;
  const { password, ...safeUser } = user.toObject();
  return safeUser;
};

const registerUser = async ({ name, password, email }) => {
  const existing = await userDal.findByName(name);
  if (existing) throw new Error("Username already taken");

  const hashed = await bcrypt.hash(password, ROUNDS);
  const user = await userDal.createUser({ name, password: hashed, email });
  return { response: `User '${user.name}' created successfully` };
};

const loginUser = async ({ username, password }) => {
  const user = await userDal.findByName(username);
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  return { id: user._id, username: user.name };
};

// ✅ Sécurisé — requester doit être le même que name
const updateUser = async ({ name, credits, groups, price, languages }, requester) => {
  if (name !== requester) throw new Error("Unauthorized");

  const updates = {};
  if (credits !== undefined) updates.credits = credits;
  if (groups !== undefined) updates.groups = groups;
  if (price !== undefined) updates.price = price;
  if (languages !== undefined) updates.languages = languages;

  if (Object.keys(updates).length === 0)
    return { response: "No fields to update" };

  const updated = await userDal.updateByName(name, updates);
  if (!updated) throw new Error(`User '${name}' not found`);
  return { response: `User '${name}' updated successfully` };
};

module.exports = { getUserByName, registerUser, loginUser, updateUser };
