const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!', timestamp: new Date() });
});

// Mock stock summary for testing
app.get('/api/stock/summary', (req, res) => {
  res.json([
    {
      productId: 'test123',
      productName: 'Test Product',
      variantName: 'Default',
      sku: 'TEST-001',
      openingStock: 100,
      currentStock: 75,
      minimumStock: 10,
      reorderLevel: 20,
      stockStatus: 'In Stock',
      category: 'Test Category',
      brand: 'Test Brand'
    }
  ]);
});

// Mock stock update for testing
app.put('/api/stock/update/:productId/:sku', (req, res) => {
  const { productId, sku } = req.params;
  const { quantity, transactionType, reason, notes } = req.body;
  
  console.log('Stock update request received:');
  console.log('Product ID:', productId);
  console.log('SKU:', sku);
  console.log('Body:', req.body);
  
  // Mock calculation
  let previousStock = 75;
  let newStock = previousStock;
  
  switch (transactionType) {
    case 'IN':
      newStock = previousStock + parseInt(quantity);
      break;
    case 'OUT':
      newStock = previousStock - parseInt(quantity);
      break;
    case 'ADJUSTMENT':
      newStock = parseInt(quantity);
      break;
  }
  
  console.log('Previous Stock:', previousStock);
  console.log('New Stock:', newStock);
  
  res.json({
    message: 'Stock updated successfully',
    variant: {
      variantName: 'Default',
      previousStock: previousStock,
      newStock: newStock,
      stockStatus: newStock === 0 ? 'Out of Stock' : 
                   newStock <= 10 ? 'Low Stock' : 
                   newStock <= 20 ? 'Reorder Level' : 'In Stock'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
});
