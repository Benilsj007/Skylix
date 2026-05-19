import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./CSS/Payment.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const [order_id, setOrderId] = useState(
    location.state?.order_id || localStorage.getItem("order_id")
  );

  const [paymentStep, setPaymentStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [method, setMethod] = useState("cod");

  // SAVE ORDER ID
  useEffect(() => {
    if (location.state?.order_id) {
      localStorage.setItem("order_id", location.state.order_id);
      setOrderId(location.state.order_id);
    }
  }, [location.state]);

  // LOAD ORDER ITEMS
  useEffect(() => {
    if (!order_id) return;

    axios
      .get(`http://localhost:8080/order-items/${order_id}`)
      .then((res) => {
        const data = res.data || [];
        setCart(data);

        const t = data.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        setTotal(t);
      })
      .catch((err) => console.log(err));
  }, [order_id]);

  const handleMethodClick = (type) => {
    if (method === type) {
      setPaymentStep((prev) => prev + 1);
    } else {
      setMethod(type);
      setPaymentStep(1);
    }
  };

  //  CHECK STOCK
  const isOutOfStock = cart.some(
    (item) => item.stock === 0 || item.stock < item.quantity
  );

  // PAYMENT API
  const handlePayment = () => {
    if (!order_id) {
      toast.info("Order not found");
      return;
    }

    if (isOutOfStock) {
      toast.info(" items is out of stock ");
      return;
    }

    axios
      .post("http://localhost:8080/pay-order", {
        order_id,
        payment_method: method,
      })
      .then((res) => {
        if (res.data.status) {
          toast.success("Payment Successful 🎉");
          localStorage.removeItem("order_id");

          setTimeout(() => navigate("/home"), 3000);
        } else {
          toast.warn(res.data.message);
        }
      })
      .catch(() => toast.error("Payment failed 😭"));
  };

  return (
    <div className="payment-container">
       <ToastContainer
        position="top-right"
        autoClose={2000}/>
      <h2>Payment</h2>

      <div className="order-summary">
        {cart.length === 0 ? (
          <p>No order found</p>
        ) : (
          cart.map((item, i) => (
            <div key={i} className="order-item">
              <p>
                {item.name} × {item.quantity} = ₹
                {item.price * item.quantity}
              </p>

              {/* ✅ STOCK DISPLAY */}
              <p
                style={{
                  color:
                    item.stock === 0
                      ? "red"
                      : item.stock <= 3
                      ? "orange"
                      : "green",
                  fontWeight: "bold",
                }}
              >
                {item.stock === 0
                  ? "Out of Stock ❌"
                  : item.stock < item.quantity
                  ? `Only ${item.stock} left ⚠️`
                  : `Stock: ${item.stock}`}
              </p>
            </div>
          ))
        )}
        <h2>Total: ₹{total}</h2>
      </div>

      {/* PAYMENT OPTIONS */}
      <div className="payment-options">
        {[
          { type: "cod", label: "Cash on Delivery", logo: "/Images/cod.png" },
          { type: "gpay", label: "Google Pay", logo: "/Images/gpay.png" },
          { type: "phonepe", label: "PhonePe", logo: "/Images/phonepe.png" },
          { type: "paytm", label: "Paytm", logo: "/Images/paytm.png" },
          { type: "card", label: "Credit Card", logo: "/Images/card.png" },
        ].map((option) => (
          <div
            key={option.type}
            onClick={() => handleMethodClick(option.type)}
            className={`payment-card ${
              method === option.type ? "active-payment" : ""
            }`}
          >
            <img src={option.logo} alt={option.label} />
            <span>{option.label}</span>
          </div>
        ))}
      </div>

      {/* QR FLOW */}
      {["gpay", "phonepe", "paytm"].includes(method) && (
        <>
          {paymentStep === 1 && (
            <div className="qr-section">
              <h3>Scan QR 😊😊</h3>
              <img src="/Images/image.png" alt="QR" className="qr-image" />
            </div>
          )}
        </>
      )}

      {/* CARD FORM */}
      {method === "card" && (
        <div className="card-section">
          <h3>Enter Card Details</h3>

          <input type="text" placeholder="Card Number" maxLength="16" />
          <input type="text" placeholder="Card Holder Name" />

          <div className="card-row">
            <input type="text" placeholder="MM/YY" />
            <input type="password" placeholder="CVV" maxLength="3" />
          </div>
        </div>
      )}

      {/* 🔴 PAY BUTTON */}
      <button
        onClick={handlePayment}
        disabled={isOutOfStock}
        style={{
          backgroundColor: isOutOfStock ? "gray" : "#000",
          cursor: isOutOfStock ? "not-allowed" : "pointer",
        }}
      >
        {isOutOfStock ? "Out of Stock ❌" : "Pay Now"}
      </button>
    </div>
  );
}

export default Payment;