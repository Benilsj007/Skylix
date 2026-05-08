import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser,  deleteUser } from "../redux/UserSlice";
import { useEffect, useState} from "react";
import "./CSS/Userupdate.css";
import {  useNavigate } from "react-router-dom";


function Userupdate() {
  const dispatch = useDispatch();
        const navigate = useNavigate();

  const users = useSelector((state) => state.user.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [placeFilter, setPlaceFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [page, setPage] = useState(1);

  /* Fetch Users from backend with search/filter/sort */
  useEffect(() => {
    const delay = setTimeout(() => {
    axios.get("http://localhost:8080/user-filter", {
        params: {
        page,
        search: searchTerm,
        place: placeFilter,
        sort: sortOption,
      },
    })
    .then((res) => {
      dispatch(setUser(res.data.data));
    })
    .catch((err) => console.log(err));
  }, 500); // ⏱ 500ms delay

  return () => clearTimeout(delay);
  }, [dispatch, searchTerm, placeFilter, sortOption, page]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.post("http://localhost:8080/delete-user/" + id);
        dispatch(deleteUser(id));
      } catch (error) {
        console.log(error);
      }
    }
  };

 return (
    <div className="container py-4">
      <div className="user-header-card">
        <h2 className="user-title">👥 User Management</h2>
        <p className="user-subtitle">Search, filter, sort and manage users easily</p>
      </div>

      <div className="filter-card">
        <h4 className="filter-title"> Filter Users</h4>

        <div className="row g-3">
          <div className="col-lg-4 col-md-6">
            <label className="input-label">🔎 Search</label>
            <input
              type="text"
              className="form-control custom-input"
              placeholder="Search by name, email, phone, address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="col-lg-4 col-md-6">
            <label className="input-label">📍 Place Filter</label>
            <input
              type="text"
              className="form-control custom-input"
              placeholder="Enter place"
              value={placeFilter}
              onChange={(e) => setPlaceFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-title">📋 User List</div>

        <div className="table-responsive">
          <table className="table custom-table align-middle table-striped">
            <thead>
              <tr>
                <th className="text-white bg-dark">S.NO</th>
                <th className="text-white bg-dark">
                              <span style={{ cursor: "pointer", marginRight: "6px" }}
                                    onClick={() =>setSortOption
                                    (sortOption === "name-asc" ? "name-desc" : "name-asc")} >
                                    {sortOption === "name-asc" ? "▲" : "▼"}
                              </span>Name
                </th>
                <th className="text-white bg-dark">Email</th>
                <th className="text-white bg-dark">Phone</th>
                <th className="text-white bg-dark">Password</th>
                <th className="text-white bg-dark">Address</th>
                <th className="text-white bg-dark">Role</th>
                <th className="text-white bg-dark">Gender</th>
                <th className="text-white bg-dark">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, i) => (
                <tr key={u.id}>
                  <td>{i + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{u.password}</td>
                  <td>{u.address}</td>
                  <td>
                    <span className={`role-badge ${u.role === "admin" ? "admin-role" : "user-role"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.gender}</td>

                  <td>
                    <div className="action-btn d-flex gap-4 ">
                       <button
                      className="btn edit-btn"
                      onClick={() => navigate("/admin/users/edit", { state: { user: u } })}>
                      Edit
                    </button>

                    <button
                      className="btn delete-btn "
                      onClick={() => handleDelete(u.id)}>
                      Delete
                    </button>
                    </div>
                   
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
           onClick={() => setPage(page + 1)} >
           Next ➡
     </button>
   </div>
        </div>
      </div>
    </div>
);}

export default Userupdate;