const mongoose = require('mongoose');

const stockTransactionSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant: {
    variantName: String,
    variantValues: [String],
    sku: String
  },
  transactionType: { 
    type: String, 
    enum: ['IN', 'OUT', 'ADJUSTMENT', 'RETURN', 'DAMAGED'], 
    required: true 
  },
  quantity: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true }, // This is always based on openingStock now
  reason: { type: String, required: true },
  reference: String, // Order ID, Purchase ID, etc.
  notes: String,
  createdBy: String,
  transactionDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StockTransaction', stockTransactionSchema);
