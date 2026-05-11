import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/OrderStatus.css";

function OrderStatus() {
  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("name");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  // ✅ user (ONLY ONCE)
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";
  const isStore = user?.role === "store";

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchOrders();
    }, 1000);

    return () => clearTimeout(delay);
  }, [search, type, sort, page]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/orderList", {
        params: {
          search,
          type,
          sort,
          page,
          role: user?.role,
          store_id: user?.user_id
        },
      });

      // ✅ FIX: define data properly
      let data = res.data.data;

      // ⚠️ OPTIONAL FRONTEND FILTER (not required if backend works)
      if (isStore) {
        data = data.filter((order) =>
          order.items?.some((item) => item.store_id === user.user_id)
        );
      }

      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="order-header-card">
        <h2>📦 Order Management</h2>
        <p>Search, filter, and track all orders</p>
      </div>

      {/* FILTER CARD */}
      <div className="filter-card">
        <h4>🔍 Filter Orders</h4>

        <div className="row g-3">

          {/* SEARCH TYPE */}
          <div className="col-md-3">
            <label>Search Type</label>
            <select
              className="form-control"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="phone">Phone</option>
              <option value="product">Product</option>
              <option value="status">Status</option>
            </select>
          </div>

          {/* SEARCH INPUT */}
          <div className="col-md-5">
            <label>Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Type here..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

        </div>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">
        <h4 className="table-title">📋 Order List</h4>

        <div className="table-responsive">
          <table className="table table-striped align-middle">

            <thead>
              <tr>
                <th>ID</th>

                <th>
                  <span
                    style={{ cursor: "pointer", marginRight: "6px" }}
                    onClick={() =>
                      setSort(sort === "name-asc" ? "name-desc" : "name-asc")
                    }
                  >
                    {sort === "name-asc" ? "▲" : "▼"}
                  </span>
                  User
                </th>

                <th>Phone</th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Payment</th>
                <th>Status</th>

                {/* ROLE */}
                <th>Shop</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    No Orders Found
                  </td>
                </tr>
              ) : (
                orders.map((order, i) => (
                  <tr key={i}>
                    <td>{order.order_id}</td>
                    <td>{order.user_name}</td>
                    <td>{order.phone}</td>

                    <td>
                      {order.items?.map((item, idx) => (
                        <div key={idx}>{item.product_name}</div>
                      ))}
                    </td>

                    <td>
                      {order.items?.map((item, idx) => (
                        <div key={idx}>₹{item.price}</div>
                      ))}
                    </td>

                    <td>
                      {order.items?.map((item, idx) => (
                        <div key={idx}>{item.quantity}</div>
                      ))}
                    </td>

                    <td>
                      <span className="payment-badge">
                        {order.payment_method?.toUpperCase() || "N/A"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          order.payment_status === "Completed"
                            ? "status paid"
                            : "status pending"
                        }
                      >
                        {order.payment_status === "Completed"
                          ? "Paid"
                          : "Pending"}
                      </span>
                    </td>

                    <td>
  {order.items?.map((item, idx) => (
    <div key={idx}>
      {item.store_name || "N/A"}
    </div>
  ))}
</td>

                    {/* <td>
                      {isAdmin ? "Admin" : "Store Admin"}
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        {/* PAGINATION */}
        <div className="pagination-container">
          <button
            className="btn btn-secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ⬅ Prev
          </button>

          <span className="page-info">Page {page}</span>

          <button
            className="btn btn-secondary"
            onClick={() => setPage(page + 1)}
          >
            Next ➡
          </button>
        </div>

      </div>
    </div>
  );
}

export default OrderStatus;