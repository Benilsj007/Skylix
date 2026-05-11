import { useNavigate } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";
// import "../CSS/StoreDashboard.css";

function StoreDashboard() {

  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}"); 

  return (
    <>
      <nav className="top">

        <h4 className="navbar-brand m-0">
          {user?.name} Store Panel
        </h4>
        <div className="d-flex gap-2">
           <button
              className="btn btn-light"
              onClick={() => navigate("/home")}>
              Home
           </button>
           <button
              className="btn btn-light"
              onClick={() => navigate("/login")}>
              login
           </button>
        </div>
      </nav>
      <div className="layout">
        <div className="side">
          <ul className="sidebar-menu">
            <li className={location.pathname === "/store/dashboard"
                ? "active": ""}
                onClick={() =>
                navigate("/store")}>
                Dashboard
            </li>
            <li className={
                location.pathname === "/store/products"
                ? "active": ""}
                onClick={() =>
                navigate("/store/products")}>
                My Products
             </li>
            <li className={
                location.pathname === "/store/add-product"
                ? "active": ""}
                onClick={() =>
                navigate("/store/add-product")}>
                Add Product
             </li>
            <li className={
                location.pathname === "/store/orders"
                ? "active": ""}
                onClick={() =>
                navigate("/store/orders")}>
                Order Status
             </li>
          </ul>
        </div>
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default StoreDashboard;