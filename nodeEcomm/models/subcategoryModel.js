const mongoose = require('mongoose');

const subcategorySchema=mongoose.Schema({
	name: {
		type: String,
		required: [true, "Subcategory name is required"],
	},
	image: {
		type: String,
		required: [true, "Subcategory image is required"],
	},
	status: {
		type: Boolean,
		default: true,
	},
	categoryCode: {
		type: String,
		required: [true, "Category code is required"],
		unique: true,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'category',
		required: [true, "Category ID is required"],
	},
 description: { type: String, required: true }, 
},
	{
		timestamps: true
	});
module.exports = mongoose.model('subcategory', subcategorySchema);