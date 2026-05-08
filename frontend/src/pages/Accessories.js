import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CSS/Mobile.css";

function Accessories() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/getProducts", {
        params: {
          category: "Accessories",
          brand: brand || undefined,
          price: price || undefined,
          sort: sort || undefined,
          search: search || undefined,         
        },
      })
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.log(err));
  }, [brand, price, sort,search]);

  return (
    <div className="container-fluid mt-3">
       <button className="back" onClick={() => navigate(-1)}>
        <img src="/Images/back.png"/>
                  {/* ⬅️ Go Back */}
          </button>
      <div className="row">

        {/* SIDEBAR */}
        <div className="filter col-lg-2 col-md-3 col-sm-12">
           <button className="filter-btn d-md-none"
                   onClick={() => setShowFilters(!showFilters)}>
                   🌪️ Filters
           </button>
    <div className={`sidebar ${showFilters ? "show" : ""}`}>
      <button className="close-btn"
                 onClick={() => setShowFilters(false)}>
                 ✖
         </button>
            <h5>Filters</h5>
        <div className="mb-3">
             <h6>Search By Name</h6>
             <input type="text" className="form-control"
                    placeholder="Search Headphones..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}/>
         </div>
            <div>
              <h6>Brand</h6>
              <p className={brand === "Realme" ? "active-filter" : ""}
                 onClick={() =>{setBrand("Realme"); setShowFilters(false);}}>
                 Realme
              </p>
              <p className={brand === "JBL" ? "active-filter" : ""}
                 onClick={() =>{setBrand("JBL"); setShowFilters(false);}}>
                 JBL
              </p>
              <p className={brand === "BoAt" ? "active-filter" : ""}
                 onClick={() =>{setBrand("BoAt"); setShowFilters(false);}}>
                 BoAt
              </p>
              <p className={brand === "Boult" ? "active-filter" : ""}
                 onClick={() =>{setBrand("Boult"); setShowFilters(false);}}>
                 Boult
              </p>
              <p className={brand === "Mivi" ? "active-filter" : ""}
                 onClick={() =>{setBrand("Mivi"); setShowFilters(false);}}>
                 Mivi
              </p>
              <p className={brand === "CMF" ? "active-filter" : ""}
                 onClick={() =>{setBrand("CMF"); setShowFilters(false);}}>
                 CMF
              </p>
              <p className={brand === "Samsung" ? "active-filter" : ""}
                 onClick={() =>{setBrand("Samsung"); setShowFilters(false);}}>
                 Samsung
              </p>
              <p className={brand === "" ? "active-filter" : ""}
                 onClick={() =>{setBrand(""); setShowFilters(false);}}>
                 All
              </p>
            </div>
            <hr />

            {/* PRICE */}
            <div>
              <h6>Price</h6>
              <p className={price === 1000 ? "active-filter" : ""}
                 onClick={() =>{setPrice(1000); setShowFilters(false);}}>
                 Below ₹1000
              </p>
              <p className={price === 2000 ? "active-filter" : ""}
                 onClick={() =>{setPrice(2000); setShowFilters(false);}}>
                 Below ₹2000
              </p>
              <p className={price === 5000 ? "active-filter" : ""}
                 onClick={() =>{setPrice(5000); setShowFilters(false);}}>
                 Below ₹5000
              </p>
              <p className={price === 10000 ? "active-filter" : ""}
                 onClick={() =>{setPrice(10000); setShowFilters(false);}}>
                 Below ₹10,000
              </p>
              <p className={price === "" ? "active-filter" : ""}
                 onClick={() =>{setPrice(""); setShowFilters(false);}}>
                 All
              </p>
            </div>
            <hr />

            {/* SORT */}
            <div>
              <h6>Sort</h6>
              <p className={sort === "low" ? "active-filter" : ""}
                 onClick={() =>{setSort("low"); setShowFilters(false);}}>
                 Price Low → High
              </p>
              <p className={sort === "high" ? "active-filter" : ""}
                 onClick={() =>{setSort("high"); setShowFilters(false);}}>
                 Price High → Low
              </p>
              <p className={sort === "" ? "active-filter" : ""}
                 onClick={() =>{setSort(""); setShowFilters(false);}}>
                 Default
              </p>
            </div>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="col-lg-10 col-md-9 col-sm-12">
          <div className="row">
            {products.length > 0 ? (
              products.map((item) => (
                <div
                  className="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex"
                  key={item.id}
                  onClick={() => navigate(`/home/product/${item.id}`)}>
                  <div className="card product-card">
                    <img
                      src={`http://localhost:8080/uploads/${item.image}`}
                      className="card-img-top"
                      alt={item.name}/>
                    <div className="card-body">
                      <h6>{item.name}</h6>
                      <div className="rating">⭐ 4.3</div>
                      <p>₹{item.price}</p>

                      <span className="stock">
                          {item.stock > 0
                          ? "In Stock 😁😁": "Out of Stock 😞😞"}
                          <span className="stock">{item.stock}</span>
                      </span>
                      <br />
                     <small>{item.type}</small>
                     <small>{item.power}</small> 
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h5 className="text-center mt-5">No products found</h5>
            )}
          </div>
        </div>
      </div>
    </div>
  );}

export default Accessories;