import { useState } from 'react'
import  Header  from './components/Header.jsx'
import  Footer  from './components/Footer.jsx'
import  Sidebar from './components/Sidebar.jsx'
import  CategoryTable  from './components/categoryTable.jsx'
import SubcategoryTable from './components/SubcategoryTable.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import Brand from './components/Brand.jsx'
import Variants from './components/Variants.jsx'
import ProductForm from './components/Product.jsx'
import Allproduct from './components/Allproduct.jsx'
import CouponForm from './components/CouponForm.jsx'
import Comboproduct from './components/Comboproduct.jsx'
import StockManagement from './components/StockManagement.jsx'
import StockDashboard from './components/StockDashboard.jsx'
import { ToastContainer } from 'react-toastify';

import './assets/css/bootstrap.min.css'
import './assets/css/bootstrap-datetimepicker.min.css'
import './assets/css/animate.css'
import './assets/plugins/select2/css/select2.min.css'
import './assets/plugins/daterangepicker/daterangepicker.css'
import './assets/plugins/tabler-icons/tabler-icons.min.css'
import './assets/plugins/fontawesome/css/fontawesome.min.css'
import './assets/plugins/fontawesome/css/all.min.css'
import './components/Variants.jsx'
import './assets/css/style.css'
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/Dashboard.jsx'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <div className="main-wrapper">
        <Header />
        <Sidebar />         
          <Routes> 
            <Route path="/category" element= {<CategoryTable />} />
            <Route path="/subcategory" element= {<SubcategoryTable  />} />
            <Route path="/brand" element= {<Brand />} />
             <Route path="/variants" element= {<Variants />} />
             <Route path="/products" element= {<ProductForm />} />
             <Route path="/allproducts" element= {<Allproduct />} />
             <Route path="/coupons" element= {<CouponForm/>} />
             <Route path="/comboproducts" element= {<Comboproduct/>} />
             <Route path="/stock-management" element= {<StockManagement/>} />
             <Route path="/stock-dashboard" element= {<StockDashboard/>} />
             <Route path="/dashboard" element= {<Dashboard/>} />
          </Routes>
        
        <Footer />
      </div>
    </BrowserRouter>
  )
}
export default App;

