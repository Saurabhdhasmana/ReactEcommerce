const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variant: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" }, // optional
  price: { type: Number, required: true },
  gst: { type: Number, default: 0 },
  quantity: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  status: { type: String, enum: ["Pending", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
  deletedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("OrderItem", orderItemSchema);