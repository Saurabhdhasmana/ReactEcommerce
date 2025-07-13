// Script to update all products/variants to ensure currentStock is set (if missing)
// Usage: node scripts/fixCurrentStock.js

const mongoose = require('mongoose');
const Product = require('../models/productModel');
const db = require('../config/mongoose');

(async () => {
  try {
    const products = await Product.find({});
    let updatedCount = 0;
    for (const product of products) {
      let updated = false;
      // For products with variants
      if (Array.isArray(product.variants) && product.variants.length > 0) {
        for (const variant of product.variants) {
          if (variant.openingStock !== undefined && (variant.currentStock === undefined || variant.currentStock === null)) {
            variant.currentStock = variant.openingStock;
            updated = true;
          }
        }
      } else {
        // For products without variants
        if (product.openingStock !== undefined && (product.currentStock === undefined || product.currentStock === null)) {
          product.currentStock = product.openingStock;
          updated = true;
        }
      }
      if (updated) {
        await product.save();
        updatedCount++;
      }
    }
    console.log(`Updated ${updatedCount} products.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
