import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const SubcategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [form, setForm] = useState({
    category: "",
    name: "",
    description: "",
    status: true,
    image: null,
    categoryCode: ""
  });

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
    category: "",
    name: "",
    description: "",
    status: true,
    image: null,
    categoryCode: ""
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Fetch categories (no pagination)
  useEffect(() => {
    fetch('http://localhost:3000/api/category')
      .then(res => res.json())
      .then(data => setCategories(data.category || []))
      .catch(err => console.error(err));
  }, []);

  // Fetch subcategories with pagination
  const fetchSubcategories = (pg = page) => {
    fetch(`http://localhost:3000/api/subcategory?page=${pg}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        setSubcategories(data.subcategories || []);
        setTotalPages(data.totalPages || 1);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchSubcategories(page);
    // eslint-disable-next-line
  }, [page]);

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (type === "file") {
      setForm(f => ({ ...f, image: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleEditChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setEditData(f => ({ ...f, [name]: checked }));
    } else if (type === "file") {
      setEditData(f => ({ ...f, image: files[0] }));
    } else {
      setEditData(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category", form.category);
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("status", form.status);
    if (form.image) formData.append("image", form.image);

    const res = await fetch("http://localhost:3000/api/subcategory", {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      setAddModalOpen(false);
      setForm({
        category: "",
        name: "",
        description: "",
        status: true,
        image: null,
        categoryCode: ""
      });
      setPage(1); // Show new item on first page
      fetchSubcategories(1);
    } else {
      alert("Failed to add subcategory");
    }
  };

  const handleEdit = (item) => {
    setEditData({
      _id: item._id,
      category: item.category?._id || item.category,
      name: item.name,
      description: item.description,
      status: item.status,
      image: null,
      categoryCode: item.categoryCode || ""
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category", editData.category);
    formData.append("name", editData.name);
    formData.append("description", editData.description);
    formData.append("status", editData.status);
    if (editData.image) formData.append("image", editData.image);

    const res = await fetch(`http://localhost:3000/api/subcategory/${editData._id}`, {
      method: "PUT",
      body: formData
    });

    if (res.ok) {
      setEditModalOpen(false);
      fetchSubcategories(page); // Refetch after update
    } else {
      Swal.fire("Error!", "Failed to update subcategory.", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      const res = await fetch(`http://localhost:3000/api/subcategory/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchSubcategories(page);
        Swal.fire("Deleted!", "Subcategory has been deleted.", "success");
      } else {
        Swal.fire("Error!", "Failed to delete subcategory.", "error");
      }
    }
  };

  return (
    <div>
      <div className="page-wrapper pt-0">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4 className="fw-bold">Sub Category</h4>
                <h6>Manage your sub categories</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <a data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Pdf" data-bs-original-title="Pdf"><img src="assets/img/icons/pdf.svg" alt="img" /></a>
              </li>
              <li>
                <a data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Excel" data-bs-original-title="Excel"><img src="assets/img/icons/excel.svg" alt="img" /></a>
              </li>
              <li>
                <a data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Refresh" data-bs-original-title="Refresh"><i className="ti ti-refresh"></i></a>
              </li>
              <li>
                <a data-bs-toggle="tooltip" data-bs-placement="top" id="collapse-header" aria-label="Collapse" data-bs-original-title="Collapse"><i className="ti ti-chevron-up"></i></a>
              </li>
            </ul>
            <div className="page-btn">
              <a
                href="#"
                className="btn btn-primary"
               
                onClick={e => { e.preventDefault(); setAddModalOpen(true); }}
              >
                <i className="ti ti-circle-plus me-1"></i>Add Sub Category
              </a>
            </div>
          </div>

          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table datatable dataTable no-footer" id="DataTables_Table_0">
                  <thead className="thead-light">
                    <tr>
                      <th>
                        <label className="checkboxs">
                          <input type="checkbox" id="select-all" />
                          <span className="checkmarks"></span>
                        </label>
                      </th>
                      <th>Image</th>
                      <th>Sub Category</th>
                      <th>Category</th>
                      <th>Category Code</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subcategories.length === 0 ? (
                      <tr>
                        <td colSpan={8}>No subcategories found.</td>
                      </tr>
                    ) : (
                      subcategories.map(item => (
                        <tr key={item._id}>
                          <td>
                            <label className="checkboxs">
                              <input type="checkbox" />
                              <span className="checkmarks"></span>
                            </label>
                          </td>
                          <td>
                            <span className="avatar avatar-md me-2">
                              <img
                                src={item.image ? `http://localhost:3000/images/uploads/${item.image}` : "/assets/img/products/stock-img-01.png"}
                                alt={item.name}
                                width={40}
                                height={40}
                                style={{ objectFit: "cover" }}
                              />
                            </span>
                          </td>
                          <td>{item.name}</td>
                          <td>
                            {item.category && typeof item.category === 'object'
                              ? item.category.name
                              : item.category}
                          </td>
                          <td>{item.categoryCode}</td>
                          <td>{item.description}</td>
                          <td>
                            <span className={`badge ${item.status ? "bg-success" : "bg-danger"} fw-medium fs-10`}>
                              {item.status ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="action-table-data">
                            <div className="edit-delete-action">
                              <a
                                className="me-2 p-2"
                                href="#"
                                onClick={e => { e.preventDefault(); handleEdit(item); }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                              </a>
                              <a
                                className="p-2"
                                href="javascript:void(0)"
                                onClick={() => handleDelete(item._id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              <div className="dataTables_paginate paging_simple_numbers d-flex justify-content-between align-items-center p-3">
                <span>
                  Page {page} of {totalPages}
                </span>
                <ul className="pagination mb-0">
                  <li className={`paginate_button page-item previous${page === 1 ? ' disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => page > 1 && setPage(page - 1)}
                      disabled={page === 1}
                    >
                      <i className="fa fa-angle-left"></i>
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, idx) => (
                    <li key={idx} className={`paginate_button page-item${page === idx + 1 ? ' active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setPage(idx + 1)}
                        disabled={page === idx + 1}
                      >
                        {idx + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`paginate_button page-item next${page === totalPages ? ' disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => page < totalPages && setPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      <i className="fa fa-angle-right"></i>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD MODAL */}
      {addModalOpen && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Subcategory</h4>
                <button type="button" className="close bg-danger text-white fs-16" onClick={() => setAddModalOpen(false)}>
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <div className="add-image-upload">
                      <div
                        className="add-image"
                        style={{
                          width: 120,
                          height: 120,
                          position: "relative",
                          background: "#f3f3f3",
                          borderRadius: 10,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {form.image ? (
                          <img
                            src={URL.createObjectURL(form.image)}
                            alt={form.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block"
                            }}
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle plus-down-add"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                        )}
                      </div>
                      <div className="new-employee-field">
                        <div className="mb-0">
                          <div className="image-upload mb-2">
                            <input type="file" name="image" onChange={handleChange} />
                            <div className="image-uploads">
                              <h4 className="fs-13 fw-medium">Upload Image</h4>
                            </div>
                          </div>
                          <span>JPEG, PNG up to 2 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category<span className="text-danger ms-1">*</span></label>
                    <select
                      className="form-select"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Sub Category<span className="text-danger ms-1">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category Code<span className="text-danger ms-1">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="categoryCode"
                      value={form.categoryCode}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description<span className="text-danger ms-1">*</span></label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="mb-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status</span>
                      <input
                        type="checkbox"
                        id="add-status"
                        className="check"
                        name="status"
                        checked={form.status}
                        onChange={handleChange}
                      />
                      <label htmlFor="add-status" className="checktoggle"></label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn me-2 btn-secondary" onClick={() => setAddModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Subcategory</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalOpen && (
        <div className="modal fade show" id="edit-category" aria-modal="true" role="dialog" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="page-title">
                  <h4>Edit Sub Category</h4>
                </div>
                <button
                  type="button"
                  className="close bg-danger text-white fs-16"
                  onClick={() => setEditModalOpen(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <div className="add-image-upload">
                      <div
                        className="add-image"
                        style={{
                          width: 120,
                          height: 120,
                          position: "relative",
                          background: "#f3f3f3",
                          borderRadius: 10,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {editData && editData._id ? (
                          <img
                            src={
                              editData.image
                                ? URL.createObjectURL(editData.image)
                                : `http://localhost:3000/images/uploads/${subcategories.find(sc => sc._id === editData._id)?.image}`
                            }
                            alt={editData.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block"
                            }}
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle plus-down-add"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                        )}
                      </div>
                      <div className="new-employee-field">
                        <div className="mb-0">
                          <div className="image-upload mb-2">
                            <input type="file" name="image" onChange={handleEditChange} />
                            <div className="image-uploads">
                              <h4 className="fs-13 fw-medium">Upload Image</h4>
                            </div>
                          </div>
                          <span>JPEG, PNG up to 2 MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category<span className="text-danger ms-1">*</span></label>
                    <select
                      className="form-select"
                      name="category"
                      value={editData.category}
                      onChange={handleEditChange}
                    >
                      <option value="">Select</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Sub Category<span className="text-danger ms-1">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category Code<span className="text-danger ms-1">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="categoryCode"
                      value={editData.categoryCode}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description<span className="text-danger ms-1">*</span></label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={editData.description}
                      onChange={handleEditChange}
                    ></textarea>
                  </div>
                  <div className="mb-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status</span>
                      <input
                        type="checkbox"
                        id="edit-status"
                        className="check"
                        name="status"
                        checked={editData.status}
                        onChange={handleEditChange}
                      />
                      <label htmlFor="edit-status" className="checktoggle"></label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn me-2 btn-secondary" onClick={() => setEditModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Update Sub Category</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SubcategoryTable;