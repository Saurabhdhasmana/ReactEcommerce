import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const StockManagement = () => {
  /* ------------ State ------------ */
  const [stockData, setStockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  // Filters
  const [filterType, setFilterType] = useState('all'); // all, low-stock, out-of-stock
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [updateStockModal, setUpdateStockModal] = useState(false);
  const [transactionModal, setTransactionModal] = useState(false);
  const [bulkUpdateModal, setBulkUpdateModal] = useState(false);
  
  // Current selected item for stock update
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockForm, setStockForm] = useState({
    quantity: '',
    transactionType: 'IN',
    reason: '',
    notes: ''
  });
  
  // Auto refresh state
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  /* ------------ Fetch Data ------------ */
  const fetchStockData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stock/summary');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Stock summary response:', data);
      setStockData(data);
      setFilteredData(data);
      setLastUpdate(new Date());
      
      if (data.length > 0) {
        toast.success(`Loaded ${data.length} products`, { autoClose: 1000 });
      }
    } catch (error) {
      console.error('Fetch stock data error:', error);
      
      if (error.message.includes('ECONNRESET') || error.message.includes('fetch')) {
        toast.error('Backend server is not running. Please start the Node.js server on port 3000.');
      } else {
        toast.error('Failed to fetch stock data');
      }
      
      // Set empty data on error
      setStockData([]);
      setFilteredData([]);
    }
    setLoading(false);
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/stock/transactions?page=${page}&limit=${limit}`);
      const data = await response.json();
      console.log(data);
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/stock/alerts');
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  useEffect(() => {
    fetchStockData();
    fetchAlerts();
  }, []);

  // Auto refresh effect
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        console.log('Auto refreshing stock data...');
        fetchStockData();
      }, 3000); // Refresh every 3 seconds when enabled
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  /* ------------ Filter Logic ------------ */
  useEffect(() => {
    let filtered = stockData;
    
    // Filter by stock status
    if (filterType === 'low-stock') {
      filtered = filtered.filter(item => item.stockStatus === 'Low Stock');
    } else if (filterType === 'out-of-stock') {
      filtered = filtered.filter(item => (item.currentStock || 0) === 0);
    } else if (filterType === 'reorder') {
      filtered = filtered.filter(item => item.stockStatus === 'Reorder');
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.variantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredData(filtered);
  }, [filterType, searchTerm, stockData]);

  /* ------------ Stock Update ------------ */
  const handleStockUpdate = async (e) => {
    e.preventDefault();
    
    if (!selectedItem || !stockForm.quantity || !stockForm.reason) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate quantity is a positive number
    const quantity = Number(stockForm.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    try {
      console.log('=== STOCK UPDATE DEBUG ===');
      console.log('Selected Item:', selectedItem);
      console.log('Product ID:', selectedItem.productId);
      console.log('SKU:', selectedItem.sku);
      console.log('Current Stock Before:', selectedItem.currentStock);
      console.log('Form Data:', stockForm);
      console.log('Quantity (parsed):', quantity);
      
      // Clean SKU - remove any extra characters
      const cleanSku = selectedItem.sku ? selectedItem.sku.toString().trim() : '';
      
      if (!cleanSku) {
        toast.error('SKU not found for this product');
        return;
      }
      
      const apiUrl = `/api/stock/update/${selectedItem.productId}/${cleanSku}`;
      console.log('API URL:', apiUrl);
      
      const requestBody = {
        quantity: quantity,
        transactionType: stockForm.transactionType,
        reason: stockForm.reason,
        notes: stockForm.notes
      };
      
      console.log('Request Body:', requestBody);
      
      // Show loading state
      toast.info('Updating stock...');
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error Response Text:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Success Response:', result);
      
      // Calculate expected new stock for verification
      let expectedStock = selectedItem.currentStock || 0;
      switch (stockForm.transactionType) {
        case 'IN':
          expectedStock += quantity;
          break;
        case 'OUT':
          expectedStock -= quantity;
          break;
        case 'ADJUSTMENT':
          expectedStock = quantity;
          break;
      }
      
      console.log('Expected New Stock:', expectedStock);
      console.log('Actual New Stock from API:', result.variant?.newStock);
      
      if (result.variant?.newStock !== expectedStock) {
        console.warn('Stock calculation mismatch!');
      }
      
      // Immediately update the stock in local state for instant feedback
      const newStockValue = result.variant?.newStock || expectedStock;
      
      setStockData(prevData => 
        prevData.map(item => {
          if (item.productId === selectedItem.productId && item.sku === selectedItem.sku) {
            console.log('Updating local stock from', item.currentStock, 'to', newStockValue);
            return { 
              ...item, 
              currentStock: newStockValue,
              stockStatus: newStockValue === 0 ? 'Out of Stock' : 
                          newStockValue <= (item.minimumStock || 5) ? 'Low Stock' : 
                          newStockValue <= (item.reorderLevel || 10) ? 'Reorder Level' : 'In Stock'
            };
          }
          return item;
        })
      );
      
      setFilteredData(prevData => 
        prevData.map(item => {
          if (item.productId === selectedItem.productId && item.sku === selectedItem.sku) {
            return { 
              ...item, 
              currentStock: newStockValue,
              stockStatus: newStockValue === 0 ? 'Out of Stock' : 
                          newStockValue <= (item.minimumStock || 5) ? 'Low Stock' : 
                          newStockValue <= (item.reorderLevel || 10) ? 'Reorder Level' : 'In Stock'
            };
          }
          return item;
        })
      );
      
      toast.success(`Stock updated! ${selectedItem.productName} stock: ${selectedItem.currentStock || 0} → ${newStockValue}`);
      setUpdateStockModal(false);
      setStockForm({ quantity: '', transactionType: 'IN', reason: '', notes: '' });
      setSelectedItem(null);
      
      // Background refresh to sync with backend
      setTimeout(async () => {
        console.log('Background refresh after stock update...');
        await fetchStockData();
        await fetchAlerts();
      }, 1000);
      
    } catch (error) {
      console.error('=== STOCK UPDATE ERROR ===');
      console.error('Error Details:', error);
      console.error('Error Message:', error.message);
      
      if (error.message.includes('fetch')) {
        toast.error('Backend server is not running! Please start the server first.');
      } else if (error.message.includes('404')) {
        toast.error('Product or variant not found in database');
      } else if (error.message.includes('400')) {
        toast.error('Invalid request data');
      } else {
        toast.error(`Update failed: ${error.message}`);
      }
    }
  };

  const openUpdateModal = (item, variantIndex) => {
    setSelectedItem({ ...item, variantIndex });
    setUpdateStockModal(true);
  };

  /* ------------ Render ------------ */
  const getStockStatusBadge = (status, currentStock, minimumStock = 0, reorderLevel = 0) => {
    // Determine status based on current stock levels
    if (currentStock === 0) {
      return <span className="badge bg-danger">Out of Stock</span>;
    } else if (currentStock <= minimumStock) {
      return <span className="badge bg-warning">Low Stock</span>;
    } else if (currentStock <= reorderLevel) {
      return <span className="badge bg-info">Reorder Level</span>;
    } else {
      return <span className="badge bg-success">In Stock</span>;
    }
  };

  return (
    <div className="page-wrapper pt-0">
      <div className="content">
        {/* Header */}
        <div className="page-header">
          <div className="page-title">
            <h4 className="fw-bold">Stock Management</h4>
            <h6>Manage product stock levels and inventory</h6>
          </div>
          <div className="page-btn">
            <button className="btn btn-warning me-2" onClick={async () => {
              try {
                console.log('Testing backend connection...');
                const response = await fetch('/api/stock/summary');
                console.log('Test response status:', response.status);
                console.log('Test response ok:', response.ok);
                
                if (response.ok) {
                  const data = await response.json();
                  console.log('Test response data:', data);
                  toast.success(`Backend connected! Found ${data.length} stock items`);
                } else {
                  throw new Error(`HTTP ${response.status}`);
                }
              } catch (error) {
                console.error('Connection test failed:', error);
                toast.error('Backend server not running on port 3000. Please start: node app.js');
              }
            }}>
              <i className="ti ti-wifi me-1"></i>Test Connection
            </button>
            <button className="btn btn-success me-2" onClick={() => setBulkUpdateModal(true)}>
              <i className="ti ti-upload me-1"></i>Bulk Update
            </button>
            <button className="btn btn-info me-2" onClick={() => setTransactionModal(true)}>
              <i className="ti ti-history me-1"></i>View Transactions
            </button>
          </div>
        </div>

        {/* Connection Error Alert */}
        {stockData.length === 0 && !loading && (
          <div className="alert alert-danger" role="alert">
            <strong>Backend Connection Error!</strong> 
            <p className="mb-2">The backend server is not running. Please start it by:</p>
            <ol className="mb-2">
              <li>Open a new terminal/command prompt</li>
              <li>Navigate to: <code>c:\Users\ccc\Documents\Github\ReactEcommerce\nodeEcomm</code></li>
              <li>Run: <code>npm start</code> or <code>node app.js</code></li>
              <li>Wait for "Server is running on port 3000" message</li>
              <li>Click "Test Connection" button above</li>
            </ol>
          </div>
        )}

        {/* Stock Alerts */}
        {alerts.length > 0 && (
          <div className="alert alert-warning alert-dismissible" role="alert">
            <strong>Stock Alerts!</strong> {alerts.length} products need attention:
            <ul className="mb-0 mt-2">
              {alerts.slice(0, 3).map((alert, index) => (
                <li key={index}>
                  {alert.productName} - {alert.variantName}: {alert.currentStock || 0} units ({alert.alertType})
                </li>
              ))}
              {alerts.length > 3 && <li>...and {alerts.length - 3} more</li>}
            </ul>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-5">
                <label className="form-label">Filter by Stock Status</label>
                <select 
                  className="form-select" 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Products</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="reorder">Reorder Level</option>
                </select>
              </div>
              <div className="col-md-5">
                <label className="form-label">Search Products</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search by product name, variant, or SKU"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button 
                  className={`btn me-2 ${autoRefresh ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  title={autoRefresh ? 'Auto refresh ON' : 'Auto refresh OFF'}
                >
                  <i className={`ti ${autoRefresh ? 'ti-refresh' : 'ti-refresh-off'} me-1`}></i>
                  {autoRefresh ? 'Auto ON' : 'Auto OFF'}
                </button>
                <button className="btn btn-primary" onClick={fetchStockData}>
                  <i className="ti ti-refresh me-1"></i>Refresh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Table */}
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Stock Inventory</h5>
            <div className="d-flex align-items-center">
              {autoRefresh && (
                <span className="badge bg-success me-2">
                  <i className="ti ti-refresh me-1"></i>Auto Refreshing
                </span>
              )}
              {lastUpdate && (
                <small className="text-muted">
                  Last updated: {new Date(lastUpdate).toLocaleTimeString()}
                </small>
              )}
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead className="thead-light">
                  <tr>
                    <th>Product</th>
                    <th>Variant</th>
                    <th>SKU</th>
                    <th>Opening Stock</th>
                    <th>Current Stock</th>
                    <th>Min Stock</th>
                    <th>Reorder Level</th>
                    <th>Status</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="11" className="text-center">Loading...</td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center">No stock data found</td>
                    </tr>
                  ) : (
                    filteredData.map((item, index) => (
                     
                      <tr key={`${item.productId}-${index}`}>
                        <td>{item.productName}</td>
                        <td>{item.variantName}</td>
                        <td><code>{item.sku}</code></td>
                        <td>
                          <span className="fw-bold text-info">
                            {typeof item.openingStock === 'number' ? item.openingStock : 0}
                          </span>
                        </td>
                        <td>
                          <span className={`fw-bold ${
                            (typeof item.currentStock === 'number' && item.currentStock <= item.minimumStock)
                              ? 'text-danger' : 'text-success'}`}>
                            {typeof item.currentStock === 'number' ? item.currentStock : 0}
                          </span>
                        </td>
                        <td>{item.minimumStock}</td>
                        <td>{item.reorderLevel}</td>
                        <td>{getStockStatusBadge(item.stockStatus, item.currentStock, item.minimumStock, item.reorderLevel)}</td>
                        <td>{item.category}</td>
                        <td>{item.brand}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => openUpdateModal(item, index)}
                          >
                            <i className="ti ti-edit"></i> Update Stock
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Update Modal */}
      {updateStockModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Update Stock - {selectedItem?.productName} ({selectedItem?.variantName})</h5>
                <button 
                  className="close bg-danger text-white"
                  onClick={() => setUpdateStockModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleStockUpdate}>
                <div className="modal-body">
                  {/* Debug Info */}
                  <div className="alert alert-info mb-3">
                    <small>
                      <strong>Debug Info:</strong><br/>
                      Product ID: {selectedItem?.productId}<br/>
                      SKU: {selectedItem?.sku}<br/>
                      Current Stock: {selectedItem?.currentStock}
                    </small>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-4">
                      <label className="form-label">Opening Stock</label>
                      <input 
                        type="text" 
                        className="form-control bg-light" 
                        value={typeof selectedItem?.openingStock === 'number' ? selectedItem.openingStock : 0} 
                        readOnly 
                      />
                      <small className="text-muted">Original stock (read-only)</small>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Current Stock</label>
                      <input 
                        type="text" 
                        className="form-control bg-warning" 
                        value={typeof selectedItem?.currentStock === 'number' ? selectedItem.currentStock : 0} 
                        readOnly 
                      />
                      <small className="text-muted">Will be updated after transaction</small>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Transaction Type*</label>
                      <select 
                        className="form-select" 
                        value={stockForm.transactionType}
                        onChange={(e) => setStockForm({...stockForm, transactionType: e.target.value})}
                        required
                      >
                        <option value="IN">Stock In (+)</option>
                        <option value="OUT">Stock Out (-)</option>
                        <option value="ADJUSTMENT">Adjustment (Set Exact)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Quantity*</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={stockForm.quantity}
                      onChange={(e) => setStockForm({...stockForm, quantity: e.target.value})}
                      required
                      min="0"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Reason*</label>
                    <select 
                      className="form-select" 
                      value={stockForm.reason}
                      onChange={(e) => setStockForm({...stockForm, reason: e.target.value})}
                      required
                    >
                      <option value="">Select Reason</option>
                      <option value="Purchase">New Purchase</option>
                      <option value="Sale">Sale</option>
                      <option value="Return">Customer Return</option>
                      <option value="Damaged">Damaged Goods</option>
                      <option value="Adjustment">Stock Adjustment</option>
                      <option value="Transfer">Stock Transfer</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      value={stockForm.notes}
                      onChange={(e) => setStockForm({...stockForm, notes: e.target.value})}
                      placeholder="Additional notes (optional)"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setUpdateStockModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Stock
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Modal */}
      {transactionModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Stock Transactions History</h5>
                <button 
                  className="close bg-danger text-white"
                  onClick={() => setTransactionModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <button 
                  className="btn btn-primary mb-3"
                  onClick={fetchTransactions}
                >
                  Load Transactions
                </button>
                
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Product</th>
                        <th>Variant</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Previous</th>
                        <th>New Stock</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <tr key={index}>
                          <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                          <td>{transaction.product?.name}</td>
                          <td>{transaction.variant?.variantName}</td>
                          <td>
                            <span className={`badge ${
                              transaction.transactionType === 'IN' ? 'bg-success' : 
                              transaction.transactionType === 'OUT' ? 'bg-danger' : 'bg-warning'
                            }`}>
                              {transaction.transactionType}
                            </span>
                          </td>
                          <td>{transaction.quantity}</td>
                          <td>{transaction.previousStock}</td>
                          <td>{transaction.newStock}</td>
                          <td>{transaction.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Update Modal */}
      {bulkUpdateModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Bulk Stock Update</h5>
                <button 
                  className="close bg-danger text-white"
                  onClick={() => setBulkUpdateModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <strong>Instructions:</strong>
                  <ul className="mb-0 mt-2">
                    <li>Select multiple products from the table below</li>
                    <li>Set transaction type and quantity</li>
                    <li>All selected items will be updated with same values</li>
                  </ul>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Transaction Type*</label>
                    <select className="form-select">
                      <option value="IN">Stock In (+)</option>
                      <option value="OUT">Stock Out (-)</option>
                      <option value="ADJUSTMENT">Adjustment</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Quantity*</label>
                    <input type="number" className="form-control" min="0" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Reason*</label>
                    <select className="form-select">
                      <option value="">Select Reason</option>
                      <option value="Bulk Purchase">Bulk Purchase</option>
                      <option value="Bulk Sale">Bulk Sale</option>
                      <option value="Inventory Adjustment">Inventory Adjustment</option>
                      <option value="Stock Transfer">Stock Transfer</option>
                    </select>
                  </div>
                </div>
                
                <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th><input type="checkbox" /></th>
                        <th>Product</th>
                        <th>Variant</th>
                        <th>Current Stock</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.slice(0, 20).map((item, index) => (
                        <tr key={index}>
                          <td><input type="checkbox" /></td>
                          <td>{item.productName}</td>
                          <td>{item.variantName}</td>
                          <td>{item.currentStock || 0}</td>
                          <td>{getStockStatusBadge(item.stockStatus, item.currentStock, item.minimumStock, item.reorderLevel)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setBulkUpdateModal(false)}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-success">
                  Update Selected Items
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
