import { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import "./CSS/Home.css";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  //  DEBOUNCED SEARCH
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim() !== "") {
        axios
          .get("http://localhost:8080/productfilter", {
            params: { search }
          })
          .then((res) => {
            setSuggestions(res.data.data || []);
            setShowDropdown(true);
          })
          .catch((err) => console.log(err));
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);
  
     return () => clearTimeout(delay);
  }, [search]);

  const handleSearchNavigation = (value) => {
  const text = value.toLowerCase();

  if (text.includes("mobile") ||
      text.includes("phone") ||
      text.includes("tab")
  ) {
    navigate("/home/mobile");
    return true;
  }

  if (text.includes("laptop")||
      text.includes("lap") ||
      text.includes("computer") ||
      text.includes("pc")
  ) {
    navigate("/home/laptop");
    return true;
  }

  if (
    text.includes("headphone") ||
    text.includes("earphone") ||
    text.includes("earbuds") ||
    text.includes("accessories")
  ) {
    navigate("/home/accessories");
    return true;
  }

  return false;
};

  return (
    <div className="home">

      {/* NAVBAR */}
     <nav className="navbar navbar-expand-lg navbar-dark px-3">

  {/* LOGO */}
  <span
    className="navbar-brand fw-bold"
    style={{ cursor: "pointer" }}
    onClick={() => navigate("/home")}>
    <img src="/Images/brand.png" alt="logo" />
  </span>

  {/* TOGGLER */}
  <button
    className="navbar-toggler"
    type="button"
    data-bs-toggle="collapse"
    data-bs-target="#navbarContent">
    <span className="navbar-toggler-icon"></span>
  </button>

  {/* NAV CONTENT */}
  <div className="collapse navbar-collapse w-100" id="navbarContent">

    {/* CENTER SEARCH */}
    {location.pathname === "/home" && (
      <div className="mx-auto w-50 position-relative">
        <input
  className="form-control"
  type="search"
  placeholder="Search for products..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onFocus={() => setShowDropdown(true)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      const redirected = handleSearchNavigation(search);

      if (!redirected) {
        navigate("/home");
      }
      setShowDropdown(false);
    }
  }}
/>

        {showDropdown && suggestions.length > 0 && (
          <div className="search-dropdown">
            {suggestions.map((item) => (
              <div
                key={item.id}
                className="search-item"
                onClick={() => {
  const redirected = handleSearchNavigation(item.name);

  if (!redirected) {
    navigate(`/home/product/${item.id}`);
  }

  setSearch("");
  setShowDropdown(false);
}}>
                <img src={`http://localhost:8080/uploads/${item.image}`}
                  alt=""/>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div> )}

    {/* RIGHT BUTTONS */}
    <div className="d-flex ms-auto gap-3 mt-3 mt-lg-0">
      <button
        className="btn btn-light"
        onClick={() => navigate("/login")}>
        Login
      </button>

      <button
        className="btn btn-warning"
        onClick={() => navigate("/home/cart")}>
        Cart
      </button>

      <button
        className="btn btn-danger"
        onClick={() => navigate("/home/pendingpayment")}>
        Pending
      </button>
    </div>
  </div>
</nav>
      {/* CATEGORY NAVBAR */}
      <div className="category-navbar">
        <ul className="category-list">
          <li onClick={() => navigate("/home/mobile")} title="Click to view mobile">
            <img src="/Images/p.png" alt="mobile" />
          </li>
          <li onClick={() => navigate("/home/laptop")} title="Click to view laptop">
            <img src="/Images/l.png" alt="laptop" />
          </li>
          <li onClick={() => navigate("/home/accessories")} title="Click to view Headphones">
            <img src="/Images/headphone.png" alt="Headphone" />
          </li>
        </ul>
      </div>

      {/* CHILD ROUTES */}
      <Outlet context={{ search }} />

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">

          <div className="footer-section">
            <span className="navbar-brand fw-bold">
              <img src="/Images/brand.png" alt="logo" />
            </span>
            <p>Your one-stop shop for mobiles, laptops, and more...</p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li onClick={() => navigate("/home")}>Home</li>
              <li onClick={() => navigate("/home/cart")}>Cart</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="socials">
              <span>Facebook ||</span>
              <span> Instagram ||</span>
              <span> Twitter</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Skylix. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default Home;