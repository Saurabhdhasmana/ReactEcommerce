const mongoose = require("mongoose");

const ComboProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  comboProducts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  ],
  status: { type: Boolean, default: true },
},{timestamps: true});

module.exports = mongoose.model("ComboProduct", ComboProductSchema);
