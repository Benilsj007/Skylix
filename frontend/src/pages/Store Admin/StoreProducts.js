import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StoreProducts() {

    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {

        if(!user){

            navigate("/login");
            return;
        }

        getProducts();

    }, []);

    const getProducts = async () => {

        try {

            const res = await axios.get(
                `http://localhost:8080/store-products/${user.user_id}`
            );

            setProducts(res.data.data);

        } catch (error) {

            console.log(error);
        }
    };

    
const deleteProduct = async (id) => {
    try {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        const res = await axios.post(
            `http://localhost:8080/delete-product/${id}`,
            {
                store_id: user.user_id
            }
        );

        alert(res.data.message);

        // refresh list
        getProducts();

    } catch (error) {
        console.log("Delete Error:", error);
    }
};
    return (

        <div className="container-fluid mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>My Products</h2>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/store/add-product")}
                >
                    Add Product
                </button>

            </div>

            <div className="table-responsive">

                <table className="table table-bordered table-hover align-middle">

                    <thead className="table-dark">

                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {
                            products.length > 0 ? (

                                products.map((p) => (

                                    <tr key={p.id}>

                                        <td>{p.id}</td>

                                        <td>

                                            <img
                                                src={`http://localhost:8080/uploads/${p.image}`}
                                                alt=""
                                                width="70"
                                                height="70"
                                                style={{
                                                    objectFit:"cover"
                                                }}
                                            />

                                        </td>

                                        <td>{p.name}</td>

                                        <td>{p.category}</td>

                                        <td>₹ {p.price}</td>

                                        <td>{p.stock}</td>

                                        <td>

                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() =>
                                                   navigate("/store/edit-product", {
                                        state: {
                                        product: {
                                        id: p.id,   // FORCE correct id
                                        category: p.category
                                          }}})}
                                                
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteProduct(p.id)}
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>
                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center"
                                    >
                                        No Products Found
                                    </td>

                                </tr>
                            )
                        }

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default StoreProducts;