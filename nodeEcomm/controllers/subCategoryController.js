const subcategoryModel = require("../models/subcategoryModel");
const subCategoryController = async (req, res) => {
	try {
		let { name, status, category, description } = req.body;
		
		if (!req.file) {
			return res.status(400).json({ error: "Image file is required" });
		}
		let image = req.file.filename;
		if (!name || !image || !category || !description) {
			return res.status(400).json({ error: "All fields are required" });
		}
		let statusBool = status === "true" || status === true || status === 1 || status === "Active";
		let last4 = category.slice(-4);
		let random2 = Math.random().toString(16).slice(2, 4); // 2 random hex chars
		let categoryCode = `${last4}${random2}`; // Example: "c903fa"

		console.log("Category Code:", categoryCode);
		let subcat = await subcategoryModel.create({
			name,
			image,
			status: statusBool,
			categoryCode,
			category,
			description
		});
		console.log(subcat);
		if (subcat) {
			res.status(201).json({
				message: "Subcategory created successfully",
				subcategory: subcat
			});
		} else {
			res.status(400).json({
				message: "Failed to create subcategory"
			});
		}
	} catch (err) {
		console.error("Subcategory create error:", err);
		res.status(500).json({ error: "Server error", details: err.message });
	}
}


const getAllSubCategories = async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const skip = (page - 1) * limit;
	const total = await subcategoryModel.countDocuments();
	const totalPages = Math.ceil(total / limit);

	const subcategories = await subcategoryModel.find()
		.populate('category', 'name')
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit);

res.json({
  subcategories,
  totalPages,
  currentPage: page,
  totalItems: total
});

}

const updateSubCategory = async (req, res) => {
	try {
		const { name, status, category, description } = req.body;
		const { id } = req.params;

		// Find existing subcategory
		let subcat = await subcategoryModel.findById(id);
		if (!subcat) {
			return res.status(404).json({ error: "Subcategory not found" });
		}

		// Update fields
		if (name) subcat.name = name;
		if (category) subcat.category = category;
		if (description) subcat.description = description;
		if (typeof status !== "undefined") subcat.status = status === "true" || status === true || status === 1 || status === "Active";
		if (req.file) subcat.image = req.file.filename;

		await subcat.save();

		// Populate category for frontend if needed
		await subcat.populate("category");

		res.json({ message: "Subcategory updated", subcategory: subcat });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
}

const deleteSubCategory = async (req, res) => {
	try {
		const deleted = await subcategoryModel.findByIdAndDelete(req.params.id);
		if (deleted) {
			res.status(200).json({
				message: "Subcategory deleted successfully",
				data: deleted
			});
		} else {
			res.status(404).json({
				message: "Subcategory not found"
			});
		}
	} catch (err) {
		res.status(500).json({ error: "Server error" });
	}
}
module.exports = { subCategoryController, getAllSubCategories, updateSubCategory, deleteSubCategory }; // Export the subCategoryController and getAllSubCategories
