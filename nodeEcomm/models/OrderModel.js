const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],
  totalAmount: { type: Number, required: true },
  totalQuantity: { type: Number, required: true },
  totalDiscount: { type: Number, default: 0 },
  status: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
  payment_method: { type: String },
  transaction_id: { type: String },
  order_date: { type: Date, default: Date.now },
  delivery_date: { type: Date },
  cancelled_date: { type: Date },
  reasons: { type: String },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);