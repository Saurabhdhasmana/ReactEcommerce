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
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  /* ------------ Fetch Data ------------ */
  const fetchStockData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/stock/summary');
      const data = await response.json();
     console.log(data);
      setStockData(data);
      setFilteredData(data);
    } catch (error) {
      toast.error('Failed to fetch stock data');
      console.error(error);
    }
    setLoading(false);
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/stock/transactions?page=${page}&limit=${limit}`);
      
      console.log(data);
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/stock/alerts');
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

  /* ------------ Filter Logic ------------ */
  useEffect(() => {
    let filtered = stockData;
    
    // Filter by stock status
    if (filterType === 'low-stock') {
      filtered = filtered.filter(item => item.stockStatus === 'Low Stock');
    } else if (filterType === 'out-of-stock') {
      filtered = filtered.filter(item => item.currentStock === 0);
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

    try {
      const response = await fetch(
        `https://backend-darze-4.onrender.com/api/stock/update/${selectedItem.productId}/${selectedItem.sku}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stockForm)
        }
      );

      const result = await response.json();
      
      if (response.ok) {
        toast.success('Stock updated successfully!');
        setUpdateStockModal(false);
        setStockForm({ quantity: '', transactionType: 'IN', reason: '', notes: '' });
        setSelectedItem(null);
        fetchStockData();
        fetchAlerts();
      } else {
        toast.error(result.error || 'Failed to update stock');
      }
    } catch (error) {
      toast.error('Failed to update stock');
      console.error(error);
    }
  };

  const openUpdateModal = (item, variantIndex) => {
    setSelectedItem({ ...item, variantIndex });
    setUpdateStockModal(true);
  };

  /* ------------ Render ------------ */
  const getStockStatusBadge = (status, currentStock, minimumStock = 0, reorderLevel = 0) => {
    // Determine status based on stock levels
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
            <button className="btn btn-success me-2" onClick={() => setBulkUpdateModal(true)}>
              <i className="ti ti-upload me-1"></i>Bulk Update
            </button>
            <button className="btn btn-info me-2" onClick={() => setTransactionModal(true)}>
              <i className="ti ti-history me-1"></i>View Transactions
            </button>
          </div>
        </div>

        {/* Stock Alerts */}
        {alerts.length > 0 && (
          <div className="alert alert-warning alert-dismissible" role="alert">
            <strong>Stock Alerts!</strong> {alerts.length} products need attention:
            <ul className="mb-0 mt-2">
              {alerts.slice(0, 3).map((alert, index) => (
                <li key={index}>
                  {alert.productName} - {alert.variantName}: {alert.currentStock} units ({alert.alertType})
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
                <button className="btn btn-primary" onClick={fetchStockData}>
                  <i className="ti ti-refresh me-1"></i>Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Table */}
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead className="thead-light">
                  <tr>
                    <th>Product</th>
                    <th>Variant</th>
                    <th>SKU</th>
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
                      <td colSpan="10" className="text-center">Loading...</td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="text-center">No stock data found</td>
                    </tr>
                  ) : (
                    filteredData.map((item, index) => (
                     
                      <tr key={`${item.productId}-${index}`}>
                        <td>{item.productName}</td>
                        <td>{item.variantName}</td>
                        <td><code>{item.sku}</code></td>
                        <td>
                          <span className={`fw-bold ${
                            (typeof item.openingStock === 'number' && item.openingStock <= item.minimumStock)
                              ? 'text-danger' : 'text-success'}`}>
                            {typeof item.openingStock === 'number' ? item.openingStock : 0}
                          </span>
                        </td>
                        <td>{item.minimumStock}</td>
                        <td>{item.reorderLevel}</td>
                        <td>{getStockStatusBadge(item.stockStatus, item.openingStock, item.minimumStock, item.reorderLevel)}</td>
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
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label">Opening Stock</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={typeof selectedItem?.openingStock === 'number' ? selectedItem.openingStock : 0} 
                        readOnly 
                      />
                    </div>
                    <div className="col-md-6">
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
                          <td>{item.currentStock}</td>
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
