import React from 'react'
import { Link } from 'react-router-dom'

 const Sidebar = () => {
  return (
          <div className="page-wrapper" >
	      <div className="sidebar" id="sidebar">
			<div className="sidebar-logo active">
				<a href="index.html" className="logo logo-normal">
					<img src="assets/img/logo.svg" alt="Img" />
				</a>
				<a href="index.html" className="logo logo-white">
					<img src="assets/img/logo-white.svg" alt="Img" />
				</a>
				<a href="index.html" className="logo-small">
					<img src="assets/img/logo-small.png" alt="Img" />
				</a>
				<a id="toggle_btn" href="javascript:void(0);">
					<i data-feather="chevrons-left" className="feather-16"></i>
				</a>
			</div>
			<div className="modern-profile p-3 pb-0">
				<div className="text-center rounded bg-light p-3 mb-4 user-profile">
					<div className="avatar avatar-lg online mb-3">
						<img src="assets/img/customer/customer15.jpg" alt="Img" className="img-fluid rounded-circle" />
					</div>
					<h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
					<p className="fs-12 mb-0">System Admin</p>
				</div>
				<div className="sidebar-nav mb-3">
					<ul className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified bg-transparent" role="tablist">
						<li className="nav-item"><a className="nav-link active border-0" href="#">Menu</a></li>
						<li className="nav-item"><a className="nav-link border-0" href="chat.html">Chats</a></li>
						<li className="nav-item"><a className="nav-link border-0" href="email.html">Inbox</a></li>
					</ul>
				</div>
			</div>
			<div className="sidebar-header p-3 pb-0 pt-2">
				<div className="text-center rounded bg-light p-2 mb-4 sidebar-profile d-flex align-items-center">
					<div className="avatar avatar-md onlin">
						<img src="assets/img/customer/customer15.jpg" alt="Img" className="img-fluid rounded-circle" />
					</div>
					<div className="text-start sidebar-profile-info ms-2">
						<h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
						<p className="fs-12">System Admin</p>
					</div>
				</div>
				<div className="d-flex align-items-center justify-content-between menu-item mb-3">
					<div>
						<a href="index.html" className="btn btn-sm btn-icon bg-light">
							<i className="ti ti-layout-grid-remove"></i>
						</a>
					</div>
					<div>
						<a href="chat.html" className="btn btn-sm btn-icon bg-light">
							<i className="ti ti-brand-hipchat"></i>
						</a>
					</div>
					<div>
						<a href="email.html" className="btn btn-sm btn-icon bg-light position-relative">
							<i className="ti ti-message"></i>
						</a>
					</div>
					<div className="notification-item">
						<a href="activities.html" className="btn btn-sm btn-icon bg-light position-relative">
							<i className="ti ti-bell"></i>
							<span className="notification-status-dot"></span>
						</a>
					</div>
					<div className="me-0">
						<a href="general-settings.html" className="btn btn-sm btn-icon bg-light">
							<i className="ti ti-settings"></i>
						</a>
					</div>
				</div>
			</div>
			<div className="sidebar-inner slimscroll">
				<div id="sidebar-menu" className="sidebar-menu">
					<ul>
						
						<li className="submenu-open">
							<h6 className="submenu-hdr">Inventory</h6>
							<ul>
								<li><Link to="/allproducts"><i data-feather="box"></i><span>Products</span></Link></li>
								<li><Link to="/products"><i className="ti ti-table-plus fs-16 me-2"></i><span>Create Product</span></Link></li>
								<li><Link to="/productReview"><i className="ti ti-progress-alert fs-16 me-2"></i><span>Products Review</span></Link></li>
								<li><Link to="/comboproducts"><i className="ti ti-trending-up-2 fs-16 me-2"></i><span>Combo Products</span></Link></li>
								<li><Link to="/category"><i className="ti ti-list-details fs-16 me-2"></i><span>Category</span></Link></li>
								<li><Link to="/subcategory"><i className="ti ti-carousel-vertical fs-16 me-2"></i><span>Sub Category</span></Link></li>
								<li><Link to="/brand"><i className="ti ti-triangles fs-16 me-2"></i><span>Brands</span></Link></li>
								<li><Link to="/units"><i className="ti ti-brand-unity fs-16 me-2"></i><span>Units</span></Link></li>
								<li><Link to="/variants"><i className="ti ti-checklist fs-16 me-2"></i><span>Variant Attributes</span></Link></li>
								<li><Link to="/warranty"><i className="ti ti-certificate fs-16 me-2"></i><span>Warranties</span></Link></li>
								<li><Link to="/barcode"><i className="ti ti-barcode fs-16 me-2"></i><span>Print Barcode</span></Link></li>
								<li><Link to="/qrcode"><i className="ti ti-qrcode fs-16 me-2"></i><span>Print QR Code</span></Link></li>
							</ul>
						</li>
						<li className="submenu-open">
							<h6 className="submenu-hdr">Marketing</h6>
							<ul>
								<li><Link to="/coupons"><i className="ti ti-stack-3 fs-16 me-2"></i><span>Coupon</span></Link></li>
								<li><Link to="/orders"><i className="ti ti-stairs-up fs-16 me-2"></i><span>Orders</span></Link></li>
								<li><Link to="/stock-transfer"><i className="ti ti-stack-pop fs-16 me-2"></i><span>Stock Transfer</span></Link></li>
							</ul>
						</li>
						
					</ul>
				</div>
			</div>
		</div>
	</div>
  )
}

export default Sidebar;