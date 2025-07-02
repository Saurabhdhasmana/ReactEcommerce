import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ProductForm from "./Product";
import { API_BASE_URL, IMAGE_BASE_URL } from "../config/api";

const Allproduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false); // <-- Add this
  const [editProduct, setEditProduct] = useState(null); // <-- Add this
  // Fetch products from backend
  const fetchProducts = () => {
    fetch(`${API_BASE_URL}/api/product`)
      .then(res => res.json())
      .then(data => setProducts(data.reverse()));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Edit icon click handler
  const handleEditClick = (product) => {
    setEditProduct(product);
    setShowProductForm(true);
  };

  const handleSoftDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      await fetch(`${API_BASE_URL}/api/product/soft-delete/${id}`, {
        method: "PUT"
      });
      setProducts(products => products.filter(p => p._id !== id));
      Swal.fire("Deleted!", "Product has been deleted.", "success");
    }
  };

  return (
    <div className="page-wrapper pt-0">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Product List</h4>
              <h6>Manage your products</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Pdf" data-bs-original-title="Pdf">
                <img src="assets/img/icons/pdf.svg" alt="img" />
              </a>
            </li>
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Excel" data-bs-original-title="Excel">
                <img src="assets/img/icons/excel.svg" alt="img" />
              </a>
            </li>
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Refresh" data-bs-original-title="Refresh">
                <i className="ti ti-refresh"></i>
              </a>
            </li>
            <li>
              <a data-bs-toggle="tooltip" data-bs-placement="top" id="collapse-header" aria-label="Collapse" data-bs-original-title="Collapse">
                <i className="ti ti-chevron-up"></i>
              </a>
            </li>
          </ul>

          <div className="page-btn">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/products")}
            >
              <i className="ti ti-circle-plus me-1"></i>Add Product
            </button>

          </div>
          <div className="page-btn import">
            <a href="#" className="btn btn-secondary color" data-bs-toggle="modal" data-bs-target="#view-notes">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download me-1">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Import Product
            </a>
          </div>
        </div>

        {/* Product Table */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <div className="search-input">
                <span className="btn-searchset">
                  <i className="ti ti-search fs-14 feather-search"></i>
                </span>
                <div id="DataTables_Table_0_filter" className="dataTables_filter">
                  <label>
                    <input
                      type="search"
                      className="form-control form-control-sm"
                      placeholder="Search"
                      aria-controls="DataTables_Table_0"
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
              <div className="dropdown me-2">
                <a href="#" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Category
                </a>
                <ul className="dropdown-menu dropdown-menu-end p-3">
                  <li>
                    <a href="#" className="dropdown-item rounded-1">Computers</a>
                  </li>
                  <li>
                    <a href="#" className="dropdown-item rounded-1">Electronics</a>
                  </li>
                  <li>
                    <a href="#" className="dropdown-item rounded-1">Shoe</a>
                  </li>
                  <li>
                    <a href="#" className="dropdown-item rounded-1">Electronics</a>
                  </li>
                </ul>
              </div>
              <div className="dropdown">
                <a href="#" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  Brand
                </a>
                <ul className="dropdown-menu dropdown-menu-end p-3">
                  <li>
                    <a href="#" className="dropdown-item rounded-1">Lenovo</a>
                  </li>
                  <li>
                    <a href="#" className="dropdown-item rounded-1">Beats</a>
                  </li>
                  <li>
                    <a href="#" className="dropdown-item rounded-1">Nike</a>
                  </li>
                  <li>
                    <a href="#" className="dropdown-item rounded-1">Apple</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="card-body p-0">

            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Product Image</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>MRP Price</th>
                    <th>Sale Price</th>
                    <th>GST (in %)</th>
                    <th>Unit</th>
                   
                    <th>Created At</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={11} className="text-center">No products found.</td>
                    </tr>
                  )}
                  {products.map(product => {
                    // Always show main product info (no per-variant rows)
                    return (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {product.image && (
                              <img
                                src={`${IMAGE_BASE_URL}/${product.image}`}
                                alt={product.name}
                                style={{ width: 40, height: 40, objectFit: "cover", marginRight: 8, borderRadius: 4 }}
                              />
                            )}
                          </div>
                        </td>
                        <td>{typeof product.category === "object" ? product.category?.name : product.category}</td>
                        <td>{typeof product.brand === "object" ? product.brand?.name : product.brand}</td>
                        <td>{product?.mrpPrice}</td>
                        <td>{product?.salePrice}</td>
                        <td>{product?.gst}%</td>
                        <td>{product?.unit || 0}</td>

                        <td>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : ""}</td>
                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <a className="me-2 edit-icon  p-2" href="product-details.html">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            </a>
                            <a className="me-2 p-2"
                              href="#"
                              onClick={e => {
                                e.preventDefault();
                                handleEditClick(product);
                              }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </a>
                            <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" href="javascript:void(0);" onClick={() => handleSoftDelete(product._id)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>
            {showProductForm && (
              <div className="modal-backdrop" style={{
                position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
              }}>
                <div className="modal-content" style={{
                  background: "#fff", padding: 24, borderRadius: 8, minWidth: 600, maxHeight: "100vh", overflowY: "auto"
                }}>
                  <ProductForm
                    editProduct={editProduct}
                    onProductUpdated={() => {
                      setShowProductForm(false);
                      fetchProducts();
                    }}
                    onClose={() => setShowProductForm(false)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allproduct;