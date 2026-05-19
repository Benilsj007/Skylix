import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CSS/Cart.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Cart() {

  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  // GET CART
  const fetchCart = () => {
    const user_id = localStorage.getItem("user_id");

    if (!user_id) {
      console.log("No user logged in");
      return;
    }
    axios
      .get(`http://localhost:8080/get-cart/${user_id}`)
      .then((res) => setCart(res.data))
      .catch((err) => console.log(err));
  };

  // INCREASE QTY
  const increaseQty = (item) => {
    axios
      .post("http://localhost:8080/update-cart", {
        cart_id: item.cart_id,
        quantity: Number(item.quantity) + 1,
      })
      .then(() => {
        fetchCart();
        toast.success("Quantity increased "); // added toast
      })
      .catch((err) => console.log(err));
  };

  // DECREASE QTY
const decreaseQty = (item) => {
    if (item.quantity <= 1) return;
        axios.post("http://localhost:8080/update-cart", {
              cart_id: item.cart_id,
              quantity: Number(item.quantity) - 1,
      })
      .then(() => {
        fetchCart();
        toast.success("Quantity decreased "); //  added toast
      })
      .catch((err) => console.log(err));
  };

  // REMOVE ITEM
const removeItem = (cart_id) => {
    axios.post("http://localhost:8080/remove-cart", { cart_id })
        .then(() => {
        fetchCart();
        toast.success("Item removed from cart ");
      })
      .catch(() => toast.error("Failed to remove item "));
  };

  // TOTAL PRICE
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity,0);

  return (
    <div className="cart-container">
     <ToastContainer
        position="top-right"
        autoClose={2000}/>

      <div className="cart-left">
        {cart.length > 0 ? (
          cart.map((item) => (
            <div className="cart-item" key={item.cart_id}>
              <img
                src={`http://localhost:8080/uploads/${item.image}`}
                alt=""
              />

              <div>
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>

                <div>
                  <button onClick={() => decreaseQty(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item)}>+</button>
                </div>

                <button onClick={() => removeItem(item.cart_id)}>
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <h2 style={{ textAlign: "center" }}>
            Your Cart is Empty 🛒!!!
          </h2>
        )}
      </div>

      <div className="cart-right">
        <h3>Price Details</h3>
        <p>Total: ₹{total}</p>

        <button
          onClick={() =>
            navigate("/home/placeorder", { state: { cart, total } })
          }>
          Place Order
        </button>
      </div>
    </div>
  );
}

export default Cart;