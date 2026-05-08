import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, updateUser, deleteUser } from "../redux/UserSlice";
import { useEffect, useState, useRef } from "react";
import "./CSS/Userupdate.css";

function UserEdit (){
const [toast, setToast] = useState("");

      const location = useLocation();
      const navigate = useNavigate();
      const editFormRef = useRef(null);
      const dispatch = useDispatch();
      const users = useSelector((state) => state.user.user);


      const [editUser, setEditUser] = useState(null);
      const [name, setName] = useState("");
      const [email, setEmail] = useState("");
      const [phone, setPhone] = useState("");
      const [address, setAddress] = useState("");
      const [role, setRole] = useState("");
      const [gender, setGender] = useState("");

      const showToast = (msg) => {
            setToast(msg);
            setTimeout(() => {
            setToast("");
  }, 3000); 
};

      useEffect(()=>{
        if(location.state?.user){
            const u =location.state.user;

            setEditUser(u);
            setName(u.name);
            setEmail(u.email);
            setGender(u.gender);
            setPhone(u.phone);
            setRole(u.role);
            setAddress(u.address);
        }
      },[location.state]);
       const handleUpdate = async () => {
    try {
      await axios.post("http://localhost:8080/update-user/" + editUser.id, {
        name,
        email,
        phone,
        address,
        role,
        gender,
      });

      showToast("User Updated Successfully 😊");

      dispatch(
        updateUser({
          id: editUser.id,
          name,
          email,
          phone,
          address,
          role,
          gender,
        })
      );
      navigate("/admin/users");
    } catch (error) {
      console.log(error);
    }
    if (!editUser) {
  return (
    <div className="game-loader">
      <div className="spinner-ring"></div>
      <p>Loading...</p>
    </div>
  );
}
//     if (!editUser) {
//   return <h4 className="text-center mt-5">Loading...</h4>;
// }
  };
   return(
        <div className="edit-card " ref={editFormRef}>
             {toast && (
             <div className="toast-message">
             {toast}
        </div>
)}
          <h4 className="edit-title">✏️ Edit User</h4>

          <div className="row g-3">
            <span className="fw-bold text-muted mt-4">Edit Name</span>
            <div className="col-md-6">
              <input
                className="form-control custom-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </div>

            <span className="fw-bold text-muted mt-4">Edit Email</span>
            <div className="col-md-6">
              <input
                className="form-control custom-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>

            <span className="fw-bold text-muted mt-4">Edit Phone</span>
            <div className="col-md-6">
              <input
                className="form-control custom-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
              />
            </div>

            <span className="fw-bold text-muted mt-4">Edit Address</span>
            <div className="col-md-6">
              <input
                className="form-control custom-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
              />
            </div>

            <span className="fw-bold text-muted mt-4">Choose Gender</span>
            <div className="col-md-6">
              <select
                className="form-control custom-input"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <span className="fw-bold text-muted mt-4">Choose Role</span>
            <div className="col-md-6">
              <select
                className="form-control custom-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button className="btn update-btn me-2" onClick={handleUpdate}>
              Update User
            </button>

            <button
              className="btn cancel-btn"
              onClick={() => navigate("/admin/users")}>
              Cancel
            </button>
          </div>
        </div>
   );
}
export default UserEdit;