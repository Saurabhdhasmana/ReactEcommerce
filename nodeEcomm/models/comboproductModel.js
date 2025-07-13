const mongoose = require("mongoose");


const ComboProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  comboProducts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  ],
  images: [{ type: String }], // Array of image filenames/URLs for the combo
  status: { type: Boolean, default: true },
},{timestamps: true});

module.exports = mongoose.model("ComboProduct", ComboProductSchema);
