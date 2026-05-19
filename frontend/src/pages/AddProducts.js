import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// Redux actions
import { addMobile } from "../redux/MobileSlice";
import { addLaptop } from "../redux/LaptopSlice";
import { addElectronics } from "../redux/ElectronicsSlice";

function AddProduct() {
  const [toast, setToast] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // COMMON
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [stock, setStock] = useState("0");

  // MOBILE + LAPTOP
  const [processor, setProcessor] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [camera, setCamera] = useState("");
  const [battery, setBattery] = useState("");
  const [charger, setCharger] = useState("");
  const [graphics, setGraphics] = useState("");
  const [screensize, setScreenSize] = useState("");
  const [brand, setBrand] = useState("");

  // Accessories
  const [type, setType] = useState("");
  const [power, setPower] = useState("");
  const [warranty, setWarranty] = useState("");

  const resetForm = () => {
    setName("");
    setCategory("");
    setPrice("");
    setDescription("");
    setImage(null);
    setStock("0");
    setProcessor("");
    setRam("");
    setStorage("");
    setCamera("");
    setBattery("");
    setCharger("");
    setGraphics("");
    setScreenSize("");
    setBrand("");
    setType("");
    setPower("");
    setWarranty("");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const addProduct = async () => {
    try {
      // 🔥 FIXED: correct localStorage handling
      const stored = JSON.parse(localStorage.getItem("user"));

      if (!stored) {
        showToast("User not found. Please login again.");
        return;
      }

      const user = stored.user || stored; // supports both formats

      const formData = new FormData();

      // STORE INFO
      formData.append("store_id", user.user_id);
      formData.append("store_name", user.name);

      // COMMON
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", Number(price));
      formData.append("description", description);
      formData.append("image", image);
      formData.append("stock", Number(stock));

      // MOBILE + LAPTOP
      formData.append("processor", processor);
      formData.append("ram", ram);
      formData.append("storage", storage);
      formData.append("camera", camera);
      formData.append("battery", battery);
      formData.append("charger", charger);
      formData.append("graphics_card", graphics);
      formData.append("screen_size", screensize);
      formData.append("brand", brand);

      // ACCESSORIES
      formData.append("type", type);
      formData.append("power", power);
      formData.append("warranty", warranty);

      // Debug (VERY IMPORTANT)
      console.log("STORE ID:", user.user_id);
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await axios.post("/add-product", formData);

      const newProduct = res.data.product;

      // Redux update
      if (category === "Mobile") {
        dispatch(addMobile(newProduct));
      } else if (category === "Laptop") {
        dispatch(addLaptop(newProduct));
      } else if (category === "Accessories") {
        dispatch(addElectronics(newProduct));
      }

      showToast(res.data.message || "Product Added Successfully ✅");
      resetForm();
    } catch (error) {
      console.log("Add Product Error:", error);
      showToast("Something went wrong!");
    }
  };

  return (
    <div className="container mt-5">
      {toast && <div className="toast-message">{toast}</div>}

      <h2>Add Product</h2>

      <input
        className="form-control mt-2 mb-3"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="form-control mt-2 mb-3"
        placeholder="Product Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />

      <select
        value={category}
        className="form-control mt-2 mb-3"
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="Mobile">Mobile</option>
        <option value="Laptop">Laptop</option>
        <option value="Accessories">Accessories</option>
      </select>

      <input
        type="number"
        value={price}
        className="form-control mt-2 mb-3"
        placeholder="Price"
        onChange={(e) => setPrice(e.target.value)}
      />

      <textarea
        value={description}
        className="form-control mt-2 mb-3"
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        className="form-control mt-2 mb-3"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <input
        type="number"
        value={stock}
        className="form-control mt-2 mb-3"
        placeholder="Stock"
        onChange={(e) => setStock(e.target.value)}
      />

      {/* MOBILE */}
      {category === "Mobile" && (
        <>
          <h5>Mobile Details</h5>
          <input className="form-control mb-2" placeholder="Processor" onChange={(e) => setProcessor(e.target.value)} />
          <input className="form-control mb-2" placeholder="RAM" onChange={(e) => setRam(e.target.value)} />
          <input className="form-control mb-2" placeholder="Storage" onChange={(e) => setStorage(e.target.value)} />
          <input className="form-control mb-2" placeholder="Camera" onChange={(e) => setCamera(e.target.value)} />
          <input className="form-control mb-2" placeholder="Battery" onChange={(e) => setBattery(e.target.value)} />
          <input className="form-control mb-2" placeholder="Charger" onChange={(e) => setCharger(e.target.value)} />
        </>
      )}

      {/* LAPTOP */}
      {category === "Laptop" && (
        <>
          <h5>Laptop Details</h5>
          <input className="form-control mb-2" placeholder="Processor" onChange={(e) => setProcessor(e.target.value)} />
          <input className="form-control mb-2" placeholder="RAM" onChange={(e) => setRam(e.target.value)} />
          <input className="form-control mb-2" placeholder="Storage" onChange={(e) => setStorage(e.target.value)} />
          <input className="form-control mb-2" placeholder="Graphics" onChange={(e) => setGraphics(e.target.value)} />
          <input className="form-control mb-2" placeholder="Screen Size" onChange={(e) => setScreenSize(e.target.value)} />
        </>
      )}

      {/* ACCESSORIES */}
      {category === "Accessories" && (
        <>
          <h5>Accessories Details</h5>
          <input className="form-control mb-2" placeholder="Type" onChange={(e) => setType(e.target.value)} />
          <input className="form-control mb-2" placeholder="Power" onChange={(e) => setPower(e.target.value)} />
          <input className="form-control mb-2" placeholder="Warranty" onChange={(e) => setWarranty(e.target.value)} />
        </>
      )}

      <button className="btn btn-success mt-3" onClick={addProduct}>
        Add Product
      </button>

      <button className="btn btn-dark mt-3 ms-3" onClick={() => navigate("/admin/products")}>
        View Products
      </button>

      <button className="btn btn-secondary mt-3 ms-3" onClick={() => navigate("/admin/products")}>
        Cancel
      </button>
    </div>
  );
}

export default AddProduct;