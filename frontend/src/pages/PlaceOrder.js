import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./CSS/PlaceOrder.css";

function PlaceOrder() {
const [toast, setToast] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const buyNowProduct = location.state?.buyNowProduct;

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const showToast = (msg) => {
  setToast(msg);

  setTimeout(() => {
    setToast("");
  }, 3000); // auto hide after 3 sec
};  

  // LOAD BUY NOW / CART
useEffect(() => {
    const user_id = localStorage.getItem("user_id");

  if (buyNowProduct?.product_id) {
    const item = {
      product_id: buyNowProduct.product_id,
      name: buyNowProduct.name,
      price: Number(buyNowProduct.price),
      quantity: Number(buyNowProduct.quantity || 1),
    };

       setCart([item]);
       setTotal(item.price * item.quantity);
  } 
    else if (user_id) {
    fetchCart();
  } 
    else {
    setCart([]);
    setTotal(0);
  }
}, [buyNowProduct]);
  // taking data from cart
  const fetchCart = async () => {
    try {
      const user_id = localStorage.getItem("user_id");

      if (!user_id) {
        showToast("Please login first 😊");
        return;
      }

      const res = await axios.get(
        `http://localhost:8080/get-cart/${user_id}`);

      const data = Array.isArray(res.data) ? res.data : [];

      const formatted = data.map((item) => ({
        product_id: item.product_id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
      }));

      setCart(formatted);

      const t = formatted.reduce(
        (acc, item) => acc + item.price * item.quantity,0);

      setTotal(t);
    } catch (err) {
      console.log("Cart fetch error:", err);
      setCart([]);
      setTotal(0);
    }};
  // function for placing order
  const placeOrder = async (payment_method) => {
       if (!address || !phone) {
          showToast("Please fill address and phone 🏡&📱");
          return;
  }
// PHONE VALIDATION (10 digits)
   const phonePattern = /^[0-9]{10}$/;
         if (!phonePattern.test(phone)) {
          showToast("Phone Number should be 10 digits📱");         
          return;
}
  const user_id = localStorage.getItem("user_id");

  let products = [];

  // buying product flow
  if (buyNowProduct?.product_id) {
    products = [
      {
        product_id: Number(buyNowProduct.product_id),
        name: buyNowProduct.name,
        price: Number(buyNowProduct.price),
        quantity: Number(buyNowProduct.quantity || 1),
      },
    ];}

  // CART FLOW
  else {
      products = cart.map((item) => ({
      product_id: Number(item.product_id),
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));
  }
console.log("BUY NOW PRODUCT:", buyNowProduct);
console.log("FINAL PRODUCTS:", products);
console.log("FINAL PRODUCTS SENT:", products);

  try {
    const payload = {
      user_id,
      address,
      phone,
      payment_method,
      products,
    };

    const res = await axios.post(
      "http://localhost:8080/place-order",
      payload
    );

    console.log("ORDER RESPONSE:", res.data);

    if (res.data.status) {
      const order_id = res.data.order_id;
           navigate(
               payment_method === "cod"
               ? "/home/payment"
               : "/home/pendingpayment",
               { state: { order_id } }
           );
    } else {
      showToast(res.data.message || "Order failed ❌");
    }
    } catch (err) {
      console.log("Order error:", err);
      showToast("Server error while placing order ❌");
  }};
  return (
    <div className="place-order-container">
       {toast && (
           <div className="toast-message">
                {toast}
           </div>
       )}
      {/* LEFT */}
      <div className="left">
        <h2>Delivery Details</h2>

        <input
          placeholder="Enter Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}/>

        <input
          placeholder="Enter Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}/>
      </div>

      {/* RIGHT */}
      <div className="right">
        <h3>Order Summary</h3>

        {cart.length === 0 ? (
          <p>No items found</p>
        ) : (
          cart.map((item, i) => (
            <p key={i}>
              {item.name} × {item.quantity}
            </p>
          ))
        )}

        <h3>Total: ₹{total}</h3>

        <button onClick={() => placeOrder("cod")}>
          Continue to Payment
        </button>

        <button onClick={() => placeOrder("pending")}>
          Pay Later
        </button>
      </div>

    </div>
  );
}

export default PlaceOrder;