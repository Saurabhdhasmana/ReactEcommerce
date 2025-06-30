import React from 'react'

 const Header = () => {
  return (
	<div className="header">
			<div className="main-header">
				<div className="header-left active">
					<a href="index.html" className="logo logo-normal">
						<img src="/src//assets/img/logo.svg" alt="Img" />
					</a>
					<a href="index.html" className="logo logo-white">
						<img src="/src//assets/img/logo-white.svg" alt="Img" />
					</a>
					<a href="index.html" className="logo-small">
						<img src="/src//assets/img/logo-small.png" alt="Img" />
					</a>
				</div>
				<a id="mobile_btn" className="mobile_btn" href="#sidebar">
					<span className="bar-icon">
						<span></span>
						<span></span>
						<span></span>
					</span>
				</a>

				<ul className="nav user-menu">

					<li className="nav-item nav-searchinputs">
						<div className="top-nav-search">
							<a href="javascript:void(0);" className="responsive-search">
								<i className="fa fa-search"></i>
							</a>
							<form action="#" className="dropdown">
								<div className="searchinputs input-group dropdown-toggle" id="dropdownMenuClickable" data-bs-toggle="dropdown" data-bs-auto-close="outside">
									<input type="text" placeholder="Search" />
									<div className="search-addon">
										<span><i className="ti ti-search"></i></span>
									</div>
									<span className="input-group-text">
										<kbd className="d-flex align-items-center"><img src="/src//assets/img/icons/command.svg" alt="img" className="me-1" />K</kbd>
									</span>
								</div>
								<div className="dropdown-menu search-dropdown" aria-labelledby="dropdownMenuClickable">
									<div className="search-info">
										<h6><span><i data-feather="search" className="feather-16"></i></span>Recent Searches
										</h6>
										<ul className="search-tags">
											<li><a href="javascript:void(0);">Products</a></li>
											<li><a href="javascript:void(0);">Sales</a></li>
											<li><a href="javascript:void(0);">Applications</a></li>
										</ul>
									</div>
									<div className="search-info">
										<h6><span><i data-feather="help-circle" className="feather-16"></i></span>Help</h6>
										<p>How to Change Product Volume from 0 to 200 on Inventory management</p>
										<p>Change Product Name</p>
									</div>
									<div className="search-info">
										<h6><span><i data-feather="user" className="feather-16"></i></span>Customers</h6>
										<ul className="customers">
											<li><a href="javascript:void(0);">Aron Varu<img src="assets/img/profiles/avator1.jpg" alt="Img" className="img-fluid" /></a></li>
											<li><a href="javascript:void(0);">Jonita<img src="assets/img/profiles/avatar-01.jpg" alt="Img" className="img-fluid" /></a></li>
											<li><a href="javascript:void(0);">Aaron<img src="assets/img/profiles/avatar-10.jpg" alt="Img" className="img-fluid" /></a></li>
										</ul>
									</div>
								</div>
							</form>
						</div>
					</li>

					<li className="nav-item dropdown has-arrow main-drop select-store-dropdown">
						<a href="javascript:void(0);" className="dropdown-toggle nav-link select-store" data-bs-toggle="dropdown">
							<span className="user-info">
								<span className="user-letter">
									<img src="assets/img/store/store-01.png" alt="Store Logo" className="img-fluid" />
								</span>
								<span className="user-detail">
									<span className="user-name">Freshmart</span>
								</span>
							</span>
						</a>
						<div className="dropdown-menu dropdown-menu-right">
							<a href="javascript:void(0);" className="dropdown-item">
								<img src="assets/img/store/store-01.png" alt="Store Logo" className="img-fluid" />Freshmart
							</a>
							<a href="javascript:void(0);" className="dropdown-item">
								<img src="assets/img/store/store-02.png" alt="Store Logo" className="img-fluid" />Grocery Apex
							</a>
							<a href="javascript:void(0);" className="dropdown-item">
								<img src="assets/img/store/store-03.png" alt="Store Logo" className="img-fluid" />Grocery Bevy
							</a>
							<a href="javascript:void(0);" className="dropdown-item">
								<img src="assets/img/store/store-04.png" alt="Store Logo" className="img-fluid" />Grocery Eden
							</a>
						</div>
					</li>

					<li className="nav-item dropdown link-nav">
						<a href="javascript:void(0);" className="btn btn-primary btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
							<i className="ti ti-circle-plus me-1"></i>Add New
						</a>
						<div className="dropdown-menu dropdown-xl dropdown-menu-center">
							<div className="row g-2">
								<div className="col-md-2">
									<a href="category-list.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-brand-codepen"></i>
										</span>
										<p>Category</p>
									</a>
								</div>
								<div className="col-md-2">
									<a href="add-product.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-square-plus"></i>
										</span>
										<p>Product</p>
									</a>
								</div>
								<div className="col-md-2">
									<a href="category-list.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-shopping-bag"></i>
										</span>
										<p>Purchase</p>
									</a>
								</div>
								<div className="col-md-2">
									<a href="online-orders.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-shopping-cart"></i>
										</span>
										<p>Sale</p>
									</a>
								</div>
								<div className="col-md-2">
									<a href="expense-list.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-file-text"></i>
										</span>
										<p>Expense</p>
									</a>
								</div>
								<div className="col-md-2">
									<a href="quotation-list.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-device-floppy"></i>
										</span>
										<p>Quotation</p>
									</a>
								</div>
								<div className="col-md-2">
									<a href="sales-returns.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-copy"></i>
										</span>
										<p>Return</p>
									</a>
								</div>
								<div className="col-md-2">
									<a href="users.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-user"></i>
										</span>
										<p>User</p>
									</a>
								</div>
								<div className="col-md-2">
									<a href="customers.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-users"></i>
										</span>
										<p>Customer</p>
									</a>
								</div>
								<div className="col-md-2">
									<a href="sales-report.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-shield"></i>
										</span>
										<p>Biller</p>
									</a>
								</div>
								<div className="col-md-2">
									<a href="suppliers.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-user-check"></i>
										</span>
										<p>Supplier</p>
									</a>
								</div>
								<div className="col-md-2">
									<a href="stock-transfer.html" className="link-item">
										<span className="link-icon">
											<i className="ti ti-truck"></i>
										</span>
										<p>Transfer</p>
									</a>
								</div>
							</div>
						</div>
					</li>
					
					<li className="nav-item pos-nav">
						<a href="pos.html" className="btn btn-dark btn-md d-inline-flex align-items-center">
							<i className="ti ti-device-laptop me-1"></i>POS
						</a>
					</li>

					<li className="nav-item dropdown has-arrow flag-nav nav-item-box">
						<a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="javascript:void(0);" role="button">
							<img src="assets/img/flags/us-flag.svg" alt="Language" className="img-fluid" />
						</a>
						<div className="dropdown-menu dropdown-menu-right">
							<a href="javascript:void(0);" className="dropdown-item">
								<img src="assets/img/flags/english.svg" alt="Img" height="16" />English
							</a>
							<a href="javascript:void(0);" className="dropdown-item">
								<img src="assets/img/flags/arabic.svg" alt="Img" height="16" />Arabic
							</a>
						</div>
					</li>

					<li className="nav-item nav-item-box">
						<a href="javascript:void(0);" id="btnFullscreen">
							<i className="ti ti-maximize"></i>
						</a>
					</li>
					<li className="nav-item nav-item-box">
						<a href="email.html">
							<i className="ti ti-mail"></i>
							<span className="badge rounded-pill">1</span>
						</a>
					</li>
					<li className="nav-item dropdown nav-item-box">
						<a href="javascript:void(0);" className="dropdown-toggle nav-link" data-bs-toggle="dropdown">
							<i className="ti ti-bell"></i>
						</a>
						<div className="dropdown-menu notifications">
							<div className="topnav-dropdown-header">
								<h5 className="notification-title">Notifications</h5>
								<a href="javascript:void(0)" className="clear-noti">Mark all as read</a>
							</div>
							<div className="noti-content">
								<ul className="notification-list">
									<li className="notification-message">
										<a href="activities.html">
											<div className="media d-flex">
												<span className="avatar flex-shrink-0">
													<img alt="Img" src="assets/img/profiles/avatar-13.jpg" />
												</span>
												<div className="flex-grow-1">
													<p className="noti-details"><span className="noti-title">James Kirwin</span> confirmed his order.  Order No: #78901.Estimated delivery: 2 days</p>
													<p className="noti-time">4 mins ago</p>
												</div>
											</div>
										</a>
									</li>
									<li className="notification-message">
										<a href="activities.html">
											<div className="media d-flex">
												<span className="avatar flex-shrink-0">
													<img alt="Img" src="assets/img/profiles/avatar-03.jpg" />
												</span>
												<div className="flex-grow-1">
													<p className="noti-details"><span className="noti-title">Leo Kelly</span> cancelled his order scheduled for  17 Jan 2025</p>
													<p className="noti-time">10 mins ago</p>
												</div>
											</div>
										</a>
									</li>
									<li className="notification-message">
										<a href="activities.html" className="recent-msg">
											<div className="media d-flex">
												<span className="avatar flex-shrink-0">
													<img alt="Img" src="assets/img/profiles/avatar-17.jpg" />
												</span>
												<div className="flex-grow-1">
													<p className="noti-details">Payment of $50 received for Order #67890 from <span className="noti-title">Antonio Engle</span></p>
													<p className="noti-time">05 mins ago</p>
												</div>
											</div>
										</a>
									</li>
									<li className="notification-message">
										<a href="activities.html" className="recent-msg">
											<div className="media d-flex">
												<span className="avatar flex-shrink-0">
													<img alt="Img" src="assets/img/profiles/avatar-02.jpg" />
												</span>
												<div className="flex-grow-1">
													<p className="noti-details"><span className="noti-title">Andrea</span> confirmed his order.  Order No: #73401.Estimated delivery: 3 days</p>
													<p className="noti-time">4 mins ago</p>
												</div>
											</div>
										</a>
									</li>
								</ul>
							</div>
							<div className="topnav-dropdown-footer d-flex align-items-center gap-3">
								<a href="#" className="btn btn-secondary btn-md w-100">Cancel</a>
								<a href="activities.html" className="btn btn-primary btn-md w-100">View all</a>
							</div>
						</div>
					</li>

					<li className="nav-item nav-item-box">
						<a href="general-settings.html"><i className="ti ti-settings"></i></a>
					</li>
					<li className="nav-item dropdown has-arrow main-drop profile-nav">
						<a href="javascript:void(0);" className="nav-link userset" data-bs-toggle="dropdown">
							<span className="user-info p-0">
								<span className="user-letter">
									<img src="assets/img/profiles/avator1.jpg" alt="Img" className="img-fluid" />
								</span>
							</span>
						</a>
						<div className="dropdown-menu menu-drop-user">
							<div className="profileset d-flex align-items-center">
								<span className="user-img me-2">
									<img src="assets/img/profiles/avator1.jpg" alt="Img" />
								</span>
								<div>
									<h6 className="fw-medium">John Smilga</h6>
									<p>Admin</p>
								</div>
							</div>
							<a className="dropdown-item" href="profile.html"><i className="ti ti-user-circle me-2"></i>MyProfile</a>
							<a className="dropdown-item" href="sales-report.html"><i className="ti ti-file-text me-2"></i>Reports</a>
							<a className="dropdown-item" href="general-settings.html"><i className="ti ti-settings-2 me-2"></i>Settings</a>
							<hr className="my-2" />
							<a className="dropdown-item logout pb-0" href="signin.html"><i className="ti ti-logout me-2"></i>Logout</a>
						</div>
					</li>
				</ul>

				<div className="dropdown mobile-user-menu">
					<a href="javascript:void(0);" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"><i className="fa fa-ellipsis-v"></i></a>
					<div className="dropdown-menu dropdown-menu-right">
						<a className="dropdown-item" href="profile.html">My Profile</a>
						<a className="dropdown-item" href="general-settings.html">Settings</a>
						<a className="dropdown-item" href="signin.html">Logout</a>
					</div>
				</div>
			</div>
		</div>
  )
}
export default Header;