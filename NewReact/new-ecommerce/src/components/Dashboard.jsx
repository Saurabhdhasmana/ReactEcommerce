import React from "react";

const Dashboard = () => (

<div className="page-wrapper" style={{ minHeight: "414px", padding:"15px" }}>
  <div className="content">
	<div className="row">
	  <div className="col-xl-3 col-sm-6 col-12 d-flex">
		<div className="card dash-widget w-100">
		  <div className="card-body d-flex align-items-center">
			<div className="dash-widgetimg">
			  <span><img src="/src/assets/img/icons/dash1.svg" alt="img" /></span>
			</div>
			<div className="dash-widgetcontent">
			  <h5 className="mb-1">$<span className="counters" data-count="307144.00">307144</span></h5>
			  <p className="mb-0">Total Purchase Due</p>
			</div>
		  </div>
		</div>
	  </div>
	  <div className="col-xl-3 col-sm-6 col-12 d-flex">
		<div className="card dash-widget dash1 w-100">
		  <div className="card-body d-flex align-items-center">
			<div className="dash-widgetimg">
			  <span><img src="/src/assets/img/icons/dash2.svg" alt="img" /></span>
			</div>
			<div className="dash-widgetcontent">
			  <h5 className="mb-1">$<span className="counters" data-count="4385.00">4385</span></h5>
			  <p className="mb-0">Total Sales Due</p>
			</div>
		  </div>
		</div>
	  </div>
	  <div className="col-xl-3 col-sm-6 col-12 d-flex">
		<div className="card dash-widget dash2 w-100">
		  <div className="card-body d-flex align-items-center">
			<div className="dash-widgetimg">
			  <span><img src="/src/assets/img/icons/dash3.svg" alt="img" /></span>
			</div>
			<div className="dash-widgetcontent">
			  <h5 className="mb-1">$<span className="counters" data-count="385656.50">385656.5</span></h5>
			  <p className="mb-0">Total Sale Amount</p>
			</div>
		  </div>
		</div>
	  </div>
	  <div className="col-xl-3 col-sm-6 col-12 d-flex">
		<div className="card dash-widget dash3 w-100">
		  <div className="card-body d-flex align-items-center">
			<div className="dash-widgetimg">
			  <span><img src="/src/assets/img/icons/dash4.svg" alt="img" /></span>
			</div>
			<div className="dash-widgetcontent">
			  <h5 className="mb-1">$<span className="counters" data-count="40000.00">40000</span></h5>
			  <p className="mb-0">Total Expense Amount</p>
			</div>
		  </div>
		</div>
	  </div>
	  {/* Add more dashboard content here, following the same JSX conversion pattern. */}
	</div>
  </div>
  </div>
);

export default Dashboard;