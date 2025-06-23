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
                        <label className="form-label">Applicable Products</label>
                        <select multiple className="form-control" name="products" value={form.products} onChange={handleProductChange}>
                          {products.map(p => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                          ))}
                        </select>
                        <small className="text-muted">Hold Ctrl (Windows) or Cmd (Mac) to select multiple products.</small>
                      </div>
                      <div className="col-lg-12 mb-3">
                        <div className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} id="isActiveSwitch" />
                          <label className="form-check-label" htmlFor="isActiveSwitch">Active</label>
                        </div>
                      </div>
                    </div>
                  </div>

// merko orderModel mei chhaiye product._id mein variants aur products dono hone chahiye, aur id save honi chaiye jeseorder_id,item,price,gst,quantity,discount,status,deleteed at,
// dusri table ke liye
// customer_id,total amount,total quantity,total discount,status,payment_method,transaction_id,order date,deleivery date,cancelled date,reasons,remarks ye chaiye