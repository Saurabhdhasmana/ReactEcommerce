const blogModel = require("../models/blogModel");
const blogController = async (req, res) => {
	try {
		const { title, description } = req.body;
		const file = req.file;
		if (!title || !description) {
			return res.status(400).json({ error: "Title, description, and image are required" });
		}
		const blog = await blogModel.create({
			title,
			description,
			image: file?.filename
		})
		if (blog) {
			res.status(201).json({ message: "Blog created successfully", blog });
		} else {
			res.status(400).json({ error: "Blog not created" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Server error" });
	}
}

const getAllblogController = async (req, res) => {
	try {
		const blogs = await blogModel.find({})
		if (blogs.length > 0) {
			res.status(200).json(blogs);
		}
		else {
			res.status(404).json({ message: "No blogs found" })
		}
	} catch (err) {
		res.status(500).json({ error: "server error" })
	}
}

const deleteBlogController = async (req, res) => {
	try {
		const deleted = await blogModel.findOneAndDelete({ _id: req.params.id });
		if (deleted) {
			res.status(200).json({ message: "Blog deleted successfully" });
		} else {
			res.status(404).json({ message: "Blog not found" });
		}
	} catch (err) {
		res.status(500).json({ error: "server error" });
	}
}

const updateBlogController = async (req, res) => {
	try {
		const { title, description } = req.body;
		const file = req.file;
		if (!title || !description) {
			return res.status(400).json({ error: "Title and description are required" });
		}
		const updateData = { title, description };
		if (file) {
			updateData.image = file.filename;
		}
		const updatedBlog = await blogModel.findByIdAndUpdate({ _id: req.params.id }, updateData, { new: true });
		if (updatedBlog) {
			res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
		} else {
			res.status(404).json({ message: "Blog not found" });
		}
	} catch (err) {
		res.status(500).json({ error: "Server error" });
	}
}
const getSingleblogController = async (req, res) => {
	try {
		const getsingleBlog = await blogModel.findOne({ _id: req.params.id })
		if (getsingleBlog) {
			return res.status(200).json(getsingleBlog);
		}
		else {
			return res.status(404).json({ message: "Blog not found" });
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Server error" });
	}
}
module.exports = { blogController, getAllblogController, deleteBlogController, updateBlogController, getSingleblogController };