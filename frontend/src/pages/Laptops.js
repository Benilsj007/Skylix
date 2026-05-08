import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CSS/Mobile.css";

function Laptop() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  //  FILTER STATES
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("");
  const [ram, setRam] = useState("");
  const [processor, setProcessor] = useState("");
  const [storage, setStorage] = useState("");
  const [charger, setCharger] = useState("");
  const [graphicsCard, setGraphicsCard] = useState("");
  const [screenSize, setScreenSize] = useState("");
  
  const [search, setSearch] = useState("");

  //  FETCH FROM BACKEND
  useEffect(() => {
    axios
      .get("http://localhost:8080/getProducts", {
        params: {
          category: "Laptop",
          brand: brand || undefined,
          price: price || undefined,
          sort: sort || undefined,
          ram: ram || undefined,
          storage: storage || undefined,
          charger: charger || undefined,
          processor: processor || undefined,
          graphicsCard: setGraphicsCard || undefined,
          screenSize: screenSize || undefined,
          search: search || undefined,
        },
      })
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.log(err));
  }, [brand, price, sort, processor, ram, storage, charger, graphicsCard, screenSize, search]);

  return (
    <div className="container-fluid mt-3">
       <button className="back" onClick={() => navigate(-1)}>
        <img src="/Images/back.png"/>
                  {/* ⬅️ Go Back */}
          </button>
      <div className="row">

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
            <h6>Search By Processor Or Name</h6>
            <input type="text"
                   className="form-control"
                   placeholder="Search laptops..."
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}/>
        </div>

          <div>
            <h6>Brand</h6>
            <p className={brand === "ASUS" ? "active-filter" : ""}
               onClick={() =>{setBrand("ASUS");setShowFilters(false);}}>
               ASUS
           </p>
           <p className={brand === "HP" ? "active-filter" : ""}
               onClick={() =>{setBrand("HP");setShowFilters(false);}}>
               HP
           </p>
           <p className={brand === "Lenova" ? "active-filter" : ""}
               onClick={() =>{setBrand("Lenova");setShowFilters(false);}}>
               Lenova
           </p>
           <p className={brand === "DELL" ? "active-filter" : ""}
               onClick={() =>{setBrand("DELL");setShowFilters(false);}}>
               DELL
           </p>
           <p className={brand === "Apple" ? "active-filter" : ""}
               onClick={() =>{setBrand("Apple");setShowFilters(false);}}>
               Apple
           </p>
           <p className={brand === "MSI" ? "active-filter" : ""}
               onClick={() =>{setBrand("MSI");setShowFilters(false);}}>
               MSI
           </p>
           <p className={brand === "Samsung" ? "active-filter" : ""}
               onClick={() =>{setBrand("Samsung");setShowFilters(false);}}>
               Samsung
           </p>
           <p className={brand === "" ? "active-filter" : ""}
               onClick={() =>{setBrand("");setShowFilters(false);}}>
               ALL
           </p>
         </div>
          <hr />

          <div>
          <h6>Processor</h6>
          <p className={processor === "Apple" ? "active-filter" : ""}
             onClick={() => { setProcessor("Apple"); setShowFilters(false); }}>
             Apple
          </p>
          <p className={processor === "intel" ? "active-filter" : ""}
             onClick={() => { setProcessor("intel"); setShowFilters(false); }}>
             Intel
          </p>
          <p className={processor === "AMD" ? "active-filter" : ""}
             onClick={() => { setProcessor("AMD"); setShowFilters(false); }}>
             AMD Ryzen
          </p>
          <p className={processor === "" ? "active-filter" : ""}
             onClick={() => { setProcessor(""); setShowFilters(false); }}>
             All
          </p>
      </div>
<hr />

      <div>
          <h6>RAM</h6>
          <p className={ram === 4 ? "active-filter" : ""} 
             onClick={() =>{setRam(4); setShowFilters(false);}}>4GB</p>
          <p className={ram === 8 ? "active-filter" : ""}
             onClick={() =>{setRam(8); setShowFilters(false);}}>8GB</p>
          <p className={ram === 12 ? "active-filter" : ""}
             onClick={() =>{setRam(12); setShowFilters(false);}}>12GB</p>
          <p className={ram === 16 ? "active-filter" : ""}
             onClick={() =>{setRam(16); setShowFilters(false);}}>16GB</p>
          <p className={ram === 32 ? "active-filter" : ""}
             onClick={() =>{setRam(32); setShowFilters(false);}}>32GB</p>
          <p className={ram === "" ? "active-filter" : ""}
             onClick={() =>{setRam(""); setShowFilters(false);}}>All</p>
    </div>
<hr/>

     <div>
         <h6>Storage</h6>
         <p className={storage === 512 ? "active-filter" : ""}
            onClick={() =>{setStorage(512); setShowFilters(false);}}>512GB</p>
         <p className={storage === "1TB" ? "active-filter" : ""}
            onClick={() =>{setStorage("1TB"); setShowFilters(false);}}>1TB</p>
         <p className={storage === "2TB" ? "active-filter" : ""}
            onClick={() =>{setStorage("2TB"); setShowFilters(false);}}>2TB</p>
         <p className={storage === "" ? "active-filter" : ""}
            onClick={() =>{setStorage(""); setShowFilters(false);}}>All</p>
    </div>
<hr/>
      
      <div>
      <h6>Charger</h6>
      <p className={charger === 75 ? "active-filter" : ""}
         onClick={() =>{setCharger(75); setShowFilters(false);}}>75W+</p>
      <p className={charger === 120 ? "active-filter" : ""}
         onClick={() =>{setCharger(120); setShowFilters(false);}}>120W+</p>
      <p className={charger === 144 ? "active-filter" : ""}
         onClick={() =>{setCharger(144); setShowFilters(false);}}>144W+</p>
      <p className={charger === "" ? "active-filter" : ""}
         onClick={() =>{setCharger(""); setShowFilters(false);}}>All</p>
    </div>
<hr />

    <div>
    <h6>Screen Size</h6>
    <p className={screenSize === "13.6" ? "active-filter" : ""}
       onClick={() => { setScreenSize("13.6"); setShowFilters(false); }}>
       13.6 Inch
    </p>
    <p className={screenSize === "15.6" ? "active-filter" : ""}
       onClick={() => { setScreenSize("15.6"); setShowFilters(false); }}>
       15.6 Inch
    </p>
    <p className={screenSize === "16" ? "active-filter" : ""}
       onClick={() => { setScreenSize("16"); setShowFilters(false); }}>
       16 Inch
    </p>
    <p className={screenSize === "18" ? "active-filter" : ""}
    onClick={() => {
      setScreenSize("18");
      setShowFilters(false);
    }}
  >
    18 Inch </p>
    <p className={screenSize === "" ? "active-filter" : ""}
       onClick={() => { setScreenSize(""); setShowFilters(false); }}>
       All
    </p>
  </div>
<hr />
      
          <div>
            <h6>Price</h6>
            <p className={price === 50000 ? "active-filter" : ""}
               onClick={() => {setPrice(50000);setShowFilters(false);}}>
               Below ₹50,000
            </p>
            <p className={price === 100000 ? "active-filter" : ""}
               onClick={() =>{setPrice(100000);setShowFilters(false);}}>
               Below ₹100,000
            </p>
            <p className={price === 150000 ? "active-filter" : ""}
               onClick={() =>{setPrice(150000);setShowFilters(false);}}>
               Below ₹150,000
            </p>
            <p className={price === 200000 ? "active-filter" : ""}
               onClick={() =>{setPrice(200000);setShowFilters(false);}}>
               Below ₹200,000
            </p>
            <p className={price === ""? "active-filter" : ""}
               onClick={() =>{setPrice("");setShowFilters(false);}}>
               ALL
            </p>
          </div>
  <hr />
          
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
           <div className="col-lg-3 col-md-4 col-sm-6 mb-4 d-flex"
                key={item.id}
                onClick={() => navigate(`/home/product/${item.id}`)}>
           <div className="card product-card">
            <img
              src={`http://localhost:8080/uploads/${item.image}`}
              className="card-img-top" alt=""/>

            <div className="card-body">
              <h6>{item.name}</h6>
              <div className="rating">⭐ 4.3</div>
              <p>₹{item.price}</p>
              <span className="stock">
                {item.stock > 0 ? "In Stock 😁😁" : "Out of Stock 😞😞"}
                <span className="stock">{item.stock}</span>
              </span> <br/>
              <small>{item.laptop_ram}</small>
              <small>{item.laptop_processor}</small>
            </div>
          </div>
        </div>
      ))
    ) : (
      <h5 className="text-center mt-5">No products found 🥹</h5>
    )}
  </div>
</div>
      </div>
    </div>
  );
}

export default Laptop;