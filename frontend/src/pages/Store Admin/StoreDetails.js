import axios from "axios";
import { useEffect, useState } from "react";
import "../CSS/StoreDetails.css";

function StoreDetails() {

  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");

  // GET STORES
  useEffect(() => {
    axios
      .get("http://localhost:8080/store-list")
      .then((res) => {
        setStores(res.data.data);
      });
  }, []);

  // GET PRODUCTS
  const getProducts = (storeId, storeName) => {

    setSelectedStore(storeName);

    axios
      .get(`http://localhost:8080/store-products/${storeId}`)
      .then((res) => {
        setProducts(res.data.data);
      });
  };

  return (

    <div className="store-page">

      {/* STORE SECTION */}
      <div className="stores-section">

        <h2 className="section-title">
          🏬 Stores
        </h2>

        <div className="store-scroll">

          {stores.map((store) => (

            <button
              key={store.store_id}
              className={`store-btn ${
                selectedStore === store.store_name
                  ? "active-store"
                  : ""
              }`}
              onClick={() =>
                getProducts(store.store_id, store.store_name)
              }
            >
              {store.store_name}
            </button>

          ))}

        </div>

      </div>

      {/* PRODUCT SECTION */}
      <div className="products-section">

        <h2 className="section-title">
          📦 Products
          {selectedStore && ` - ${selectedStore}`}
        </h2>

        <div className="table-wrapper">

          {products.length > 0 ? (

            <table className="product-table">

              <thead>

                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>

              </thead>

              <tbody>

                {products.map((p) => (

                  <tr key={p.id}>

                    <td>

                      <div className="image-box">

                        <img
                          src={`http://localhost:8080/uploads/${p.image}`}
                          className="product-image"
                          alt=""
                        />

                      </div>

                    </td>

                    <td className="product-name">
                      {p.name}
                    </td>

                    <td className="price">
                      ₹{p.price}
                    </td>

                    <td>

                      <span
                        className={
                          p.stock > 0
                            ? "stock in-stock"
                            : "stock out-stock"
                        }
                      >
                        {p.stock}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          ) : (

            <div className="empty-box">
              Select a store to view products 📦
            </div>

          )}

        </div>

      </div>

    </div>

  );
}

export default StoreDetails;