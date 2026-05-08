import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateProduct } from "../redux/productSlice";
import { updateMobile } from "../redux/MobileSlice";
import { updateLaptop } from "../redux/LaptopSlice";
import { updateElectronics } from "../redux/ElectronicsSlice";
import { useEffect, useState } from "react";
import "./CSS/product.css";

function EditProduct() {
const [toast, setToast] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [editProduct, setEditProduct] = useState(null);

  // COMMON
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");

  // MOBILE + LAPTOP
  const [processor, setProcessor] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [camera, setCamera] = useState("");
  const [battery, setBattery] = useState("");
  const [charger, setCharger] = useState("");
  const [graphics, setGraphics] = useState("");
  const [screenSize, setScreenSize] = useState("");

  // ELECTRONICS
  const [type, setType] = useState("");
  const [power, setPower] = useState("");
  const [warranty, setWarranty] = useState("");

const showToast = (msg) => {
  setToast(msg);
  setTimeout(() => {
    setToast("");
  }, 3000); // auto hide after 3 sec
};
  // FETCH PRODUCT 
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = location.state?.product?.product_id || location.state?.product?.id;

        const res = await axios.get(
          `http://localhost:8080/get-product/${productId}`);

        const p = res.data;

        setEditProduct(p);

        setName(p.name || "");
        setCategory(p.category || "");
        setPrice(p.price || "");
        setDescription(p.description || "");
        setStock(p.stock || "");
        setBrand(p.brand || "");

        setProcessor(p.processor || "");
        setRam(p.ram || "");
        setStorage(p.storage || "");
        setCamera(p.camera || "");
        setBattery(p.battery || "");
        setCharger(p.charger || "");

        setGraphics(p.graphics_card || "");
        setScreenSize(p.screen_size || "");

        setType(p.type || "");
        setPower(p.power || "");
        setWarranty(p.warranty || "");
      } catch (err) {
        console.log("Fetch Error:", err);
    }};

    fetchProduct();
  }, [location.state]);

  // UPDATE PRODUCT 
  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("stock", stock);
      formData.append("brand", brand);

      if (image instanceof File) {
        formData.append("image", image);
      }

      if (category === "Mobile") {
        formData.append("processor", processor);
        formData.append("ram", ram);
        formData.append("storage", storage);
        formData.append("camera", camera);
        formData.append("battery", battery);
        formData.append("charger", charger);
      }

      if (category === "Laptop") {
        formData.append("processor", processor);
        formData.append("ram", ram);
        formData.append("storage", storage);
        formData.append("charger", charger);
        formData.append("graphics_card", graphics);
        formData.append("screen_size", screenSize);
      }

      if (category === "Accessories") {
        formData.append("type", type);
        formData.append("power", power);
        formData.append("warranty", warranty);
      }

      // FIXED ID
      const productId = editProduct?.product_id || editProduct?.id;

      const res = await axios.post(
        `http://localhost:8080/update-product/${productId}`,
        formData
      );

      const updatedData = {
        id: productId,
        name,
        brand,
        category,
        price,
        description,
        stock,
        image: image instanceof File ? image.name : editProduct?.image,
      };

      dispatch(updateProduct(updatedData));

      if (category === "Mobile") {
        dispatch(updateMobile(updatedData));
      } else if (category === "Laptop") {
        dispatch(updateLaptop(updatedData));
      } else {
        dispatch(updateElectronics(updatedData));
      }

      showToast(res?.data?.message || "Updated Successfully ✅");
      navigate("/admin/products");

    } catch (err) {
      console.log("Update Error:", err);
      showToast(err?.response?.data?.message || "Update Failed ❌");
    }
  };
  // Loading 
    if (!editProduct) {
  return (       
    <div className="game-loader">
      <div className="spinner-ring"></div>
      <p>Loading...</p>
    </div>
  );
}

  return (
    <div className="container mt-4">
       {toast && (
    <div className="toast-message">
         {toast}
    </div>)}
      <div className="card p-4 edit-product-card">
        <h4>Edit Product</h4>
      
        <span className="fw-bold text-muted mt-4">Edit Name</span>
        <input className="form-control mt-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"/>
        
        <span className="fw-bold text-muted mt-4">Edit Brand</span>
        <input className="form-control mt-2"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Brand"/>

        <span className="fw-bold text-muted mt-4">Edit Category</span>
        <select className="form-control mt-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select</option>
          <option value="Mobile">Mobile</option>
          <option value="Laptop">Laptop</option>
          <option value="Accessories">Accessories</option>
        </select>

        <span className="fw-bold text-muted mt-4">Edit Price</span>
        <input className="form-control mt-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"/>

        <span className="fw-bold text-muted mt-4">Edit Description</span>
        <input className="form-control mt-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"/>

      <span className="fw-bold text-muted mt-4">Edit Image</span>
        {/* SAFE IMAGE */}
       {editProduct?.image ? (
       <img
          src={`http://localhost:8080/uploads/${editProduct.image}`}
          width="100" className="mt-2" alt="product" />) : null}
        
        <input type="file"
          className="form-control mt-2"
          onChange={(e) => setImage(e.target.files[0])}/>

        <span className="fw-bold text-muted mt-4">Edit Stock</span>
        <input className="form-control mt-2"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"/>

        {/* MOBILE */}
        {category === "Mobile" && (
          <>
            <span className="fw-bold text-muted mt-4">Edit Processor</span>
            <input className="form-control mt-2" value={processor}
              onChange={(e) => setProcessor(e.target.value)}
              placeholder="Processor"/>

            <span className="fw-bold text-muted mt-4">Edit RAM</span>
            <input className="form-control mt-2" value={ram}
              onChange={(e) => setRam(e.target.value)}
              placeholder="RAM"/>

            <span className="fw-bold text-muted mt-4">Edit Storage</span>
            <input className="form-control mt-2" value={storage}
              onChange={(e) => setStorage(e.target.value)}
              placeholder="Storage"/>

             <span className="fw-bold text-muted mt-4">Edit Camera</span>
             <input className="form-control mt-2" value={camera}
              onChange={(e) => setCamera(e.target.value)}
              placeholder="camera"/>

             <span className="fw-bold text-muted mt-4">Edit Battery</span>
             <input className="form-control mt-2" value={battery}
              onChange={(e) => setBattery(e.target.value)}
              placeholder="Battery"/>
           
          </>
        )}

        {/* LAPTOP */}
        {category === "Laptop" && (
          <>
            <span className="fw-bold text-muted mt-4">Edit Graphics</span>
            <input className="form-control mt-2" value={graphics}
              onChange={(e) => setGraphics(e.target.value)}
              placeholder="Graphics"/>

            <span className="fw-bold text-muted mt-4">Edit Screen Size</span>
            <input className="form-control mt-2" value={screenSize}
              onChange={(e) => setScreenSize(e.target.value)}
              placeholder="Screen Size"/>

             <span className="fw-bold text-muted mt-4">Edit Processor</span>
             <input className="form-control mt-2" value={processor}
              onChange={(e) => setProcessor(e.target.value)}
              placeholder="Processor"/>

            <span className="fw-bold text-muted mt-4">Edit RAM</span>
            <input className="form-control mt-2" value={ram}
              onChange={(e) => setRam(e.target.value)}
              placeholder="Ram"/>

            <span className="fw-bold text-muted mt-4">Edit Storage</span>
            <input className="form-control mt-2" value={storage}
              onChange={(e) => setStorage(e.target.value)}
              placeholder="Storage"/>

            <span className="fw-bold text-muted mt-4">Edit Charger</span>
            <input className="form-control mt-2" value={charger}
              onChange={(e) => setCharger(e.target.value)}
              placeholder="Charger"/>
          </>
        )}

        {/* ACCESSORIES */}
        {category === "Accessories" && (
          <>
            <span className="fw-bold text-muted mt-4">Edit Type</span>
            <input className="form-control mt-2" value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Type"/>

            <span className="fw-bold text-muted mt-4">Edit Power</span>
            <input className="form-control mt-2" value={power}
              onChange={(e) => setPower(e.target.value)}
              placeholder="power"/>

            <span className="fw-bold text-muted mt-4">Edit Warranty</span>
            <input className="form-control mt-2" value={warranty}
              onChange={(e) => setWarranty(e.target.value)}
              placeholder="Warranty"/>
          </>
        )}

        <button className="btn btn-success mt-3" onClick={handleUpdate}>
          Update
        </button>
      </div>
    </div>
  );
}

export default EditProduct