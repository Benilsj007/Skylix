import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser, deleteUser } from "../redux/UserSlice";
import { useEffect, useState } from "react";
import "./CSS/Userupdate.css";
import { useNavigate } from "react-router-dom";

// ✅ TOAST IMPORTS
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Userupdate() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector((state) => state.user.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [placeFilter, setPlaceFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [page, setPage] = useState(1);

  // =========================
  // NEW: Excel upload state
  // =========================
  const [excelFile, setExcelFile] = useState(null);

  /* Fetch Users from backend with search/filter/sort */
  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get("http://localhost:8080/user-filter", {
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
    }, 500);

    return () => clearTimeout(delay);
  }, [dispatch, searchTerm, placeFilter, sortOption, page]);

  // =========================
  // DELETE USER
  // =========================
  const handleDelete = async (id) => {

    if (window.confirm("Are you sure you want to delete this user?")) {

      try {

        await axios.post("http://localhost:8080/delete-user/" + id);

        dispatch(deleteUser(id));

        // ✅ SUCCESS TOAST
        toast.success("User deleted successfully");

      } catch (error) {

        console.log(error);

        // ❌ ERROR TOAST
        toast.error("Delete failed");
      }
    }
  };

  // =========================
  // IMPORT EXCEL USERS
  // =========================
  const handleImportExcel = async () => {

    if (!excelFile) {

      // ❌ TOAST
      toast.error("Please select an Excel file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", excelFile);

    try {

      await axios.post(
        "http://localhost:8080/excel/import-users",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ SUCCESS TOAST
      toast.success("Users imported successfully");

      setExcelFile(null);

      // refresh users
      axios
        .get("http://localhost:8080/user-filter", {
          params: {
            page,
            search: searchTerm,
            place: placeFilter,
            sort: sortOption,
          },
        })
        .then((res) => {
          dispatch(setUser(res.data.data));
        });

    } catch (err) {

      console.log(err);

      // ❌ ERROR TOAST
      toast.error("Import failed");
    }
  };

  // =========================
  // EXPORT EXCEL USERS
  // =========================
  const handleExportExcel = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8080/excel/export-users",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", "users.xlsx");

      document.body.appendChild(link);

      link.click();

      link.remove();

      // ✅ SUCCESS TOAST
      toast.success("Excel downloaded successfully");

    } catch (err) {

      console.log(err);

      // ❌ ERROR TOAST
      toast.error("Export failed");
    }
  };

  return (

    <div className="container py-4">

      <ToastContainer
        position="top-right"
        autoClose={2000}/>

      <div className="user-header-card">
        <h2 className="user-title">👥 User Management</h2>
        <p className="user-subtitle">
          Search, filter, sort and manage users easily
        </p>
      </div>
      <div className="filter-card">
        <h4 className="filter-title"> Filter Users</h4>
        <div className="row g-3">
          <div className="col-lg-4 col-md-6">

            <label className="input-label ">🔎 Search</label>

            <input
              type="text"
              className="form-control custom-input"
              placeholder="Search by name, email, phone, address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}/>

          </div>

          <div className="col-lg-4 col-md-6 ">

            <label className="input-label">📍 Place Filter</label>

            <input
              type="text"
              className="form-control custom-input"
              placeholder="Enter place"
              value={placeFilter}
              onChange={(e) => setPlaceFilter(e.target.value)}/>
          </div>
        </div>
      </div>

      {/* IMPORT / EXPORT */}
      <div className="d-flex gap-3 mt-3 mb-3">

        <input
    type="file"
    accept=".xlsx,.xls"
    id="excelUpload"
    className="d-none"
    onChange={(e) => setExcelFile(e.target.files[0])}
  />

  <label htmlFor="excelUpload" className="fs-3" title="Click to Upload File"
  style={{ cursor: "pointer" }}>
    🗂️
  </label>


        <button
          className="btn btn-success"
          onClick={handleImportExcel}
        >
          Import Excel ⬆️
        </button>

        <button
          className="btn btn-primary"
          onClick={handleExportExcel}
        >
          Export Excel ⬇️
        </button>

      </div>

      <div className="table-card">

        <div className="table-title">
          📋 User List
        </div>

        <div className="table-responsive">

          <table className="table custom-table align-middle table-striped">

            <thead>

              <tr>

                <th className="text-white bg-dark">S.NO</th>

                <th className="text-white bg-dark">

                  <span
                    style={{
                      cursor: "pointer",
                      marginRight: "6px"
                    }}
                    onClick={() =>
                      setSortOption(
                        sortOption === "name-asc"
                          ? "name-desc"
                          : "name-asc"
                      )
                    }
                  >
                    {sortOption === "name-asc" ? "▲" : "▼"}
                  </span>

                  Name

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

                    <span
                      className={`role-badge ${
                        u.role === "admin"
                          ? "admin-role"
                          : "user-role"
                      }`}
                    >
                      {u.role || "user"}
                    </span>

                  </td>

                  <td>{u.gender}</td>

                  <td>

                    <div className="action-btn d-flex gap-4 ">

                      <button
                        className="btn edit-btn"
                        onClick={() =>
                          navigate("/admin/users/edit", {
                            state: { user: u },
                          })
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn delete-btn "
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* PAGINATION */}
          <div className="pagination-container ">

            <button
              className="btn btn-secondary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              ⬅ Prev
            </button>

            <span className="page-info">
              Page {page}
            </span>

            <button
              className="btn btn-secondary"
              onClick={() => setPage(page + 1)}
            >
              Next ➡
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Userupdate;