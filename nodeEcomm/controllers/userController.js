const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSignup = async (req, res) => {
	let { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json({ error: "All fields are required" });
	}
	let user = await userModel.findOne({ email });
	if (user) {
		return res.status(400).json({ error: "User already exists you need to login first" });
	}
	const salt = await bcrypt.genSalt(10);
	let hash = await bcrypt.hash(password, salt);
	user = new userModel({ name, email, password: hash });
	await user.save();
	res.json({ message: "Signup successful", user: { id: user._id, name: user.name, email: user.email } });
}

const userLogin = async (req, res) => {
	try {
		let { email, password } = req.body;
		let user = await userModel.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid password" });
		}
		const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1d" });
		res.json({ message: "Login successful...", token, user: { id: user._id, name: user.name, email: user.email, password: user.password,role:user.isAdmin } });

	} catch (err) {
		res.status(500).json({ error: "Internal Server error", error: err.message });
	}
}

const getaSingleUser = async (req, res) => {
	try {
		const user = await userModel.findOne({ _id: req.params.id });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		} else {
			res.json({ user: { id: user._id, name: user.name, email: user.email, password: user.password } });
		}
	} catch (err) {
		res.status(500).json({ error: "Internal Server error", error: err.message });
	}

};

const getAllusers = async (req, res) => {
	try {
		const getallUser = await userModel.find();
		if (getallUser.length === 0) {
			return res.status(404).json({ error: "No users found" });
		}
		res.json(getallUser);
	} catch (err) {
		res.status(500).json({ error: "Internal Server error", error: err.message });
	}
};

const updateUser = async (req, res) => {
	const { name, email } = req.body;
	try {
		const updatedUser = await userModel.findOneAndUpdate({ _id: req.params.id }, { name, email }, { new: true });
		if (!updatedUser) {
			return res.status(404).json({ error: "User not found" });
		}
		res.json({ message: "User updated successfully", user: updatedUser });
	} catch (err) {
		res.status(500).json({ error: "Internal Server error", error: err.message });
	}
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email, isAdmin: true });
  if (!user) {
	return res.status(404).json({ error: "Admin not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
	return res.status(400).json({ error: "Invalid password" });
  }
  const token = jwt.sign({ id: user._id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ message: "Login successful", token, user: { id: user._id, name: user.name, email: user.email, isAdmin:user.isAdmin} });
}

module.exports = { userSignup, userLogin, getaSingleUser, getAllusers, updateUser, adminLogin }; // Export the userController functions