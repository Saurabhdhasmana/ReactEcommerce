const mongoose=require("mongoose");

const brandSchema=mongoose.Schema({
name: {
		type: String,
		required: [true, "Brand name is required"],
	},
	image: {
		type: String,
		required: [true, "Brand image is required"],
	},
	status: {
		type: Boolean,
		default: true,
	},
}, { timestamps: true });

module.exports=mongoose.model("brand", brandSchema);