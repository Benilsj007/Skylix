import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../redux/productSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
/* SWIPER */
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import "./CSS/ProductData.css";


function ProductData() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [debouncedSearch, setDebouncedSearch] = useState(search);
  const { search } = useOutletContext();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const products = useSelector((state) => state.products.products);

  // ✅ SINGLE API CALL (with pagination + search)
  useEffect(() => {
    axios
      .get("http://localhost:8080/getProducts", {
        params: {
          page,
          search // 🔥 send search to backend
        }
      })
      .then((res) => {
        dispatch(setProducts(res.data.data));
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.log(err));
  }, [dispatch, page, search]);

  return (
    <>
      {/* CAROUSEL */}
      <div className="carousel">
        <Swiper modules={[Autoplay]} autoplay={{ delay: 2500 }} loop={true}>
          <SwiperSlide onClick={() => navigate("/home/product/27")}>
            <img src="/Images/iqoo.png" alt="IQOO" />
          </SwiperSlide>
          <SwiperSlide onClick={() => navigate("/home/product/25")}>
            <img src="/Images/asus.png" alt="ASUS" />
          </SwiperSlide>
          <SwiperSlide onClick={() => navigate("/home/product/26")}>
            <img src="/Images/jbl.png" alt="JBL" />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* PRODUCTS */}
      <div className="products-section">
        {products.length > 0 ? (
          products.map((item) => (
            <div
              className="product-card"
              key={item.id}
              onClick={() => navigate(`/home/product/${item.id}`)}
            >
              <img
                src={`http://localhost:8080/uploads/${item.image}`}
                alt={item.name}
              />
              <h6>{item.name}</h6>
              <p className="price">₹{item.price}</p>
            </div>
          ))
        ) : (
          <h5>No products found</h5>
        )}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
  <button 
    disabled={page === 1} 
    onClick={() => setPage(page - 1)}
  >
    Prev
  </button>

  {[...Array(totalPages)].map((_, i) => (
    <button
      key={i}
      className={page === i + 1 ? "active-page" : ""}
      onClick={() => setPage(i + 1)}
    >
      {i + 1}
    </button>
  ))}

  <button 
    disabled={page === totalPages} 
    onClick={() => setPage(page + 1)}
  >
    Next
  </button>
</div>
    </>
  );
}

export default ProductData;