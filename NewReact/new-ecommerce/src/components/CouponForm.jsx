import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";

const CouponForm = () => {
	const [coupons, setCoupons] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [form, setForm] = useState({
		name: "",
		code: "",
		description: "",
		discountType: "percentage",
		discountValue: "",
		startDate: "",
		endDate: "",
		maxUses: "",
		minOrderAmount: "",
		isActive: true,
	});
	// Edit modal state
	const [editModal, setEditModal] = useState(false);
	const [editId, setEditId] = useState(null);
	const [editForm, setEditForm] = useState({
		name: "",
		code: "",
		description: "",
		discountType: "percentage",
		discountValue: "",
		startDate: "",
		endDate: "",
		maxUses: "",
		minOrderAmount: "",
		isActive: true,
	});

	// Fetch coupons and products
	useEffect(() => {
		fetchCoupons();
	}, []);

	const fetchCoupons = async () => {
		try {
			const res = await axios.get("/api/coupon");
			setCoupons(res.data);
		} catch (err) {
			setCoupons([]);
		}
	};

	// Handle form changes
	const handleChange = e => {
		const { name, value, type, checked } = e.target;
		setForm(f => ({
			...f,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	// Edit modal open
	const openEditModal = (coupon) => {
		setEditId(coupon._id);
		setEditForm({
			name: coupon.name || "",
			code: coupon.code || "",
			description: coupon.description || "",
			discountType: coupon.discountType || "percentage",
			discountValue: coupon.discountValue || "",
			startDate: coupon.startDate ? coupon.startDate.slice(0, 10) : "",
			endDate: coupon.endDate ? coupon.endDate.slice(0, 10) : "",
			maxUses: coupon.maxUses || "",
			minOrderAmount: coupon.minOrderAmount || "",
			isActive: coupon.isActive,
		});
		setEditModal(true);
	};
	const closeEditModal = () => {
		setEditModal(false);
		setEditId(null);
	};
	const handleEditChange = e => {
		const { name, value, type, checked } = e.target;
		setEditForm(f => ({
			...f,
			[name]: type === "checkbox" ? checked : value,
		}));
	};
	const handleEditSubmit = async e => {
		e.preventDefault();
		try {
			await axios.put(`/api/coupon/${editId}`, editForm);
			closeEditModal();
			fetchCoupons();
		} catch (err) {
			alert(err.response?.data?.error || "Error");
		}
	};
	const handleDelete = async id => {
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
					await axios.delete(`/api/coupon/${id}`);
					fetchCoupons();
					Swal.fire('Deleted!', 'Coupon has been deleted.', 'success');
				} catch (err) {
					Swal.fire('Error!', err.response?.data?.error || 'Error', 'error');
				}
			}
		});
	};

	//handle product change


	const handleSubmit = async e => {
		e.preventDefault();
		try {
			await axios.post("/api/coupon", form);
			setShowModal(false);
			setForm({
				name: "",
				code: "",
				description: "",
				discountType: "percentage",
				discountValue: "",
				startDate: "",
				endDate: "",
				maxUses: "",
				minOrderAmount: "",
				//	products: [],
				isActive: true,
			});
			fetchCoupons();
		} catch (err) {
			alert(err.response?.data?.error || "Error");
		}
	};

	return (
		<div className="page-wrapper pt-0" style={{ minHeight: "558px" }}>
			<div className="content">
				<div className="page-header">
					<div className="add-item d-flex">
						<div className="page-title">
							<h4 className="fw-bold">Coupons</h4>
							<h6>Manage Your Coupons</h6>
						</div>
					</div>
					<div className="page-btn">
						<button className="btn btn-primary" onClick={() => setShowModal(true)}>
							<i className="ti ti-circle-plus me-1"></i>Add Coupons
						</button>
					</div>
				</div>

				{/* Coupon Table */}
				<div className="card mt-4">
					<div className="card-body p-0">
						<div className="table-responsive">
							<table className="table table-bordered align-middle">
								<thead className="thead-light">
									<tr>
										<th>Name</th>
										<th>Code</th>
										<th>Description</th>
										<th>Type</th>
										<th>Discount</th>
										<th>Max Uses</th>
										<th>Start</th>
										<th>End</th>
										<th>Status</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									{coupons.map(c => (
										<tr key={c._id}>
											<td>{c.name}</td>
											<td>{c.code}</td>
											<td>{c.description}</td>
											<td>{c.discountType}</td>
											<td>
												{c.discountType === "percentage"
													? `${c.discountValue}%`
													: c.discountValue}
											</td>
											<td>{c.maxUses}</td>
											<td>{c.startDate ? new Date(c.startDate).toLocaleDateString() : ""}</td>
											<td>{c.endDate ? new Date(c.endDate).toLocaleDateString() : ""}</td>
											<td>
												<span className={`badge ${c.isActive ? "bg-success" : "bg-danger"}`}>
													{c.isActive ? "Active" : "Inactive"}
												</span>
											</td>
											<td className="action-table-data">
												<div className="edit-delete-action">
													<button className="me-2 p-2 btn btn-link" style={{ boxShadow: 'none' }} onClick={() => openEditModal(c)}>
														{/* Edit SVG */}
														<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
													</button>
													<button className="p-2 btn btn-link" style={{ boxShadow: 'none' }} onClick={() => handleDelete(c._id)}>
														{/* Trash SVG */}
														<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
													</button>
												</div>
											</td>
										</tr>
									))}
									{coupons.length === 0 && (
										<tr>
											<td colSpan={9} className="text-center">No coupons found.</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				{/* Add Coupon Modal */}
				{showModal && (
					<>
						<div
							className="modal fade show"
							style={{
								display: "block",
								zIndex: 2000,
								position: "fixed",
								left: 0,
								top: 0,
								width: "100vw",
								height: "100vh",
								overflowY: "auto"
							}}
							tabIndex="-1"
							aria-modal="true"
							role="dialog"
						>
							<div className="modal-dialog modal-dialog-centered">
								<div className="modal-content">
									<form onSubmit={handleSubmit}>
										<div className="modal-header">
											<h4 className="modal-title">Add Coupon</h4>
											<button type="button" className="close bg-danger text-white fs-16" onClick={() => setShowModal(false)}>
												<span aria-hidden="true">&times;</span>
											</button>
										</div>
										<div className="modal-body">
											<div className="row">
												<div className="col-lg-6 mb-3">
													<label className="form-label">Coupon Name<span className="text-danger ms-1">*</span></label>
													<input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
												</div>
												<div className="col-lg-6 mb-3">
													<label className="form-label">Coupon Code<span className="text-danger ms-1">*</span></label>
													<input type="text" className="form-control" name="code" value={form.code} onChange={handleChange} required />
												</div>
												<div className="col-lg-12 mb-3">
													<label className="form-label">Description</label>
													<textarea className="form-control" name="description" value={form.description} onChange={handleChange} placeholder="Write something about this coupon..." />
													<p className="mb-0">Maximum 60 Words</p>
												</div>
												<div className="col-lg-6 mb-3">
													<label className="form-label">Type<span className="text-danger ms-1">*</span></label>
													<select className="form-control" name="discountType" value={form.discountType} onChange={handleChange} required>
														<option value="percentage">Percentage</option>
														<option value="fixed">Fixed</option>
													</select>
												</div>
												<div className="col-lg-6 mb-3">
													<label className="form-label">Discount Value<span className="text-danger ms-1">*</span></label>
													<input type="number" className="form-control" name="discountValue" value={form.discountValue} onChange={handleChange} required min={1} />
												</div>
												<div className="col-lg-6 mb-3">
													<label className="form-label">Max Uses<span className="text-danger ms-1">*</span></label>
													<input type="number" className="form-control" name="maxUses" value={form.maxUses} onChange={handleChange} required min={1} />
													<span className="unlimited-text fs-12">Enter 0 for Unlimited</span>
												</div>
												<div className="col-lg-6 mb-3">
													<label className="form-label">Minimum Order Amount</label>
													<input type="number" className="form-control" name="minOrderAmount" value={form.minOrderAmount} onChange={handleChange} min={0} />
												</div>
												<div className="col-lg-6 mb-3">
													<label className="form-label">Start Date<span className="text-danger ms-1">*</span></label>
													<input type="date" className="form-control" name="startDate" value={form.startDate} onChange={handleChange} required />
												</div>
												<div className="col-lg-6 mb-3">
													<label className="form-label">End Date<span className="text-danger ms-1">*</span></label>
													<input type="date" className="form-control" name="endDate" value={form.endDate} onChange={handleChange} required />
												</div>



												<div className="col-lg-12 mb-3">
													<div className="form-check form-switch">
														<input className="form-check-input" type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} id="isActiveSwitch" />
														<label className="form-check-label" htmlFor="isActiveSwitch">Active</label>
													</div>
												</div>
											</div>
										</div>
										<div className="modal-footer">
											<button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
											<button type="submit" className="btn btn-primary">Add Coupon</button>
										</div>
									</form>
								</div>
							</div>
						</div>
						<div
							className="modal-backdrop fade show"
							style={{
								zIndex: 1999,
								position: "fixed",
								left: 0,
								top: 0,
								width: "100vw",
								height: "100vh"
							}}
							onClick={() => setShowModal(false)}
						></div>
					</>
				)}

				{/* Edit Coupon Modal */}
				{editModal && (
					<>
						<div
							className="modal fade show"
							style={{
								display: "block",
								zIndex: 2000,
								position: "fixed",
								left: 0,
								top: 0,
								width: "100vw",
								height: "100vh",
								overflowY: "auto"
							}}
							tabIndex="-1"
							aria-modal="true"
							role="dialog"
						>
							<div className="modal-dialog modal-dialog-centered">
								<div className="modal-content">
									<form onSubmit={handleEditSubmit}>
										<div className="modal-header">
											<h4 className="modal-title">Edit Coupon</h4>
											<button type="button" className="close bg-danger text-white fs-16" onClick={closeEditModal}>
												<span aria-hidden="true">&times;</span>
											</button>
										</div>
										<div className="modal-body">
											<div className="row">
												<div className="col-lg-6 mb-3">
													<label className="form-label">Coupon Name<span className="text-danger ms-1">*</span></label>
													<input type="text" className="form-control" name="name" value={editForm.name} onChange={handleEditChange} required />
												</div>
												<div className="col-lg-6 mb-3">
													<label className="form-label">Coupon Code<span className="text-danger ms-1">*</span></label>
													<input type="text" className="form-control" name="code" value={editForm.code} onChange={handleEditChange} required />
												</div>
												<div className="col-lg-12 mb-3">
													<label className="form-label">Description</label>
													<textarea className="form-control" name="description" value={editForm.description} onChange={handleEditChange} placeholder="Write something about this coupon..." />
													<p className="mb-0">Maximum 60 Words</p>
												</div>
												<div className="col-lg-6 mb-3">
													<label className="form-label">Type<span className="text-danger ms-1">*</span></label>
													<select className="form-control" name="discountType" value={editForm.discountType} onChange={handleEditChange} required>
														<option value="percentage">Percentage</option>
														<option value="fixed">Fixed</option>
													</select>
												</div>
												<div className="col-lg-6 mb-3">
													<label className="form-label">Discount Value<span className="text-danger ms-1">*</span></label>
													<input type="number" className="form-control" name="discountValue" value={editForm.discountValue} onChange={handleEditChange} required min={1} />
												</div>
												<div className="col-lg-6 mb-3">
													<label className="form-label">Max Uses<span className="text-danger ms-1">*</span></label>
													<input type="number" className="form-control" name="maxUses" value={editForm.maxUses} onChange={handleEditChange} required min={1} />
													<span className="unlimited-text fs-12">Enter 0 for Unlimited</span>
												</div>
												<div className="col-lg-6 mb-3">
													<label className="form-label">Minimum Order Amount</label>
													<input type="number" className="form-control" name="minOrderAmount" value={editForm.minOrderAmount} onChange={handleEditChange} min={0} />
												</div>
												<div className="col-lg-6 mb-3">
													<label className="form-label">Start Date<span className="text-danger ms-1">*</span></label>
													<input type="date" className="form-control" name="startDate" value={editForm.startDate} onChange={handleEditChange} required />
												</div>
												<div className="col-lg-6 mb-3">
													<label className="form-label">End Date<span className="text-danger ms-1">*</span></label>
													<input type="date" className="form-control" name="endDate" value={editForm.endDate} onChange={handleEditChange} required />
												</div>
												<div className="col-lg-12 mb-3">
													<div className="form-check form-switch">
														<input className="form-check-input" type="checkbox" name="isActive" checked={editForm.isActive} onChange={handleEditChange} id="editIsActiveSwitch" />
														<label className="form-check-label" htmlFor="editIsActiveSwitch">Active</label>
													</div>
												</div>
											</div>
										</div>
										<div className="modal-footer">
											<button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
											<button type="submit" className="btn btn-primary">Update Coupon</button>
										</div>
									</form>
								</div>
							</div>
						</div>
						<div
							className="modal-backdrop fade show"
							style={{
								zIndex: 1999,
								position: "fixed",
								left: 0,
								top: 0,
								width: "100vw",
								height: "100vh"
							}}
							onClick={closeEditModal}
						></div>
					</>
				)}
			</div>
		</div>
	);
}

export default CouponForm;