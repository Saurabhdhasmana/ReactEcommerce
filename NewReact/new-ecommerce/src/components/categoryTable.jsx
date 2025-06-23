import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CategoryTable = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState(true);
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);
    const [editCategory, setEditCategory] = useState(null);
    const [editName, setEditName] = useState('');
    const [editStatus, setEditStatus] = useState(true);
    const [editImage, setEditImage] = useState(null);
    // Modal state
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const fetchCategories = (pageNum = 1) => {
        fetch(`http://localhost:3000/api/category?page=${pageNum}&limit=${limit}`)
            .then(res => res.json())
            .then(data => {
                setCategories(data.category);
                setTotalPages(data.totalPages);
                setPage(data.currentPage);
            });
    };

    useEffect(() => {
        fetchCategories(page);
    }, [page]);

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`http://localhost:3000/api/category/${id}`, {
                        method: 'DELETE',
                    });
                    if (res.ok) {
                        fetchCategories();
                        Swal.fire('Deleted!', 'Category has been deleted.', 'success');
                    } else {
                        Swal.fire('Error!', 'Delete failed.', 'error');
                    }
                } catch (err) {
                    Swal.fire('Error!', 'Server error.', 'error');
                }
            }
        });
    };

    // Open Edit Modal
    const openEditModal = (cat) => {
        setEditCategory(cat);
        setEditName(cat.name);
        setEditStatus(cat.status);
        setEditImage(null);
        setEditModalOpen(true);
    };

    // Close modals
    const closeAddModal = () => {
        setAddModalOpen(false);
        setMessage('');
        setName('');
        setImage(null);
        setStatus(true);
    };
    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditCategory(null);
        setEditName('');
        setEditStatus(true);
        setEditImage(null);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', editName);
        formData.append('status', editStatus);
        if (editImage) {
            formData.append('image', editImage);
        }
        try {
            const res = await fetch(`http://localhost:3000/api/category/${editCategory._id}`, {
                method: 'PUT',
                body: formData,
            });
            if (res.ok) {
                fetchCategories();
                closeEditModal();
                Swal.fire('Updated!', 'Category updated successfully.', 'success');
            } else {
                Swal.fire('Error!', 'Update failed.', 'error');
            }
        } catch (err) {
            Swal.fire('Error!', 'Server error.', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', image);
        formData.append('status', status);

        try {
            const res = await fetch('http://localhost:3000/api/category', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Category added successfully!');
                fetchCategories();
                closeAddModal();
                navigate('/category');
            } else {
                setMessage(data.error || 'Something went wrong');
            }
        } catch (err) {
            setMessage('Server error');
        }
    };

    // Modal backdrop for accessibility
    const ModalBackdrop = () => (
        <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
    );

    return (
        <div className="page-wrapper pt-0">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4 className="fw-bold">Category</h4>
                            <h6>Manage your categories</h6>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <a><img src="assets/img/icons/pdf.svg" alt="img" /></a>
                        </li>
                        <li>
                            <a><img src="assets/img/icons/excel.svg" alt="img" /></a>
                        </li>
                        <li>
                            <a><i className="ti ti-refresh"></i></a>
                        </li>
                        <li>
                            <a id="collapse-header"><i className="ti ti-chevron-up"></i></a>
                        </li>
                    </ul>
                    <div className="page-btn">
                        <button className="btn btn-primary" onClick={() => setAddModalOpen(true)}><i className="ti ti-circle-plus me-1"></i>Add Category</button>
                    </div>
                </div>

                {/* Add Category Modal */}
                {addModalOpen && (
                    <>
                        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <div className="page-title">
                                            <h4>Add Category</h4>
                                        </div>
                                        <button type="button" className="close bg-danger text-white fs-16" onClick={closeAddModal}>
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        {message && <div className="alert alert-success">{message}</div>}
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label className="form-label">Category<span className="text-danger ms-1">*</span></label>
                                                <input type="text" className="form-control" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Category Image<span className="text-danger ms-1">*</span></label>
                                                <input type="file" className="form-control" name="image" onChange={(e) => setImage(e.target.files[0])} />
                                            </div>
                                            <div className="mb-0">
                                                <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                                    <span className="status-label">Status<span className="text-danger ms-1">*</span></span>
                                                    <input
                                                        type="checkbox"
                                                        id="user2"
                                                        className="check"
                                                        name="status"
                                                        checked={status}
                                                        onChange={() => setStatus(!status)}
                                                    />
                                                    <label htmlFor="user2" className="checktoggle"></label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn me-2 btn-secondary" onClick={closeAddModal}>Cancel</button>
                                            <button type="submit" className="btn btn-primary">Add Category</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <ModalBackdrop />
                    </>
                )}

                {/* Edit Category Modal */}
                {editModalOpen && (
                    <>
                        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <form onSubmit={handleEditSubmit}>
                                        <div className="modal-header">
                                            <h4>Edit Category</h4>
                                            <button type="button" className="close bg-danger text-white fs-16" onClick={closeEditModal}>
                                                <span aria-hidden="true">×</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="mb-3">
                                                <label className="form-label">Category Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editName}
                                                    onChange={e => setEditName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Category Image</label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    onChange={e => setEditImage(e.target.files[0])}
                                                />
                                                {/* Show old image */}
                                                {editCategory && editCategory.image && (
                                                    <img
                                                        src={`http://localhost:3000/images/uploads/${editCategory.image}`}
                                                        alt={editCategory.name}
                                                        width={50}
                                                        height={50}
                                                        style={{ marginTop: 8 }}
                                                    />
                                                )}
                                            </div>
                                            {/* Status Switch */}
                                            <div className="mb-3">
                                                <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                                                    <span className="status-label">Status<span className="text-danger ms-1">*</span></span>
                                                    <input
                                                        type="checkbox"
                                                        id="edit-status"
                                                        className="check"
                                                        name="status"
                                                        checked={editStatus}
                                                        onChange={() => setEditStatus(!editStatus)}
                                                    />
                                                    <label htmlFor="edit-status" className="checktoggle"></label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn me-2 btn-secondary" onClick={closeEditModal}>Cancel</button>
                                            <button type="submit" className="btn btn-primary">Update</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <ModalBackdrop />
                    </>
                )}

                {/* Table Card */}
                <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                        {/* ...search and filter... */}
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table datatable dataTable no-footer" id="DataTables_Table_0" aria-describedby="DataTables_Table_0_info">
                                <thead className="thead-light">
                                    <tr>
                                        <th>
                                            <label className="checkboxs">
                                                <input type="checkbox" id="select-all" />
                                                <span className="checkmarks"></span>
                                            </label>
                                        </th>
                                        <th>Category</th>
                                        <th>Category slug</th>
                                        <th>Created On</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat, index) => (
                                        <tr className="odd" key={index}>
                                            <td>
                                                <label className="checkboxs">
                                                    <input type="checkbox" />
                                                    <span className="checkmarks"></span>
                                                </label>
                                            </td>
                                            <td><span className="text-gray-9">{cat.name}</span></td>
                                            <td>{cat.image && (
                                                <img src={`http://localhost:3000/images/uploads/${cat.image}`} alt={cat.name} width={50} height={50} />
                                            )}</td>
                                            <td>
                                                {cat.createdAt
                                                    ? new Date(cat.createdAt).toLocaleDateString()
                                                    : ''}
                                            </td>
                                            <td>
                                                <span className={`badge ${cat.status ? 'bg-success' : 'bg-danger'}`}>
                                                    {cat.status ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="action-table-data">
                                                <div className="edit-delete-action">
                                                    <button className="me-2 p-2 btn btn-link" style={{ boxShadow: 'none' }} onClick={() => openEditModal(cat)}>
                                                        {/* Edit SVG */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                    </button>
                                                    <button className="p-2 btn btn-link" style={{ boxShadow: 'none' }} onClick={() => handleDelete(cat._id)}>
                                                        {/* Trash SVG */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="dataTables_paginate paging_simple_numbers" id="DataTables_Table_0_paginate">
                            <ul className="pagination">
                                <li className={`paginate_button page-item previous${page === 1 ? ' disabled' : ''}`}>
                                    <a
                                        className="page-link"
                                        onClick={() => page > 1 && setPage(page - 1)}
                                        tabIndex="-1"
                                        aria-disabled={page === 1}
                                        style={{ cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                                    >
                                        <i className="fa fa-angle-left"></i>
                                    </a>
                                </li>
                                {[...Array(totalPages)].map((_, idx) => (
                                    <li key={idx} className={`paginate_button page-item${page === idx + 1 ? ' active' : ''}`}>
                                        <a
                                            className="page-link"
                                            onClick={() => setPage(idx + 1)}
                                            aria-current={page === idx + 1 ? "page" : undefined}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {idx + 1}
                                        </a>
                                    </li>
                                ))}
                                <li className={`paginate_button page-item next${page === totalPages ? ' disabled' : ''}`}>
                                    <a
                                        className="page-link"
                                        onClick={() => page < totalPages && setPage(page + 1)}
                                        aria-disabled={page === totalPages}
                                        style={{ cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                                    >
                                        <i className="fa fa-angle-right"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CategoryTable;