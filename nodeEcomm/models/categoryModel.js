const mongoose = require("mongoose");

const catgeorySchema=mongoose.Schema({
	name: {
		type: String,
		required: [true, "Category name is required"],
	},
	image: {
		type: String,
		required: [true, "Category image is required"],
	},
	status: {
		type: Boolean,
		default: true,
	},
}, { timestamps: true });

module.exports=mongoose.model("category", catgeorySchema);