import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Products from "./pages/products"
import AdminDashboard from "./pages/Admin";
import Userupdate from "./pages/Userupdate";
import AddProduct from "./pages/AddProducts";
import AdminHome from "./pages/AdminHome";
import EditProduct from "./pages/EditProducts";
import UserEdit from "./pages/UserEdit";

import Mobiles from "./pages/Mobiles";
import Laptops from "./pages/Laptops";
import Accessories from "./pages/Accessories";
import ProductData from "./pages/ProductData";
import OrderStatus from "./pages/OrderStatus";

import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import PlaceOrder from "./pages/PlaceOrder";
import Payment from "./pages/Payment";
import PendingPayments from "./pages/PendingPayments";
import ScrollToTop from "./pages/ScrollToTop";

import StoreProducts from "./pages/Store Admin/StoreProducts";
import StoreDashboard from "./pages/Store Admin/StoreDashboard";
import StoreDetails from "./pages/Store Admin/StoreDetails";

// import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>

        {/*  PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Register />} />
        
        {/*  DASHBOARD (NESTED ROUTING) */}
        <Route path="/admin" element={<AdminDashboard />}>

          {/* DEFAULT */}
          <Route index element={<AdminHome />} /> 
                    <Route path="store-details" element={<StoreDetails />} />
              {/* <Route path="store-members" element={<StoreMembers />} /> */}

         
          {/* CHILD ROUTES */}
          <Route path="products" element={<Products />} />
          <Route path="products/edit" element={<EditProduct />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="users" element={<Userupdate />} />
          <Route path="users/edit" element={<UserEdit />} />
          <Route path="orders" element={<OrderStatus />} />

          </Route>
            
            {/* <Route path="store-details" element={<StoreDetails />} /> */}


 
        <Route path="/home" element={<Home />}>

         {/* Home default NO sidebar */}
          <Route index element={<ProductData />} />
            {/* Product details */}
          <Route path="product/:id" element={<ProductDetails />} />
            {/* Category pages (WITH sidebar) */}
          <Route path="mobile" element={<Mobiles />} />
          <Route path="laptop" element={<Laptops />} />
          <Route path="accessories" element={<Accessories />} />
          <Route path="cart" element={<Cart />} />
          <Route path="placeorder" element={<PlaceOrder />} />
          <Route path="payment" element={<Payment />} />
          <Route path="pendingpayment" element={<PendingPayments />} />
       </Route>

<Route path="/store" element={<StoreDashboard />}>

    <Route
        path="products"
        element={<StoreProducts />}
    />

    <Route
        path="add-product"
        element={<AddProduct />}
    /> 

     <Route
        path="edit-product"
        element={<EditProduct/>}
    /> 

     <Route
        path="orders"
        element={<OrderStatus />}
    /> 

</Route>

      </Routes>

      
    </BrowserRouter>
  );
}
export default App;

