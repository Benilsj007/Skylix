import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CSS/Mobile.css";

function Mobiles() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  //  FILTER STATES
  const [brand, setBrand] = useState("");
  const [processor, setProcessor] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [camera, setCamera] = useState("");
  const [battery, setBattery] = useState("");
  const [charger, setCharger] = useState("");

  const [search, setSearch] = useState("");
  //  FETCH FROM BACKEND
  useEffect(() => {
    axios
      .get("http://localhost:8080/getProducts", {
        params: {
          category: "Mobile",
          brand: brand || undefined,
          price: price || undefined,
          sort: sort || undefined,
          ram: ram || undefined,
          storage: storage || undefined,
          camera: camera || undefined,
          battery: battery || undefined,
          charger: charger || undefined,
          processor: processor || undefined,
          search: search || undefined,
        },
      })
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.log(err));
  }, [brand, price, sort,processor, ram, storage, camera, battery, charger, search]);

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
                     ☰ Filters
             </button>
       <div className={`sidebar ${showFilters ? "show" : ""}`}>
         <button className="close-btn"
                 onClick={() => setShowFilters(false)}>
                 ✖
         </button>
            <h5>Filters</h5>
       <div className="mb-3">
            <h6>🔍 By Processor Or Name</h6>
       <input type="text"
              className="form-control"
              placeholder="Search mobiles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}/>
       </div>
<hr/>
       <div>
      <h6>Brand</h6>

       <p className={brand === "Samsung" ? "active-filter" : ""}
          onClick={() =>{setBrand("Samsung"); setShowFilters(false);}}>
          Samsung
       </p>
       <p className={brand === "Apple" ? "active-filter" : ""}
          onClick={() =>{ setBrand("Apple"); setShowFilters(false);}}>
          Apple
      </p>
      <p className={brand === "iQOO" ? "active-filter" : ""}
         onClick={() =>{setBrand("iQOO"); setShowFilters(false);}}>
         iQOO
      </p>
      <p className={brand === "VIVO" ? "active-filter" : ""}
         onClick={() =>{setBrand("VIVO"); setShowFilters(false);}}>
         VIVO
      </p>
      <p className={brand === "OPPO" ? "active-filter" : ""}
         onClick={() =>{setBrand("OPPO");setShowFilters(false);}}>
         OPPO
      </p>
      <p className={brand === "Realme" ? "active-filter" : ""}
         onClick={() =>{setBrand("Realme");setShowFilters(false);}}>
         Realme
      </p>
      <p className={brand === "" ? "active-filter" : ""}
         onClick={() =>{setBrand("");setShowFilters(false);}}>
         All
      </p>
    </div>
<hr/>

    <div>
    <h6>Processor</h6>

    <p className={processor === "Snapdragon" ? "active-filter" : ""}
       onClick={() => { setProcessor("Snapdragon"); setShowFilters(false); }}>
       Snapdragon
    </p>
    <p className={processor === "MediaTek" ? "active-filter" : ""}
       onClick={() => { setProcessor("MediaTek"); setShowFilters(false); }}>
       MediaTek
    </p>
    <p className={processor === "Apple" ? "active-filter" : ""}
       onClick={() => { setProcessor("Apple"); setShowFilters(false); }}>
       Apple
    </p>
    <p className={processor === "Exynos" ? "active-filter" : ""}
       onClick={() => { setProcessor("Exynos"); setShowFilters(false); }}>
       Exynos
    </p>
    <p className={processor === "Unisoc" ? "active-filter" : ""}
       onClick={() => { setProcessor("Unisoc"); setShowFilters(false); }}>
       Unisoc
    </p>
    <p className={processor === "" ? "active-filter" : ""}
       onClick={() => { setProcessor(""); setShowFilters(false); }}>
       All
    </p>
  </div>
<hr/>

    <div>
      <h6>RAM</h6>
       <p className={ram === 2 ? "active-filter" : ""} 
           onClick={() =>{setRam(2); setShowFilters(false);}}>2GB</p>
       <p className={ram === 4 ? "active-filter" : ""}
           onClick={() =>{setRam(4); setShowFilters(false);}}>4GB</p>
       <p className={ram === 6 ? "active-filter" : ""}
           onClick={() =>{setRam(6); setShowFilters(false);}}>6GB</p>
       <p className={ram === 8 ? "active-filter" : ""}
           onClick={() =>{setRam(8); setShowFilters(false);}}>8GB</p>
       <p className={ram === 12 ? "active-filter" : ""}
           onClick={() =>{setRam(12); setShowFilters(false);}}>12GB</p>
       <p className={ram === "" ? "active-filter" : ""}
           onClick={() =>{setRam(""); setShowFilters(false);}}>All</p>
    </div>
<hr/>

    <div>
      <h6>Storage</h6>
      <p className={storage === 32 ? "active-filter" : ""}
         onClick={() =>{setStorage(32); setShowFilters(false);}}>32GB</p>
      <p className={storage === 64 ? "active-filter" : ""}
         onClick={() =>{setStorage(64); setShowFilters(false);}}>64GB</p>
      <p className={storage === 128 ? "active-filter" : ""}
         onClick={() =>{setStorage(128); setShowFilters(false);}}>128GB</p>
      <p className={storage === 256 ? "active-filter" : ""}
         onClick={() =>{setStorage(256); setShowFilters(false);}}>256GB</p>
      <p className={storage === 512 ? "active-filter" : ""}
         onClick={() =>{setStorage(512); setShowFilters(false);}}>512GB</p>
      <p className={storage === "" ? "active-filter" : ""}
         onClick={() =>{setStorage(""); setShowFilters(false);}}>All</p>
    </div>
<hr/>

    <div>
      <h6>Camera</h6>
       <p className={camera === 12 ? "active-filter" : ""}
          onClick={() =>{setCamera(12); setShowFilters(false);}}>12MP+</p>
       <p className={camera === 48 ? "active-filter" : ""}
          onClick={() =>{setCamera(48); setShowFilters(false);}}>48MP+</p>
       <p className={camera === 64 ? "active-filter" : ""}
          onClick={() =>{setCamera(64); setShowFilters(false);}}>64MP+</p>
       <p className={camera === 108 ? "active-filter" : ""}
          onClick={() =>{setCamera(108); setShowFilters(false);}}>108MP+</p>
       <p className={camera === "" ? "active-filter" : ""}
          onClick={() =>{setCamera(""); setShowFilters(false);}}>All</p>
    </div>
<hr/>

    <div>
      <h6>Battery</h6>
       <p className={battery === 3000 ? "active-filter" : ""}
          onClick={() =>{setBattery(3000); setShowFilters(false);}}>3000mAh+</p>
       <p className={battery === 4000 ? "active-filter" : ""}
          onClick={() =>{setBattery(4000); setShowFilters(false);}}>4000mAh+</p>
       <p className={battery === 5000 ? "active-filter" : ""}
          onClick={() =>{setBattery(5000); setShowFilters(false);}}>5000mAh+</p>
       <p className={battery === 6000 ? "active-filter" : ""}
          onClick={() =>{setBattery(6000); setShowFilters(false);}}>6000mAh+</p>
       <p className={battery === "" ? "active-filter" : ""}
          onClick={() =>{setBattery(""); setShowFilters(false);}}>All</p>
    </div>
<hr/>

    <div>
      <h6>Charger</h6>
      <p className={charger === 18 ? "active-filter" : ""}
         onClick={() =>{setCharger(18); setShowFilters(false);}}>18W+</p>
      <p className={charger === 33 ? "active-filter" : ""}
         onClick={() =>{setCharger(33); setShowFilters(false);}}>33W+</p>
      <p className={charger === 44 ? "active-filter" : ""}
         onClick={() =>{setCharger(44); setShowFilters(false);}}>67W+</p>
      <p className={charger === 67 ? "active-filter" : ""}
         onClick={() =>{setCharger(67); setShowFilters(false);}}>120W+</p>
      <p className={charger === "" ? "active-filter" : ""}
         onClick={() =>{setCharger(""); setShowFilters(false);}}>All</p>
    </div>
<hr/>

    <div>
      <h6>Price</h6>
      <p className={price === 10000 ? "active-filter" : ""}
         onClick={() =>{setPrice(10000);setShowFilters(false);}}>
         Below ₹10,000
      </p>
       <p className={price === 20000 ? "active-filter" : ""}
         onClick={() =>{setPrice(20000);setShowFilters(false);}}>
         Below ₹20,000
      </p>
       <p className={price === 30000 ? "active-filter" : ""}
         onClick={() =>{setPrice(30000);setShowFilters(false);}}>
         Below ₹30,000
      </p>
       <p className={price === 50000 ? "active-filter" : ""}
         onClick={() =>{setPrice(50000);setShowFilters(false);}}>
         Below ₹50,000
      </p>
       <p className={price === "" ? "active-filter" : ""}
         onClick={() =>{setPrice("");setShowFilters(false);}}>
         ALL
       </p>
     </div>
    <hr/>

    <div>
      <h6>Sort</h6>
       <p className={sort === "low" ? "active-filter" : ""}
         onClick={() =>{setSort("low");setShowFilters(false);}}>
         Price Low → High
      </p>
       <p className={sort === "high" ? "active-filter" : ""}
         onClick={() =>{setSort("high");setShowFilters(false);}}>
         Price High → Low
      </p>
       <p className={sort === "" ? "active-filter" : ""}
         onClick={() =>{setSort("");setShowFilters(false);}}>
         Default
      </p>
    </div>
  </div>
</div>

        <div className="col-md-9">
             <div className="row">
                  {products.length > 0 ? (
                  products.map((item) => (
        <div
          className="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex"
          key={item.id}
          onClick={() => navigate(`/home/product/${item.id}`)}>
          <div className="card product-card">
            {/* IMAGE */}
            <img
              src={`http://localhost:8080/uploads/${item.image}`}
              className="card-img-top"
              alt=""/>

            <div className="card-body">

              <h6>{item.name}</h6>
              <div className="rating">⭐ 4.3</div>
              <p>₹{item.price}</p>
              <span className="stock">
                {item.stock > 0 ? "In Stock 😁😁" : "Out of Stock 😞😞"}
                <span className="stock text-danger fw-bold"><strong>{item.stock}</strong></span>
              </span> <br/>
              <small>{item.mobile_ram}</small>
              <small>{item.mobile_processor}</small>

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

export default Mobiles;