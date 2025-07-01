import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
const ComboProduct = () => {
  /* ------------ state ------------ */
  const [products, setProducts] = useState([]);
  const [combos, setCombos] = useState([]);

  const [form, setForm] = useState({
    name: "",
    status: true,
    comboProducts: [],          // array of product objects
  });

  const [editData, setEditData] = useState({
    _id: "",
    name: "",
    status: true,
    comboProducts: [],
  });

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  /* pagination */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  /* product search query (for tags) */
  const [query, setQuery] = useState("");
  const [editQuery, setEditQuery] = useState("");

  /* ------------ fetch data ------------ */
  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  useEffect(() => {
    console.log(products);
  }, [products]);

  const fetchCombos = (pg = page) => {
    fetch(`https://backend-darze-4.onrender.com/api/combos?page=${pg}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        setCombos(data.combos || data);       // backend may send {combos,totalPages}
        setTotalPages(data.totalPages || 1);
      })
      .catch(console.error);
  };
  useEffect(() => { fetchCombos(page); }, [page]);

  /* ------------ helpers ------------ */
  const resetForm = () => {
    setForm({ name: "", status: true, comboProducts: [] });
    setQuery("");
  };
  const resetEdit = () => {
    setEditData({ _id: "", name: "", status: true, comboProducts: [] });
    setEditQuery("");
  };

  /* tag ops */
  const addToForm = (prod) => {
    if (!form.comboProducts.find(p => p._id === prod._id))
      setForm(f => ({ ...f, comboProducts: [...f.comboProducts, prod] }));
    setQuery("");
  };
  const removeFromForm = id =>
    setForm(f => ({ ...f, comboProducts: f.comboProducts.filter(p => p._id !== id) }));

  const addToEdit = (prod) => {
    if (!editData.comboProducts.find(p => p._id === prod._id))
      setEditData(ed => ({ ...ed, comboProducts: [...ed.comboProducts, prod] }));
    setEditQuery("");
  };
  const removeFromEdit = id =>
    setEditData(ed => ({ ...ed, comboProducts: ed.comboProducts.filter(p => p._id !== id) }));

  /* ------------ submit ------------ */
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await fetch("https://backend-darze-4.onrender.com/api/combos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        status: form.status,
        comboProducts: form.comboProducts.map(p => p._id)
      })
    });
    setAddModalOpen(false); resetForm(); setPage(1); fetchCombos(1);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await fetch(`https://backend-darze-4.onrender.com/api/combos/${editData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editData.name,
        status: editData.status,
        comboProducts: editData.comboProducts.map(p => p._id)
      })
    });
    setEditModalOpen(false); fetchCombos(page);
  };

  const handleDelete = async id => {
    const ok = (await Swal.fire({
      title: "Delete?", text: "Combo will be removed", icon: "warning",
      showCancelButton: true, confirmButtonText: "Yes"
    })).isConfirmed;
    if (!ok) return;
    await fetch(`https://backend-darze-4.onrender.com/api/combos/${id}`, { method: "DELETE" });
    fetchCombos(page);
    Swal.fire("Deleted", "", "success");
  };

  /* ------------ render ------------ */
  return (
    <div className="page-wrapper pt-0">
      <div className="content">
        {/* header */}
        <div className="page-header">
          <div className="page-title">
            <h4 className="fw-bold">Combo Product</h4>
            <h6>Manage combo products</h6>
          </div>
          <div className="page-btn">
            <a href="#"
              className="btn btn-primary"
              onClick={e => { e.preventDefault(); setAddModalOpen(true); }}>
              <i className="ti ti-circle-plus me-1"></i>Add Combo Product
            </a>
          </div>
        </div>

        {/* table */}
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable dataTable no-footer" id="ComboProductTable">
                <thead className="thead-light">
                  <tr>
                    <th>Name</th>
                    <th>Products</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {combos.length === 0 ? (
                    <tr><td colSpan={4} className="text-center">No combos found.</td></tr>
                  ) : (
                    combos.map(c => (
                      <tr key={c._id}>
                        <td><span className="text-gray-9">{c.name}</span></td>
                        <td>{c.comboProducts.map(p => p.name).join(", ")}</td>
                        <td>
                          <span className={`badge ${c.status ? "bg-success" : "bg-danger"}`}>
                            {c.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="action-table-data">
                          <div className="edit-delete-action">
                            <button className="me-2 p-2 btn btn-link" style={{ boxShadow: 'none' }}
                              onClick={() => {
                                setEditData({
                                  _id: c._id,
                                  name: c.name,
                                  status: c.status,
                                  comboProducts: c.comboProducts
                                });
                                setEditModalOpen(true);
                              }}>
                              {/* Edit SVG */}
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button className="p-2 btn btn-link" style={{ boxShadow: 'none' }}
                              onClick={() => handleDelete(c._id)}>
                              {/* Trash SVG */}
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            <div className="d-flex justify-content-between p-3">
              <span>Page {page} of {totalPages}</span>
              <ul className="pagination mb-0">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button className="page-link" disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}>&laquo;</button></li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                    <button className="page-link"
                      onClick={() => setPage(i + 1)}>{i + 1}</button></li>
                ))}
                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}>&raquo;</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* -------------- ADD MODAL -------------- */}
      {addModalOpen && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-top">
            <div className="modal-content">
              <div className="modal-header">
                <h4>Add Combo Product</h4>
                <button className="close bg-danger text-white"
                  onClick={() => { setAddModalOpen(false); resetForm(); }}>×</button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body">
                  {/* name */}
                  <div className="mb-3">
                    <label className="form-label">Name*</label>
                    <input className="form-control" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>

                  {/* products tag selector */}
                  <div className="mb-3">

                    {/* chips */}
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {form.comboProducts.map(p => (

                        <button type="button" className="btn-close btn-close-white btn-sm position-absolute top-0 end-0 translate-middle"
                          style={{ fontSize: 8 }}
                          onClick={() => removeFromForm(p._id)} />

                      ))}
                    </div>
                    {/* search */}
                    <div className="mb-3">
                      <label className="form-label">Products*</label>
                      <Select
                        isMulti
                        options={products.map(p => ({ value: p._id, label: p.name }))}
                        value={form.comboProducts.map(p => ({ value: p._id, label: p.name }))}
                        onChange={selected =>
                          setForm({
                            ...form,
                            comboProducts: selected.map(s => products.find(p => p._id === s.value)),
                          })
                        }
                        classNamePrefix="react-select"
                        placeholder="Select products..."
                      />
                    </div>


                  </div>

                  {/* status */}
                  <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                    <span className="status-label">Status<span className="text-danger ms-1">*</span></span>
                    <input
                      id="addStatus"
                      className="check"
                      type="checkbox"
                      name="status"
                      checked={form.status}
                      onChange={() => setForm({ ...form, status: !form.status })}
                    />
                    <label htmlFor="addStatus" className="checktoggle"></label>
                  </div>

                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary me-2"
                    onClick={() => { setAddModalOpen(false); resetForm(); }}
                    type="button">Cancel</button>
                  <button className="btn btn-primary" type="submit">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* -------------- EDIT MODAL -------------- */}
      {editModalOpen && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-top">
            <div className="modal-content">
              <div className="modal-header">
                <h4>Edit Combo Product</h4>
                <button className="close bg-danger text-white"
                  onClick={() => { setEditModalOpen(false); resetEdit(); }}>×</button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name*</label>
                    <input className="form-control" value={editData.name}
                      onChange={e => setEditData({ ...editData, name: e.target.value })} />
                  </div>

                  {/* tag selector */}
                  <div className="mb-3">
                    <label className="form-label">Products*</label>
                    <Select
                      isMulti
                      options={products.map(p => ({ value: p._id, label: p.name }))}
                      value={editData.comboProducts.map(p => ({ value: p._id, label: p.name }))}
                      onChange={selected =>
                        setEditData(ed => ({
                          ...ed,
                          comboProducts: selected.map(s =>
                            products.find(p => p._id === s.value)
                          )
                        }))
                      }
                      classNamePrefix="react-select"
                      placeholder="Select products..."
                    />
                  </div>


                  <div className="d-flex justify-content-between align-items-center">
                    <span>Status</span>
                    <input type="checkbox" className="check"
                      checked={editData.status}
                      onChange={() => setEditData({ ...editData, status: !editData.status })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary me-2"
                    onClick={() => { setEditModalOpen(false); resetEdit(); }}
                    type="button">Cancel</button>
                  <button className="btn btn-primary" type="submit">Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboProduct;
