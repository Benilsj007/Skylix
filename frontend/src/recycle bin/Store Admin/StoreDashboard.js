import { useNavigate } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";

function StoreDashboard() {

  const navigate = useNavigate();
  const location = useLocation();


const user = JSON.parse(localStorage.getItem("user") || "{}"); 

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="top">

        <h4 className="navbar-brand m-0">
          {user?.name} Store Panel
        </h4>

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

      </nav>

      {/* MAIN LAYOUT */}
      <div className="layout">

        {/* SIDEBAR */}
        <div className="side">

          <ul className="sidebar-menu">

            {/* DASHBOARD */}
            <li
              className={
                location.pathname === "/store/dashboard"
                ? "active"
                : ""
              }

              onClick={() =>
                navigate("/store")
              }>

              Dashboard

            </li>

            {/* MY PRODUCTS */}
            <li
              className={
                location.pathname === "/store/products"
                ? "active"
                : ""
              }

              onClick={() =>
                navigate("/store/products")
              }>

              My Products

            </li>

            {/* ADD PRODUCT */}
            <li
              className={
                location.pathname === "/store/add-product"
                ? "active"
                : ""
              }

              onClick={() =>
                navigate("/store/add-product")
              }>

              Add Product

            </li>

            {/* ORDERS */}
            <li
              className={
                location.pathname === "/store/orders"
                ? "active"
                : ""
              }

              onClick={() =>
                navigate("/store/orders")
              }>

              Order Status

            </li>

          </ul>

        </div>

        {/* MAIN CONTENT */}
        <div className="main-content">

          <Outlet />

        </div>

      </div>
    </>
  );
}

export default StoreDashboard;