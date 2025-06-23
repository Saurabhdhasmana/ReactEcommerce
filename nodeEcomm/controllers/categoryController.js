const categoryModel = require("../models/categoryModel")
const createCategory = async (req, res) => {
	let { name, status } = req.body;
	const categories = await categoryModel.findOne({ name });
	if (categories) {
		return res.status(400).json({ error: "Category already exists" });
	}
	if (!req.file) {
		return res.status(400).json({ error: "Image file is required" });
	}
	let image = req.file.filename;
	if (!name || !image || status === undefined) {
		return res.status(400).json({ error: "All fields are required" });
	}
	let category = await categoryModel.create({
		name,
		image,
		status
	});
	if (category) {
		res.status(201).json({
			message: "Category created successfully",
			data: category
		});
	}
}

const deleteCategory = async (req, res) => {
	let deletes = await categoryModel.findOneAndDelete({ _id: req.params.id });
	if (deletes) {
		res.status(200).json({
			message: "Category deleted successfully",
			data: deletes
		});
	} else {
		res.status(404).json({
			message: "Category not found"
		});
	}
};

const updateCategory = async (req, res) => {
	try {
		let { name, status } = req.body;
		let image = req.file ? req.file.filename : undefined;
		if (!name || status === undefined) {
			return res.status(400).json({ error: "All fields are required" });
		}
		let updateData = { name, status };
		if (image) {
			updateData.image = image;
		}
		let updatedCategory = await categoryModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
		if (updatedCategory) {
			res.status(200).json({
				message: "Category updated successfully",
				data: updatedCategory
			});
		} else {
			res.status(404).json({
				message: "Category not found"
			});
		}
	} catch (err) {
		res.status(500).json({ error: "Internal Server error", error: err.message });
	}
};

const getallCategories=async (req, res) => {
  try {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const skip = (page - 1) * limit;
	const total = await categoryModel.countDocuments();
	const totalPages = Math.ceil(total / limit);

	const category = await categoryModel.find()
	  .sort({ createdAt: -1 })
	  .skip(skip)
	  .limit(limit);

	res.json({
	  category,
	  totalPages,
	  currentPage: page,
	  totalItems: total
	});
  } catch (err) {
	res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { createCategory, deleteCategory, updateCategory, getallCategories };