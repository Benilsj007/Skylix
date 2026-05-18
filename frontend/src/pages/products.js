import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, deleteProduct } from "../redux/productSlice";
import { useEffect, useState } from "react";
import "./CSS/product.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductList() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [page, setPage] = useState(1);

  const [excelFile, setExcelFile] = useState(null);

  const handleSearch = (value) => {
    navigate(`?search=${value}`);
  };

  const editSearch = (value) => {
    navigate(`?edit=${value}`);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get("http://localhost:8080/product-filter", {
          params: {
            page,
            search: searchTerm,
            category: categoryFilter,
            sort: sortOption,
          },
        })
        .then((res) => dispatch(setProducts(res.data.data)))
        .catch((err) => console.log(err));
    }, 500);

    return () => clearTimeout(delay);
  }, [dispatch, searchTerm, categoryFilter, sortOption, page]);

  const handleDelete = async (id) => {
    try {
      await axios.post(`http://localhost:8080/delete-product/${id}`);
      dispatch(deleteProduct(id));
      toast.success("Product deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  const downloadExcel = async () => {
  try {

    const res = await axios.get(
      "http://localhost:8080/excel/export",
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([res.data])
    );

    const link = document.createElement("a");
    link.href = url;

    // download file name
    link.setAttribute("download", "products.xlsx");

    document.body.appendChild(link);
    link.click();

    link.remove();

    toast.success("Excel downloaded successfully");

  } catch (err) {
    console.log(err);
    toast.error("Excel download failed");
  }
};

  const uploadExcel = async (file) => {
    if (!file) {
      toast.error("Please select an Excel file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8080/excel/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message || "Excel uploaded successfully");

      // refresh product list after upload
      const refreshed = await axios.get(
        "http://localhost:8080/product-filter",
        {
          params: {
            page,
            search: searchTerm,
            category: categoryFilter,
            sort: sortOption,
          },
        }
      );

      dispatch(setProducts(refreshed.data.data));

      setExcelFile(null);

    } catch (err) {
      console.log(err);
      toast.error("Excel upload failed");
    }
  };

const uploadSingleImage = async (productId, file) => {
  try {
    const formData = new FormData();

    formData.append("image", file);

    const res = await axios.post(
      `http://localhost:8080/upload-product-image/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("Image uploaded successfully");

    // REFRESH PRODUCTS
    const refreshed = await axios.get(
      "http://localhost:8080/product-filter",
      {
        params: {
          page,
          search: searchTerm,
          category: categoryFilter,
          sort: sortOption,
        },
      }
    );

    dispatch(setProducts(refreshed.data.data));

  } catch (err) {
    console.log(err);
    toast.error("Image upload failed");
  }
};

  return (
    <>
      {/* TOAST CONTAINER */}
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ADD PRODUCT */}
      <button
        className="btn btn-success mb-3"
        onClick={() => navigate("/admin/products/add")}
      >
        Add Product
      </button>

      {/* FILTER SECTION */}
      <div className="filter-card">
        <h3 className="mb-4">Products List</h3>
        <h4 className="filter-title">Filter Products</h4>

        <div className="row g-3">
          <div className="col-lg-4 col-md-6">
            <label>🔎 Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                handleSearch(value);
              }}
            />
          </div>

          <div className="col-lg-4 col-md-6">
            <label>📍 Category</label>
            <input
              type="text"
              className="form-control"
              placeholder="Category"
              value={categoryFilter}
              onChange={(e) => {
                const value = e.target.value;
                setCategoryFilter(value);
                handleSearch(value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="d-flex gap-3 mt-3 mb-3 align-items-center">
        <>
  <input
    type="file"
    accept=".xlsx,.xls"
    id="excelUpload"
    className="d-none"
    onChange={(e) => setExcelFile(e.target.files[0])}
  />

  <label htmlFor="excelUpload" className="fs-3" title="Click To Upload Files"
  style={{ cursor: "pointer" }}>
    🗂️
  </label>
</>
        <button
          className="btn btn-success"
          onClick={() => uploadExcel(excelFile)}
        >
          Import Excel 📤
        </button>

        <button
          className="btn btn-primary"
          onClick={downloadExcel}
        >
          Export Excel 📥
        </button>

      </div>

      <div className="card-body table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Store</th>

              <th
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setSortOption(
                    sortOption === "name-asc" ? "name-desc" : "name-asc"
                  )}>
                Name {sortOption === "name-asc" ? "▲" : "▼"}
              </th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products?.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td>{p.store_name}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.brand}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
               <td>
                <div className="d-flex flex-column align-items-center ">
                   {p.image && (
    <img
      src={`http://localhost:8080/uploads/${p.image}`}
      width="60"
      alt={p.name}
      className="d-block mb-2"
    />
  )}
   <label
   title="Click to upload image"
   className="upload-btn"
    htmlFor={`upload-${p.id}`}>
    ⬆
  </label>
    </div>
  <input
    type="file"
    accept="image/*"
    id={`upload-${p.id}`}
    style={{ display: "none" }}
    onChange={(e) => {
      const file = e.target.files[0];

      if (file) {
        uploadSingleImage(p.id, file);
      }
    }}/> 
</td>
              <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() =>
                      navigate("/admin/products/edit", {
                        state: {
                          product: {
                            id: p.id,
                            category: p.category,
                          },},
                      })}>
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      const confirmDelete = window.confirm(
                        "Are you sure you want to delete?"  );
                      if (confirmDelete) {
                        handleDelete(p.id);}
                    }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination-container">
          <button
            className="btn btn-secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ⬅ Prev
          </button>

          <span className="page-info">Page {page}</span>

          <button
            className="btn btn-secondary"
            onClick={() => setPage(page + 1)} >
            Next ➡
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductList;