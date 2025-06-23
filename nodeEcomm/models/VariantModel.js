const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  variant: {
    type: String,
    required: true,
    trim: true
  },
  values: [{
    type: String,
    required: true
  }],
  status: {
    type: Boolean,
    default: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Variant', variantSchema);