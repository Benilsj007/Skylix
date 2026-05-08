import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CSS/ProductDetails.css";

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);

  const [toast, setToast] = useState("");

  const showToast = (msg) => {
  setToast(msg);

  setTimeout(() => {
    setToast("");
  }, 3000); // auto hide after 3 sec
};

  useEffect(() => {
    axios
      .get(`http://localhost:8080/get-product/${id}`)
      .then((res) => {
        setProduct(res.data);
        setSelectedImage(res.data.image); 
        // GET SIMILAR PRODUCTS
        axios
          .get("http://localhost:8080/getProducts")
          .then((res2) => {
            const filtered = res2.data.data.filter(
            (item) =>
               item.category === res.data.category &&
               item.id !== res.data.id);
               setSimilarProducts(filtered.slice(0, 20));
            });
        })
        .catch((err) => console.log(err));
     }, [id]);

  if (!product)
    return (
      <div className="game-loader">
      <div className="spinner-ring"></div>
      <p>Loading...</p>
    </div> );

const addToCart = () => {
      const user_id = localStorage.getItem("user_id"); 
      if (!user_id) {
      showToast("Please login first 😊");
      return;
    }

  axios.post("http://localhost:8080/add-to-cart", {
    user_id: user_id,
    product_id: product.product_id
  })
  .then((res) => {
    if (res.data.status) {
      showToast("Added to cart 🛒");
    } else {
      showToast(res.data.message);
    }
  })
  .catch((err) => console.log(err));
};
const buyNow = () => {
  const user_id = localStorage.getItem("user_id");

  if (!user_id) {
    showToast("Login required 😺");
    return;
  }

  navigate("/home/placeorder", {
    state: {
      buyNowProduct: {
        product_id: product.product_id || product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      },
    },
  });
};
  return (
    <>
      <div className="product-page">
        {toast && (
             <div className="toast-message">
                  {toast}
             </div>
            )}

        {/* LEFT SIDE */}
        <div className="left-section">
          <button className="back_btn" onClick={() => navigate(-1)}>
        <img  src="/Images/back.png"/>
                  {/* ⬅️ Go Back */}
          </button>
          <div className="image-preview">
            <img
              src={`http://localhost:8080/uploads/${selectedImage}`}
              alt="product"
            />
          </div>

          <div className="thumbnail-row">
            {[product.image, product.image, product.image].map(
              (img, index) => (
                <img
                  key={index}
                  src={`http://localhost:8080/uploads/${img}`}
                  alt=""
                  onClick={() => setSelectedImage(img)}
                  className={
                    selectedImage === img ? "active-thumb" : ""} />
              ))}
          </div>

          {/* BUTTONS */}
          <div className="action-buttons">
              <button className="cart-btn" onClick={addToCart}>
                       ADD TO CART
              </button>
            <button className="buy-btn" onClick={buyNow}>BUY NOW</button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-section">
          <h2 className="title">{product.name}</h2>

          <div className="rating-box">
            <span className="rating-badge">4.4 ★</span>
            <span className="rating-count">11,306m ratings</span>
          </div>

          <div className="price-box">
            <span className="new-price">₹{product.price}</span>
          </div>

          <div className="offers">
            <h4>Available Offers</h4>
            <p>💳 Bank Offer ₹1500 off on Credit Card</p>
            <p>⚡ No Cost EMI Available</p>
            <p>🔄 Exchange Offer up to ₹2,000</p>
          </div>

          <div className="spec-table">
            <h4>Specifications</h4>

            {product.processor && (
              <p>
                <span>Processor</span> {product.processor}
              </p>
            )}
            {product.ram && (
              <p>
                <span>RAM</span> {product.ram}
              </p>
            )}
            {product.storage && (
              <p>
                <span>Storage</span> {product.storage}
              </p>
            )}
            {product.camera && (
              <p>
                <span>Camera</span> {product.camera}
              </p>
            )}
            {product.battery && (
              <p>
                <span>Battery</span> {product.battery}
              </p>
            )}
            {product.screen_size && (
              <p>
                <span>Display</span> {product.screen_size}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="similar-section">
        <h3>Similar Products</h3>
        <div className="similar-products">
          {similarProducts.length > 0 ? (
            similarProducts.map((item) => (
              <div
                key={item.id}
                className="similar-card"
                onClick={() => navigate(`/home/product/${item.id}`)}>
                <img src={`http://localhost:8080/uploads/${item.image}`}
                  alt={item.name}/>
                <p>{item.name}</p>
                <h6>₹{item.price}</h6>
              </div>
            ))
          ) : (
            <p>No similar products found</p>
          )}
        </div>
      </div>
    </>
  );}

export default ProductDetails;