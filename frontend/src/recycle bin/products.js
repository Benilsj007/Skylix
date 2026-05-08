// import { useNavigate, useLocation } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
// import { setProducts, updateProduct, deleteProduct } from "../redux/productSlice";
import { setProducts, deleteProduct } from "../redux/productSlice";
import { useEffect, useState } from "react";
import "./CSS/product.css";

function ProductList() {

  // const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);

  // const [editProduct, setEditProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [page, setPage] = useState(1);
  
  const handleSearch =(value)=>{
    navigate(`?search=${value}`)
  }

  const editSearch =(value)=>{
    navigate(`?edit=${value}`)
  }

  // FETCH
  useEffect(() => {
     const delay = setTimeout(() => {
         axios.get("http://localhost:8080/product-filter", {
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

  // DELETE
  const handleDelete = async (id) => {
        await axios.post(`http://localhost:8080/delete-product/${id}`);
        dispatch(deleteProduct(id));
  };

  return (
    <>
            <button className="btn btn-success mb-3"
                    onClick={() => navigate("/admin/products/add")}>
                    Add Product
            </button>                  
           <div className="filter-card">
                <h3 className="mb-4" >Products List</h3>
                <h4 className="filter-title"> Filter Products</h4>

        <div className="row g-3">
          <div className="col-lg-4 col-md-6">
            <label className="input-label">🔎 Search</label>
            <input
              type="text"
              className="form-control custom-input"
              placeholder="Search by name, category"
              value={searchTerm}
             onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);   // update state
                handleSearch(value);    // update URL
               }}
            />
          </div>

          <div className="col-lg-4 col-md-6">
            <label className="input-label">📍 Category Filter</label>
            <input
              type="text"
              className="form-control custom-input"
              placeholder="Enter Category"
              value={categoryFilter}
               onChange={(e) => {
                const value = e.target.value;
                setCategoryFilter(value);   // update state
                handleSearch(value);    // update URL
               }}/>
                </div>
              </div>
            </div>
                  <div className="card-body table-responsive">
                    <table className="table table-striped align-middle">
                      <thead>
                        <tr>
                          <th className="text-white bg-dark">ID</th>
                          <th className="text-white bg-dark text-start">
                              <span style={{ cursor: "pointer", marginRight: "6px" }}
                                    onClick={() =>setSortOption
                                      (sortOption === "name-asc" ? "name-desc" : "name-asc")} >
                                     {sortOption === "name-asc" ? "▲" : "▼"}
                             </span>Name
                          </th>
                          <th className="text-white bg-dark">Category</th>
                          <th className="text-white bg-dark">Brand</th>
                          <th className="text-white bg-dark">Price</th>
                          <th className="text-white bg-dark">Stock</th>
                          <th className="text-white bg-dark">Image</th>
                          <th className="text-white bg-dark">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {products.map((p, i) => (
                          <tr key={p.id}>
                            <td>{i + 1}</td>
                            <td>{p.name}</td>
                            <td>{p.category}</td>
                            <td>{p.brand}</td>
                            <td>{p.price}</td>
                            <td>{p.stock}</td>
                            <td>
                              {p.image && (
                                <img
                                  src={`http://localhost:8080/uploads/${p.image}`}
                                  width="60"
                                  className="product-image"
                                  alt={p.name}
                                />
                              )}
                            </td>
                            <td>
                              <button
                                className="edit btn btn-warning btn-sm"
                    
                                onClick={() =>
                                        navigate("/admin/products/edit", {
                                        state: {
                                        product: {
                                        id: p.id,   // FORCE correct id
                                        category: p.category
                                          }}})} >
                                Edit
                              </button>
                              <button
                                className="delete btn btn-danger btn-sm"
                                onClick={() =>{
                                      const confirmDelete = window.confirm("Are you sure you want to delete this product?");
                                         if (confirmDelete) {
                                             handleDelete(p.id);
                                         } 
                                }}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

          <div className="pagination-container ">
             <button 
                  className="btn btn-secondary"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}>
                  ⬅ Prev
             </button> 

             <span className="page-info">Page {page}</span>

             <button 
                 className="btn btn-secondary"
                 onClick={() => setPage(page + 1)}>
                 Next ➡
             </button>
         </div>
    </div>              
 </>
  );
}

export default ProductList;


