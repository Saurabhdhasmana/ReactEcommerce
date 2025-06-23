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

module.exports= brandController;