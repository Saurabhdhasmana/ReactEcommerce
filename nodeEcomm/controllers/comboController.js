const ComboProduct= require("../models/comboproductModel");

const comboController = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { productId } = req.query;

  try {
	let query = {};
	if (productId) {
	  query.comboProducts = productId;
	}
	// Populate comboProducts with all price fields: salePrice, mrpPrice, name, image
	const combos = await ComboProduct.find(query)
	  .sort({ createdAt: -1 })
	  .skip((page - 1) * limit)
	  .limit(limit)
	  .populate("comboProducts", "name image salePrice mrpPrice")
	  .lean();

	const total = await ComboProduct.countDocuments(query);

	res.json({
	  combos,
	  totalPages: Math.ceil(total / limit)
	});
  } catch (err) {
	res.status(500).json({ error: "Server error", details: err.message });
  }
}


const createcomboController=async (req, res) => {
  try {
	const { name, comboProducts, status } = req.body;
	// Handle uploaded images
	let images = [];
	if (req.files && req.files.length > 0) {
	  images = req.files.map(f => f.filename);
	} else if (req.body.images) {
	  // If images are sent as string/array in body (for non-upload)
	  if (Array.isArray(req.body.images)) images = req.body.images;
	  else if (typeof req.body.images === 'string') images = [req.body.images];
	}
	const combo = await ComboProduct.create({ name, comboProducts, status, images });
	res.status(201).json(combo);
  } catch (err) {
	res.status(400).json({ error: err.message });
  }
}

const updatecomboController = async (req, res) => {
  try {
	const { name, comboProducts, status } = req.body;
	let images = [];
	if (req.files && req.files.length > 0) {
	  images = req.files.map(f => f.filename);
	} else if (req.body.images) {
	  if (Array.isArray(req.body.images)) images = req.body.images;
	  else if (typeof req.body.images === 'string') images = [req.body.images];
	}
	const updateData = { name, comboProducts, status };
	if (images.length > 0) updateData.images = images;
	const combo = await ComboProduct.findByIdAndUpdate(req.params.id, updateData, {
	  new: true
	});
	res.json(combo);
  } catch (err) {
	res.status(400).json({ error: err.message });
  }
}

const deletecomboController = async (req, res) => {
  await ComboProduct.findByIdAndDelete(req.params.id);
  res.json({ message: "Combo deleted" });
}

module.exports = {comboController, createcomboController, updatecomboController, deletecomboController};