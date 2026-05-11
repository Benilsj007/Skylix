import { useNavigate } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";
import "./CSS/Admin.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="top">
        <h4 className="navbar-brand m-0">Admin Panel</h4>
        <button
          className="btn btn-light"
          onClick={() => navigate("/home")}>
          Home
        </button>
      </nav>
      <div className="layout">
        <div className="side">
          <ul className="sidebar-menu">
            <li
              className={location.pathname === "/admin" ? "active" : ""}
              onClick={() => navigate("/admin")}>
              Dashboard
            </li>
            <li
              className={location.pathname === "/admin/products" ? "active" : ""}
              onClick={() => navigate("/admin/products")}>
              Products
            </li>
            <li
              className={location.pathname === "/admin/users" ? "active" : ""}
              onClick={() => navigate("/admin/users")}>
              Users
            </li>
            <li
              className={location.pathname === "/admin/orders" ? "active" : ""}
              onClick={() => navigate("/admin/orders")}>
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

export default AdminDashboard;