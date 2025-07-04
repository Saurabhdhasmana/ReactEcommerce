import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const StockDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalVariants: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalStockValue: 0,
    recentTransactions: []
  });
  const [editTransaction, setEditTransaction] = useState(null);
  const [editForm, setEditForm] = useState({ quantity: '', reason: '', notes: '', transactionType: '' });
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const fetchDashboardData = async (customPage = page, customRows = rowsPerPage) => {
    setLoading(true);
    try {
      // Fetch stock summary
      const stockResponse = await fetch('https://backend-darze-4.onrender.com/api/stock/summary');
      const stockData = await stockResponse.json();

      // Fetch paginated stock transactions
      const transactionsResponse = await fetch(`https://backend-darze-4.onrender.com/api/stock/transactions?page=${customPage}&limit=${customRows}`);
      const transactionsData = await transactionsResponse.json();

      // Calculate metrics
      const totalVariants = stockData.length;
      const lowStockItems = stockData.filter(item => 
        item.stockStatus === 'Low Stock' || item.stockStatus === 'Reorder Level'
      ).length;
      const outOfStockItems = stockData.filter(item => item.openingStock === 0).length;
      const uniqueProducts = [...new Set(stockData.map(item => item.productId))].length;

      // Calculate total stock value (if you have price data)
      const totalStockValue = stockData.reduce((sum, item) => {
        return sum + (item.openingStock * (item.salePrice || 0));
      }, 0);

      setDashboardData({
        totalProducts: uniqueProducts,
        totalVariants,
        lowStockItems,
        outOfStockItems,
        totalStockValue,
        recentTransactions: transactionsData.transactions || []
      });
      setTotalTransactions(transactionsData.total || (transactionsData.transactions ? transactionsData.transactions.length : 0));
      setEditTransaction(null);
      setEditForm({ quantity: '', reason: '', notes: '', transactionType: '' });

    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData(page, rowsPerPage);
    // eslint-disable-next-line
  }, [page, rowsPerPage]);

  if (loading) {
    return (
      <div className="page-wrapper pt-0">
        <div className="content">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper pt-0">
      <div className="content">
        {/* Header */}
        <div className="page-header">
          <div className="page-title">
            <h4 className="fw-bold">Stock Dashboard</h4>
            <h6>Overview of inventory status and metrics</h6>
          </div>
          <div className="page-btn">
            <button className="btn btn-primary" onClick={fetchDashboardData}>
              <i className="ti ti-refresh me-1"></i>Refresh Data
            </button>
          </div>
        </div>

        {/* Stock Metrics Cards */}
        <div className="row mb-4">
          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-primary border-primary">
                    <i className="ti ti-package"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{dashboardData.totalProducts}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Total Products</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-primary" style={{ width: "100%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-success border-success">
                    <i className="ti ti-variants"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{dashboardData.totalVariants}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Total Variants</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-success" style={{ width: "100%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-warning border-warning">
                    <i className="ti ti-alert-triangle"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{dashboardData.lowStockItems}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Low Stock Items</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-warning" style={{ 
                      width: `${(dashboardData.lowStockItems / dashboardData.totalVariants) * 100}%` 
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 col-12">
            <div className="card">
              <div className="card-body">
                <div className="dash-widget-header">
                  <span className="dash-widget-icon text-danger border-danger">
                    <i className="ti ti-x-circle"></i>
                  </span>
                  <div className="dash-count">
                    <h3>{dashboardData.outOfStockItems}</h3>
                  </div>
                </div>
                <div className="dash-widget-info">
                  <h6 className="text-muted">Out of Stock</h6>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-danger" style={{ 
                      width: `${(dashboardData.outOfStockItems / dashboardData.totalVariants) * 100}%` 
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Value Card */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Total Stock Value</h5>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="avatar avatar-lg bg-primary-light me-3">
                    <i className="ti ti-currency-rupee fs-24"></i>
                  </div>
                  <div>
                    <h2 className="text-primary mb-1">₹{dashboardData.totalStockValue.toLocaleString()}</h2>
                    <p className="text-muted mb-0">Current inventory value</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Stock Status Distribution</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-4">
                    <div className="border-end">
                      <h4 className="text-success">{dashboardData.totalVariants - dashboardData.lowStockItems - dashboardData.outOfStockItems}</h4>
                      <p className="text-muted mb-0 fs-12">In Stock</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="border-end">
                      <h4 className="text-warning">{dashboardData.lowStockItems}</h4>
                      <p className="text-muted mb-0 fs-12">Low Stock</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <h4 className="text-danger">{dashboardData.outOfStockItems}</h4>
                    <p className="text-muted mb-0 fs-12">Out of Stock</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Recent Stock Transactions</h5>
          </div>
          <div className="card-body">
            {dashboardData.recentTransactions.length === 0 ? (
              <p className="text-muted text-center">No recent transactions found.</p>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Product</th>
                        <th>Variant</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Reason</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentTransactions.map((transaction, index) => (
                        <tr key={index}>
                          <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                          <td>{transaction.product?.name}</td>
                          <td>{transaction.variant?.variantName}</td>
                          <td>
                            <span className={`badge badge-sm ${
                              transaction.transactionType === 'IN' ? 'bg-success' : 
                              transaction.transactionType === 'OUT' ? 'bg-danger' : 'bg-warning'
                            }`}>
                              {transaction.transactionType}
                            </span>
                          </td>
                          <td>{transaction.quantity}</td>
                          <td>{transaction.reason}</td>
                          <td>
                            <button className="btn btn-sm btn-primary" onClick={() => {
                              setEditTransaction(transaction);
                              setEditForm({
                                quantity: transaction.quantity,
                                reason: transaction.reason,
                                notes: transaction.notes || '',
                                transactionType: transaction.transactionType
                              });
                            }}>Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* dreamspos style pagination at the bottom */}
                <nav className="d-flex justify-content-between align-items-center mt-3" aria-label="Page navigation" style={{ borderTop: '1px solid #eee', paddingTop: 12, background: '#f8f9fa', borderRadius: 8 }}>
                  <div className="d-flex align-items-center">
                    <span style={{ fontWeight: 500 }}>Rows per page:</span>
                    <select
                      value={rowsPerPage}
                      onChange={e => {
                        setRowsPerPage(Number(e.target.value));
                        setPage(1);
                      }}
                      className="form-select d-inline-block ms-2"
                      style={{ width: 80, display: 'inline-block', height: 32, fontSize: 14, background: '#fff', border: '1px solid #ced4da', borderRadius: 4 }}
                    >
                      {[5, 10, 20, 50, 100, 200, 500, 1000].map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="d-flex align-items-center ms-auto">
                    <ul className="pagination mb-0" style={{ background: 'transparent', marginBottom: 0 }}>
                      <li className={`page-item${page === 1 ? ' disabled' : ''}`}
                          style={{ marginRight: 2 }}>
                        <button className="page-link" style={{ borderRadius: 4, color: '#fff', background: '#ff9f43', border: 'none', opacity: page === 1 ? 0.5 : 1 }} onClick={() => setPage(1)} disabled={page === 1}>&laquo;</button>
                      </li>
                      <li className={`page-item${page === 1 ? ' disabled' : ''}`}
                          style={{ marginRight: 2 }}>
                        <button className="page-link" style={{ borderRadius: 4, color: '#ff9f43', background: '#fff3e0', border: '1px solid #ff9f43', opacity: page === 1 ? 0.5 : 1 }} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>&lsaquo;</button>
                      </li>
                      <li className="page-item disabled">
                        <span className="page-link" style={{ minWidth: 50, textAlign: 'center', fontWeight: 500, background: 'transparent', border: 'none', color: '#ff9f43' }}>{page}</span>
                      </li>
                      <li className={`page-item${page >= Math.ceil(totalTransactions / rowsPerPage) ? ' disabled' : ''}`}
                          style={{ marginLeft: 2 }}>
                        <button className="page-link" style={{ borderRadius: 4, color: '#ff9f43', background: '#fff3e0', border: '1px solid #ff9f43', opacity: page >= Math.ceil(totalTransactions / rowsPerPage) ? 0.5 : 1 }} onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(totalTransactions / rowsPerPage)}>&rsaquo;</button>
                      </li>
                      <li className={`page-item${page >= Math.ceil(totalTransactions / rowsPerPage) ? ' disabled' : ''}`}
                          style={{ marginLeft: 2 }}>
                        <button className="page-link" style={{ borderRadius: 4, color: '#fff', background: '#ff9f43', border: 'none', opacity: page >= Math.ceil(totalTransactions / rowsPerPage) ? 0.5 : 1 }} onClick={() => setPage(Math.ceil(totalTransactions / rowsPerPage))} disabled={page >= Math.ceil(totalTransactions / rowsPerPage)}>&raquo;</button>
                      </li>
                    </ul>
                  </div>
                </nav>
              </>
            )}
          </div>
        </div>

        {/* Edit Transaction Modal */}
        {editTransaction && (
          <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="modal-content" style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 400, maxWidth: 500 }}>
              <div className="modal-header">
                <h5>Edit Stock Transaction</h5>
                <button className="btn-close" onClick={() => setEditTransaction(null)}></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await fetch(`http://localhost:3000/api/stock/transactions/${editTransaction._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(editForm)
                  });
                  const data = await res.json();
                  if (res.ok) {
                    toast.success('Transaction updated!');
                    setEditTransaction(null);
                    fetchDashboardData();
                  } else {
                    toast.error(data.error || 'Failed to update');
                  }
                } catch (err) {
                  toast.error('Failed to update');
                }
              }}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Transaction Type</label>
                    <select className="form-select" value={editForm.transactionType} onChange={e => setEditForm(f => ({ ...f, transactionType: e.target.value }))} required>
                      <option value="IN">Stock In (+)</option>
                      <option value="OUT">Stock Out (-)</option>
                      <option value="ADJUSTMENT">Adjustment</option>
                      <option value="RETURN">Return</option>
                      <option value="DAMAGED">Damaged</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input type="number" className="form-control" value={editForm.quantity} onChange={e => setEditForm(f => ({ ...f, quantity: e.target.value }))} required min="1" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <input type="text" className="form-control" value={editForm.reason} onChange={e => setEditForm(f => ({ ...f, reason: e.target.value }))} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <textarea className="form-control" value={editForm.notes} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditTransaction(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDashboard;
