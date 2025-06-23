import "@pathofdev/react-tag-input/build/index.css";
import React, { useState, useEffect } from "react";
import ReactTagInput from "@pathofdev/react-tag-input";
import Swal from 'sweetalert2';

// Modal component
function AddVariantModal({
    showModal,
    setShowModal,
    tags,
    setTags,
    onSubmit,
    initialVariant = "",
    initialStatus = true,
    editMode = false,
}) {
    const [variant, setVariant] = useState(initialVariant);
    const [status, setStatus] = useState(initialStatus);

    useEffect(() => {
        setVariant(initialVariant);
        setStatus(initialStatus);
    }, [initialVariant, initialStatus, showModal]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!variant.trim() || tags.length === 0) return;
        onSubmit({
            variant: variant,
            values: tags,
            status: status
        });
        setVariant("");
        setTags([]);
        setStatus(true);
        setShowModal(false);
    };

    return (
        <div
            className={`modal fade${showModal ? ' show' : ''}`}
            id="add-variant"
            aria-modal="true"
            role="dialog"
            style={{
                display: showModal ? 'block' : 'none',
                background: 'rgba(0,0,0,0.3)',
                zIndex: 1050
            }}
            tabIndex="-1"
        >
            <div className="modal-dialog modal-dialog-centered">
               
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="page-title">
                            <h4>{editMode ? "Edit Variant" : "Add Variant"}</h4>
                        </div>
                        <button
                            type="button"
                            className="close bg-danger text-white fs-16"
                            aria-label="Close"
                            onClick={() => setShowModal(false)}
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">
                                    Variant<span className="text-danger ms-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={variant}
                                    onChange={e => setVariant(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">
                                    Values<span className="text-danger ms-1">*</span>
                                </label>
                                <ReactTagInput
                                    tags={tags}
                                    onChange={setTags}
                                    placeholder="Type and press enter"
                                />
                            </div>
                            <div className="mb-0 mt-4">
                                <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                    <span className="status-label">Status</span>
                                    <input
                                        type="checkbox"
                                        id="user2"
                                        className="check"
                                        checked={status}
                                        onChange={() => setStatus(!status)}
                                    />
                                    <label htmlFor="user2" className="checktoggle"></label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn me-2 btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {editMode ? "Update Variant" : "Add Variant"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const Variants = () => {
    const [showModal, setShowModal] = useState(false);
    const [tags, setTags] = useState([]);
    const [variants, setVariants] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editVariantId, setEditVariantId] = useState(null);

    useEffect(() => {
        fetch("/api/variants")
            .then(res => res.json())
            .then(data => setVariants(data));
    }, []);

    // Add new variant (backend)
    const handleAddVariant = async (variantObj) => {
        const res = await fetch("/api/variants", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(variantObj),
        });
        if (res.ok) {
            const newVariant = await res.json();
            setVariants([...variants, newVariant]);
        }
    };

    // Edit variant (backend)
    const handleEditVariant = async (variantObj) => {
        const res = await fetch(`/api/variants/${editVariantId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(variantObj),
        });
        if (res.ok) {
            const updated = await res.json();
            setVariants(variants.map((v) =>
                v._id === editVariantId ? updated : v
            ));
            setEditIndex(null);
            setEditMode(false);
            setEditVariantId(null);
        }
    };

    // Delete variant (backend)
    const handleDeleteVariant = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            const res = await fetch(`/api/variants/${id}`, { method: "DELETE" });
            if (res.ok) {
                setVariants(variants.filter(v => v._id !== id));
                Swal.fire('Deleted!', 'Variant has been deleted.', 'success');
            } else {
                Swal.fire('Error!', 'Something went wrong.', 'error');
            }
        }
    };

    // Open edit modal
    const openEditModal = (idx) => {
        setEditIndex(idx);
        setEditMode(true);
        setTags(variants[idx].values);
        setEditVariantId(variants[idx]._id);
        setShowModal(true);
    };

    // Open add modal
    const openAddModal = () => {
        setEditMode(false);
        setTags([]);
        setShowModal(true);
    };

    return (
        <div className="page-wrapper pt-0" style={{ minHeight: '319px' }}>
            <div className="content ">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4 className="fw-bold">Variant Attributes</h4>
                            <h6>Manage your variant attributes</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        {/* ...existing code... */}
                    </ul>
                    <div className="page-btn">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={openAddModal}
                        >
                            <i className="ti ti-circle-plus me-1"></i>Add Variant
                        </button>
                    </div>
                </div>
                {/* /product list */}
                <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                        {/* ...existing code... */}
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
                                            <th>Variant</th>
                                            <th>Values</th>
                                            <th>Created Date</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variants.map((item, idx) => (
                                            <tr className="odd" key={item._id || idx}>
                                                <td className="sorting_1">
                                                    <label className="checkboxs">
                                                        <input type="checkbox" />
                                                        <span className="checkmarks"></span>
                                                    </label>
                                                </td>
                                                <td className="text-gray-9">{item.variant}</td>
                                                <td>{item.values.join(", ")}</td>
                                                <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : ""}</td>
                                                <td>
                                                    <span className={`badge table-badge fw-medium fs-10 ${item.status ? "bg-success" : "bg-danger"}`}>
                                                        {item.status ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="action-table-data">
                                                    <div className="edit-delete-action">
                                                        <a
                                                            className="me-2 p-2"
                                                            href="#"
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                openEditModal(idx);
                                                            }}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="feather feather-edit"
                                                            >
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                            </svg>
                                                        </a>
                                                        <a
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#delete-modal"
                                                            className="p-2"
                                                            href="javascript:void(0);"
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                 handleDeleteVariant(item._id);
                                                                }
                                                            }
                                                        >   
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="24"
                                                                height="24"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="feather feather-trash-2"
                                                            >
                                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* ...existing code for pagination, info, etc... */}
                            </div>
                        </div>
                    </div>
                </div>
                {showModal && (
                    <AddVariantModal
                        showModal={showModal}
                        setShowModal={setShowModal}
                        tags={tags}
                        setTags={setTags}
                        onSubmit={editMode ? handleEditVariant : handleAddVariant}
                        initialVariant={editMode && editIndex !== null ? variants[editIndex].variant : ""}
                        initialStatus={editMode && editIndex !== null ? variants[editIndex].status === "Active" : true}
                        editMode={editMode}
                    />
                )}
            </div>
        </div>
    );
};

export default Variants;