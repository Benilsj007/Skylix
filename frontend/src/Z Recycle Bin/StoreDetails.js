import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "../CSS/StoreDetails.css";

function StoreMembers() {

  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);

  const [storeSearch, setStoreSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const [selectedStore, setSelectedStore] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const storeTimeout = useRef(null);
  const productTimeout = useRef(null);

  // ================= STORE LIST =================
  useEffect(() => {
    fetchStores("");
  }, []);

  const fetchStores = (search) => {
    axios
      .get("http://localhost:8080/store-list", {
        params: { search }
      })
      .then((res) => setStores(res.data.data))
      .catch((err) => console.log(err));
  };

  const handleStoreSearch = (e) => {
    const value = e.target.value;
    setStoreSearch(value);

    if (storeTimeout.current) clearTimeout(storeTimeout.current);

    storeTimeout.current = setTimeout(() => {
      fetchStores(value);
    }, 500);
  };

  // ================= PRODUCTS =================
  const fetchProducts = (storeId, pageNum = 1, search = "") => {
    axios
      .get(`http://localhost:8080/store-products/${storeId}`, {
        params: {
          page: pageNum,
          search: search
        }
      })
      .then((res) => {
        setProducts(res.data.data);
        setTotalPages(res.data.totalPages);
        setPage(pageNum);
      })
      .catch((err) => console.log(err));
  };

  // ================= SELECT STORE =================
  const selectStore = (id, name) => {
    setSelectedStoreId(id);
    setSelectedStore(name);

    setProductSearch("");
    setProducts([]);
    setPage(1);

    fetchProducts(id, 1, "");
  };

  // ================= PRODUCT SEARCH =================
  const handleProductSearch = (e) => {
    const value = e.target.value;
    setProductSearch(value);

    if (!selectedStoreId) return;

    if (productTimeout.current) clearTimeout(productTimeout.current);

    productTimeout.current = setTimeout(() => {
      fetchProducts(selectedStoreId, 1, value);
    }, 500);
  };

  // ================= DELETE PRODUCT =================
  const deleteProduct = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    axios
      .post(`http://localhost:8080/delete-store-product/${id}`)
      .then(() => {
        fetchProducts(selectedStoreId, page, productSearch);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="store-page">

      {/* STORE SECTION */}
      <div className="store-top">
        <h2>🏬 Stores</h2>

        <input
          placeholder="Search stores..."
          value={storeSearch}
          onChange={handleStoreSearch}
          className="search"
        />
          <p className="text-muted">Click a store to view product 👇</p>

        <div className="store-scroll">
        
          {stores.map((s) => (
            <button
              key={s.store_id}
              className={`store-pill ${
                selectedStore === s.store_name ? "active" : ""
              }`}
              onClick={() => selectStore(s.store_id, s.store_name)}
            >
              {s.store_name}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT HEADER */}
      <div className="product-header">
        <h2>📦 Products</h2>

        <input
          placeholder="Search products..."
          value={productSearch}
          onChange={handleProductSearch}
          disabled={!selectedStoreId}
        />
      </div>

      {/* PRODUCT GRID */}
      <div className="product-grid">
        {products.map((p) => (
          <div className="card" key={p.id}>
            <img
              src={`http://localhost:8080/uploads/${p.image}`}
              alt={p.name}
            />

            <h3>{p.name}</h3>
            <p>₹{p.price}</p>

            <button
              className="delete"
              onClick={() => deleteProduct(p.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {selectedStoreId && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() =>
              fetchProducts(selectedStoreId, page - 1, productSearch)
            }
          >
            Prev
          </button>

          <span>{page} / {totalPages}</span>

          <button
            disabled={page === totalPages}
            onClick={() =>
              fetchProducts(selectedStoreId, page + 1, productSearch)
            }
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}

export default StoreMembers;