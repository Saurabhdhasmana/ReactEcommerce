const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Coupon name
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true }, // Coupon code
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  maxUses: { type: Number, required: true }, // Kitne users use kar sakte hain (total uses)
  usedCount: { type: Number, default: 0 }, // Ab tak kitni baar use hua
  usersUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Jin users ne use kiya
  minOrderAmount: { type: Number, default: 0 }, // Kitni amount pe apply hoga
//products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Kis product pe valid hai
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);