import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

function StoreDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false); // auto close on mobile after click
  };

  return (
    <>
      {/* TOP NAV */}
      <nav className="top">
          <button
            className="btn btn-light d-md-none"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        <h4 className="navbar-brand m-0">
          {user?.name} Store Panel
        </h4>

        <div className="d-flex gap-2 align-items-center">
          {/* Hamburger for mobile */}
        

          <button
            className="btn btn-light"
            onClick={() => navigate("/home")}
          >
            Home
          </button>

          <button
            className="btn btn-light"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </nav>

      <div className="layout">
        {/* SIDEBAR */}
        <div className={`side ${sidebarOpen ? "open" : ""}`}>
          
          {/* Close button (mobile only) */}
          <button
            className="close-btn d-md-none mb-4"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>

          <ul className="sidebar-menu">
            <li
              className={location.pathname === "/store/dashboard" ? "active" : ""}
              onClick={() => handleNavigate("/store")}
            >
              Dashboard
            </li>

            <li
              className={location.pathname === "/store/products" ? "active" : ""}
              onClick={() => handleNavigate("/store/products")}
            >
              My Products
            </li>

            <li
              className={location.pathname === "/store/add-product" ? "active" : ""}
              onClick={() => handleNavigate("/store/add-product")}
            >
              Add Product
            </li>

            <li
              className={location.pathname === "/store/orders" ? "active" : ""}
              onClick={() => handleNavigate("/store/orders")}
            >
              Order Status
            </li>
          </ul>
        </div>

        {/* OVERLAY (mobile background click to close) */}
        {sidebarOpen && (
          <div
            className="overlay d-md-none"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default StoreDashboard;