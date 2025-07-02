# Stock Management - Recommended Values

## For Product with Opening Stock = 35 units

### Variant 1: Blue s
- **Opening Stock**: 35
- **Min Stock**: 10 (28% of opening stock)
- **Reorder Level**: 20 (57% of opening stock)

### Variant 2: Red s  
- **Opening Stock**: 35
- **Min Stock**: 10
- **Reorder Level**: 20

## General Formula:

### Small Inventory (35-100 units):
- **Min Stock** = 20-30% of Opening Stock
- **Reorder Level** = 50-60% of Opening Stock

### Medium Inventory (100-500 units):
- **Min Stock** = 15-25% of Opening Stock  
- **Reorder Level** = 40-50% of Opening Stock

### Large Inventory (500+ units):
- **Min Stock** = 10-20% of Opening Stock
- **Reorder Level** = 30-40% of Opening Stock

## Stock Status Logic:

1. **In Stock**: Current > Reorder Level
2. **Reorder Alert**: Current ≤ Reorder Level
3. **Low Stock**: Current ≤ Min Stock  
4. **Out of Stock**: Current = 0

## Example for your image:
- Opening Stock: 35
- **Fill Min Stock**: 10
- **Fill Reorder Level**: 20

When stock reaches:
- 35-21: ✅ In Stock (Green badge)
- 20: ⚠️ Reorder Alert (Blue badge) 
- 10: 🚨 Low Stock Alert (Yellow badge)
- 0: ❌ Out of Stock (Red badge)
