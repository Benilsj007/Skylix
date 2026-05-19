import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import "./CSS/Admin.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false); // auto close on mobile
  };

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="top">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>

        <h4 className="navbar-brand m-0">Admin Panel</h4>

        <button className="btn btn-light" onClick={() => navigate("/home")}>
          Home
        </button>
      </nav>

      {/* LAYOUT */}
      <div className="layout">

        {/* SIDEBAR */}
        <div className={`side ${sidebarOpen ? "open" : ""}`}>

          <button className="close" onClick={closeSidebar}>
            ✖
          </button>

          <ul className="sidebar-menu">
            <li
              className={location.pathname === "/admin" ? "active" : ""}
              onClick={() => handleNavigate("/admin")}
            >
              Dashboard
            </li>

            <li
              className={location.pathname === "/admin/products" ? "active" : ""}
              onClick={() => handleNavigate("/admin/products")}
            >
              Products
            </li>

            <li
              className={location.pathname === "/admin/users" ? "active" : ""}
              onClick={() => handleNavigate("/admin/users")}
            >
              Users
            </li>

            <li
              className={location.pathname === "/admin/orders" ? "active" : ""}
              onClick={() => handleNavigate("/admin/orders")}
            >
              Order Status
            </li>
             <li
              className={location.pathname === "/admin/store-details" ? "active" : ""}
              onClick={() => handleNavigate("/admin/store-details")}
            >
              Store Details
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

export default AdminDashboard;