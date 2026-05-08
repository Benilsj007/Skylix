import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CSS/PendingPayments.css";

function PendingPayments() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");

    if (!user_id) return;

    axios.get(`http://localhost:8080/pending-orders/${user_id}`)
         .then((res) => {
         const data = res.data || [];
         const grouped = {};

        data.forEach((item) => {
          if (!grouped[item.order_id]) {
            grouped[item.order_id] = {
              order_id: item.order_id,
              total: Number(item.total),
              payment_status: item.payment_status,
              items: [],
            };
          }

            grouped[item.order_id].items.push({
            product_name: item.product_name,
            quantity: Number(item.quantity),
            price: Number(item.price),
            image: item.image,
          });
        });

        setOrders(Object.values(grouped));
      })
      .catch((err) => {
        console.error("Error fetching pending orders:", err);
      });
  }, []);

  const cancelOrder = (order_id) => {
  axios.post("http://localhost:8080/cancel-order", {
      order_id: order_id,
    })
    .then(() => {
      showToast("Order Cancelled 😭");

      // REMOVE FROM UI
      setOrders((prev) =>
        prev.filter((order) => order.order_id !== order_id)
      );})
    .catch((err) => console.log(err));
};
  const showToast = (msg) => {
     setMessage(msg);
     setShowMessage(true);

  setTimeout(() => {
     setShowMessage(false);
  }, 3000); // disappears after 3 sec
};

  return (
    
    <div className="pending-container">
      {showMessage && (
            <div className="toast-message">
                 {message}
            </div>
      )}
      <h2>Pending Payments</h2>

      {orders.length > 0 ? (
        orders.map((order) => (
          <div className="order-card" key={order.order_id}>
            <h4>Pending Orders🛍️</h4>

            {/* ITEMS */}
            {order.items.map((item, index) => (
              <div className="product-row"
                key={`${order.order_id}-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={`http://localhost:8080/uploads/${item.image}`}
                  alt={item.product_name}
                  width="60"
                  height="60"
                  style={{
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}/>

                <div className="product-info">
                  <p>
                    {item.product_name} × {item.quantity}
                  </p>
                  <p>₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}

            <h3>Total: ₹{order.total}</h3>
            <p className="status-text">Status: {order.payment_status}</p>
            <div className="order-actions">
            <button
              className="pay-btn"
              onClick={() =>
                navigate("/home/payment", {
                  state: { order_id: order.order_id },
                })}>
              Pay Now
            </button>

            <button
                  className="cancel-btn"
                  style={{ background: "red", color: "white", marginLeft: "10px" }}
                  onClick={() => cancelOrder(order.order_id)}>
                  Cancel Order
            </button>
          </div>
          </div>
        ))
      ) : (
        <p>No pending payments 😁😁</p>
      )}
    </div>
  );
}

export default PendingPayments;