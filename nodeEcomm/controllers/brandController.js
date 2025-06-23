const BrandModel = require('../models/BrandModel');
const brandController=async (req, res) => {
  try {
	let { page = 1, limit = 10 } = req.query;
	page = parseInt(page);
	limit = parseInt(limit);

	const total = await BrandModel.countDocuments();
	const brands = await BrandModel.find()
	  .sort({ createdAt: -1 })
	  .skip((page - 1) * limit)
	  .limit(limit);

	res.json({
	  brands,
	  total,
	  page,
	  limit,
	  totalPages: Math.ceil(total / limit),
	});
  } catch (err) {
	res.status(500).json({ error: "Server error" });
  }
}

const createbrandController=async (req, res) => {
  try {
    const { name, status } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "Brand image is required" });
    }
    if (!name) {
      return res.status(400).json({ error: "Brand name is required" });
    }
    const image = req.file.filename;
    const statusBool = status === "true" || status === true || status === 1 || status === "Active";
    const brand = await BrandModel.create({
      name,
      image,
      status: typeof status === "undefined" ? true : statusBool,
    });
    res.status(201).json({ message: "Brand created successfully", brand });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

const updatebrandController=async (req, res) => {
  try {
	const { name, status } = req.body;
	const updateData = {};
	if (name) updateData.name = name;
	if (typeof status !== "undefined") {
	  updateData.status = status === "true" || status === true || status === 1 || status === "Active";
	}
	if (req.file) updateData.image = req.file.filename;

	const updated = await BrandModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
	if (updated) {
	  res.json({ message: "Brand updated successfully", brand: updated });
	} else {
	  res.status(404).json({ error: "Brand not found" });
	}
  } catch (err) {
	res.status(500).json({ error: "Server error" });
  }
}

const deletebrandController=async(req, res) => {
  try {
	const deleted = await BrandModel.findByIdAndDelete(req.params.id);
	if (deleted) {
	  res.json({ message: "Brand deleted successfully", brand: deleted });
	} else {
	  res.status(404).json({ error: "Brand not found" });
	}
  } catch (err) {
	res.status(500).json({ error: "Server error" });
  }
}
module.exports= {brandController, createbrandController, updatebrandController, deletebrandController};