import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Brand = () => {
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [showEditBrandModal, setShowEditBrandModal] = useState(false);
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({
    name: "",
    image: null,
    status: true,
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch brands from backend with pagination
  const fetchBrands = async (pg = page, lim = limit) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/brand?page=${pg}&limit=${lim}`);
      const data = await res.json();
      setBrands(data.brands || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || 1);
      setLimit(data.limit || 10);
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
    // eslint-disable-next-line
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (type === "file") {
      setForm(f => ({ ...f, image: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // Handle Add Brand submit
  const handleAddBrandSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("status", form.status);
    if (form.image) formData.append("image", form.image);

    try {
      await fetch("http://localhost:3000/api/brand", {
        method: "POST",
        body: formData,
      });
      setShowAddBrandModal(false);
      setForm({ name: "", image: null, status: true });
      fetchBrands(1, limit); // Go to first page after add
    } catch (err) {
      // handle error
    }
  };

  // Handle Edit Brand open
  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      name: item.name,
      image: null,
      status: item.status,
    });
    setShowEditBrandModal(true);
  };

  // Handle Edit Brand submit
  const handleEditBrandSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("status", form.status);
    if (form.image) formData.append("image", form.image);

    try {
      await fetch(`http://localhost:3000/api/brand/${editId}`, {
        method: "PUT",
        body: formData,
      });
      setShowEditBrandModal(false);
      setEditId(null);
      setForm({ name: "", image: null, status: true });
      fetchBrands(page, limit);
    } catch (err) {
      // handle error
    }
  };

  // Handle Delete Brand
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this brand!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`http://localhost:3000/api/brand/${id}`, {
            method: "DELETE",
          });
          Swal.fire('Deleted!', 'Brand has been deleted.', 'success');
          fetchBrands(page, limit);
        } catch (err) {
          Swal.fire('Error!', 'Something went wrong.', 'error');
        }
      }
    });
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchBrands(newPage, limit);
  };

  // Helper to get current image for edit modal
  const getEditImageUrl = () => {
    if (form.image) {
      return URL.createObjectURL(form.image);
    }
    const brand = brands.find(b => b._id === editId);
    if (brand && brand.image) {
      return brand.image.startsWith("http")
        ? brand.image
        : `http://localhost:3000/images/uploads/${brand.image}`;
    }
    return "assets/img/brand/lenova.png";
  };

  return (
    <div>
      <div className="page-wrapper pt-0">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4 className="fw-bold">Brand</h4>
                <h6>Manage your brands</h6>
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
              <a
                href="#"
                className="btn btn-primary"
                onClick={e => { e.preventDefault(); setShowAddBrandModal(true); }}
              >
                <i className="ti ti-circle-plus me-1"></i>Add Brand
              </a>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <div className="search-set">
                <div className="search-input">
                  <span className="btn-searchset">
                    <i className="ti ti-search fs-14 feather-search"></i>
                  </span>
                  <div id="DataTables_Table_0_filter" className="dataTables_filter">
                    <label>
                      {" "}
                      <input
                        type="search"
                        className="form-control form-control-sm"
                        placeholder="Search"
                        aria-controls="DataTables_Table_0"
                        // onChange={...} // implement if you want search
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                <div className="dropdown me-2">
                  <a
                    href="javascript:void(0);"
                    className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    Status
                  </a>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <a href="javascript:void(0);" className="dropdown-item rounded-1">
                        Active
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0);" className="dropdown-item rounded-1">
                        Inactive
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="dropdown">
                  <a
                    href="javascript:void(0);"
                    className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    Sort By : Latest
                  </a>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <a href="javascript:void(0);" className="dropdown-item rounded-1">
                        Latest
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0);" className="dropdown-item rounded-1">
                        Ascending
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0);" className="dropdown-item rounded-1">
                        Desending
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <div
                  id="DataTables_Table_0_wrapper"
                  className="dataTables_wrapper dt-bootstrap5 no-footer table-responsive"
                >
                  <table
                    className="table datatable dataTable no-footer"
                    id="DataTables_Table_0"
                    aria-describedby="DataTables_Table_0_info"
                  >
                    <thead className="thead-light">
                      <tr>
                        <th>
                          <label className="checkboxs">
                            <input type="checkbox" id="select-all" />
                            <span className="checkmarks"></span>
                          </label>
                        </th>
                        <th>Brand</th>
                        <th>Created Date</th>
                        <th>Status</th>
                       <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={5}>Loading...</td>
                        </tr>
                      ) : brands.length === 0 ? (
                        <tr>
                          <td colSpan={5}>No brands found.</td>
                        </tr>
                      ) : (
                        brands.map((item) => (
                          <tr className="odd" key={item._id}>
                            <td className="sorting_1">
                              <label className="checkboxs">
                                <input type="checkbox" />
                                <span className="checkmarks"></span>
                              </label>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <a href="javascript:void(0);" className="avatar avatar-md bg-light-900 p-1 me-2">
                                  <img
                                    className="object-fit-contain"
                                    src={
                                      item.image
                                        ? (item.image.startsWith("http") ? item.image : `http://localhost:3000/images/uploads/${item.image}`)
                                        : "assets/img/brand/lenova.png"
                                    }
                                    alt="img"
                                  />
                                </a>
                                <a href="javascript:void(0);">{item.name}</a>
                              </div>
                            </td>
                            <td>{new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                            <td>
                              <span className={`badge table-badge ${item.status ? "bg-success" : "bg-danger"} fw-medium fs-10`}>
                                {item.status ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="action-table-data">
                              <div className="edit-delete-action d-flex">
                                <button
                                  className="me-2 p-2"
                                  title="Edit"
                                  onClick={() => handleEdit(item)}
                                  style={{ background: "none", border: "none", cursor: "pointer" }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button
                                  className="p-2"
                                  title="Delete"
                                  onClick={() => handleDelete(item._id)}
                                  style={{ background: "none", border: "none", cursor: "pointer" }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {/* Pagination Controls */}
                  <div className="dataTables_paginate paging_simple_numbers d-flex justify-content-between align-items-center p-3">
                    <span>
                      Page {page} of {totalPages}
                    </span>
                    <ul className="pagination mb-0">
                      <li className={`paginate_button page-item previous${page === 1 ? ' disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => page > 1 && handlePageChange(page - 1)}
                          disabled={page === 1}
                        >
                          <i className="fa fa-angle-left"></i>
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, idx) => (
                        <li key={idx} className={`paginate_button page-item${page === idx + 1 ? ' active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(idx + 1)}
                            disabled={page === idx + 1}
                          >
                            {idx + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`paginate_button page-item next${page === totalPages ? ' disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => page < totalPages && handlePageChange(page + 1)}
                          disabled={page === totalPages}
                        >
                          <i className="fa fa-angle-right"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="dataTables_info" id="DataTables_Table_0_info" role="status" aria-live="polite">
                    {total > 0
                      ? `${(page - 1) * limit + 1} - ${Math.min(page * limit, total)} of ${total} items`
                      : "0 items"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Brand Modal */}
      {showAddBrandModal && (
        <div className="modal fade show" id="add-brand" aria-modal="true" role="dialog" style={{ display: "block", paddingLeft: 0 }}>
          <div className="modal-dialog modal-dialog-top">
            <div className="modal-content">
              <div className="modal-header">
                <div className="page-title">
                  <h4>Add Brand</h4>
                </div>
                <button
                  type="button"
                  className="close bg-danger text-white fs-16"
                  onClick={() => setShowAddBrandModal(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form onSubmit={handleAddBrandSubmit}>
                <div className="modal-body new-employee-field">
                  <div className="profile-pic-upload mb-3">
                    <div className="profile-pic brand-pic">
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle plus-down-add">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="16"></line>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg> Add Image
                      </span>
                    </div>
                    <div>
                      <div className="image-upload mb-0">
                        <input type="file" name="image" onChange={handleInputChange} />
                        <div className="image-uploads">
                          <h4>Upload Image</h4>
                        </div>
                      </div>
                      <p className="mt-2">JPEG, PNG up to 2 MB</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Brand<span className="text-danger ms-1">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status</span>
                      <input
                        type="checkbox"
                        id="user2"
                        className="check"
                        name="status"
                        checked={form.status}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="user2" className="checktoggle"></label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn me-2 btn-secondary" onClick={() => setShowAddBrandModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Brand</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Brand Modal */}
      {showEditBrandModal && (
        <div className="modal fade show" id="edit-brand" aria-modal="true" role="dialog" style={{ display: "block", paddingLeft: 0 }}>
          <div className="modal-dialog modal-dialog-top">
            <div className="modal-content">
              <div className="modal-header">
                <div className="page-title">
                  <h4>Edit Brand</h4>
                </div>
                <button
                  type="button"
                  className="close bg-danger text-white fs-16"
                  onClick={() => setShowEditBrandModal(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form onSubmit={handleEditBrandSubmit}>
                <div className="modal-body new-employee-field">
                  <div className="profile-pic-upload mb-3">
                    <div className="profile-pic brand-pic" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      {/* Image Preview */}
                      <img
                        src={getEditImageUrl()}
                        alt="Brand"
                        style={{ width: 60, height: 60, objectFit: "contain", borderRadius: 8, marginBottom: 8, background: "#f5f5f5" }}
                      />
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle plus-down-add">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="16"></line>
                          <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg> Update Image
                      </span>
                    </div>
                    <div>
                      <div className="image-upload mb-0">
                        <input type="file" name="image" onChange={handleInputChange} />
                        <div className="image-uploads">
                          <h4>Upload Image</h4>
                        </div>
                      </div>
                      <p className="mt-2">JPEG, PNG up to 2 MB</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Brand<span className="text-danger ms-1">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status</span>
                      <input
                        type="checkbox"
                        id="user2edit"
                        className="check"
                        name="status"
                        checked={form.status}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="user2edit" className="checktoggle"></label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn me-2 btn-secondary" onClick={() => setShowEditBrandModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Update Brand</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brand;