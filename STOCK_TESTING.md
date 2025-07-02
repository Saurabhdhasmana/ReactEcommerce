# Stock Management APIs Testing

## 1. Initialize Stock (One-time setup)
POST http://localhost:3000/api/stock/initialize
Content-Type: application/json

{}

### Response:
{
  "message": "Stock data initialized for X products",
  "updated": 5
}

## 2. Get Stock Summary (Main table data)
GET http://localhost:3000/api/stock/summary

### Response:
[
  {
    "productId": "product123",
    "productName": "iPhone 15",
    "variantName": "Black 128GB",
    "sku": "IPH-BLK-128",
    "currentStock": 50,
    "minimumStock": 5,
    "reorderLevel": 10,
    "stockStatus": "In Stock",
    "category": "Electronics",
    "brand": "Apple"
  }
]

## 3. Update Stock
PUT http://localhost:3000/api/stock/update/{productId}/{variantIndex}
Content-Type: application/json

{
  "quantity": 20,
  "transactionType": "IN",
  "reason": "New Purchase",
  "notes": "Received new stock"
}

## 4. Get Stock Alerts
GET http://localhost:3000/api/stock/alerts

## 5. Get Transaction History
GET http://localhost:3000/api/stock/transactions?page=1&limit=50
