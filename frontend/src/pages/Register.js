import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./CSS/Register.css";

function Register(){
  const [toast, setToast] = useState("");

         const navigate = useNavigate();

         const [name,setName] = useState("");
         const [phone,setPhone] = useState("");
         const [email,setEmail] = useState("");
         const [password,setPassword] = useState("");
         const [address,setAddress] = useState("");
         const [confirmPassword,setConfirmPassword] = useState("");
         const [showPassword, setShowPassword] = useState(false);
         const [showConfirmPassword, setShowConfirmPassword] = useState(false);
         const [gender,setGender] = useState("");

         const [nameError,setNameError] = useState("");
         const [emailError,setEmailError] = useState("");
         const [passwordError,setPasswordError] = useState("");
         const [allError,setAllError] = useState("");

         const register = async () => {
               setNameError("");
               setEmailError("");
               setPasswordError("");
               setAllError("");

              // RESET ERRORS
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setAllError("");

// REQUIRED FIELDS
   if (!name || !email || !phone || !password) {
      setAllError("All fields are required");
      return;
}

// NAME VALIDATION (only letters)
   const namePattern = /^[A-Za-z ]+$/;
        if (!namePattern.test(name)) {
        setNameError("Name should contain only letters");
        return;
}

// EMAIL VALIDATION
   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailPattern.test(email)) {
         setEmailError("Enter valid email");
         return;
}

// PHONE VALIDATION (10 digits)
   const phonePattern = /^[0-9]{10}$/;
         if (!phonePattern.test(phone)) {
         setAllError("Phone must be 10 digits");
         return;
}

// PASSWORD VALIDATION
    const passwordPattern =/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
          if (!passwordPattern.test(password)) {
          setPasswordError("Password must contain uppercase, lowercase, number, symbol");
          return;
}

// CONFIRM PASSWORD
          if (password !== confirmPassword) {
              setPasswordError("Passwords do not match");
              return;
}
          try{
             const res = await axios.post("http://localhost:8080/register",{
                   name:name,
                   email:email,
                   password:password,
                   phone:phone,
                   address:address,
                   gender:gender
                });

            if(res.data.status){
               showToast(res.data.message);
               navigate("/login");
               }else{
                    setAllError(res.data.message);
               }
               }catch(error){
                     console.log(error);
                     
               }};

               const showToast = (msg) => {
                     setToast(msg);
                     setTimeout(() => {
                     setToast("");
                 }, 3000); // auto hide after 3 sec
               };

      return(
           <div className="register-container">
                {toast && (
                <div className="toast-message">
                     {toast}
                </div>)}

               <div className="register-card">
                   <h3 className="register-title">Register</h3>
                   <small className="error-text text-danger">{allError}</small>

                   <input className="register-input"
                          placeholder="Name 😊"
                          onChange={(e)=>setName(e.target.value)}/>
                   <small className="text-danger">{nameError}</small>

                   <input className="register-input"
                          placeholder="Phone 📱"
                          onChange={(e)=>setPhone(e.target.value)}/>

                   <input className="register-input"
                          placeholder="Email 📩"
                          onChange={(e)=>setEmail(e.target.value)}/>
                    <small className="text-danger">{emailError}</small>

                  <div style={{ position: "relative" }}>
                  <input
                       type={showPassword ? "text" : "password"}
                       className="register-input"
                       placeholder="Password 🔑"
                       onChange={(e)=>setPassword(e.target.value)}
                  />

            {/* 👁 Toggle */}
                <span className=" mt-2 py-2" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                         position: "absolute",
                         right: "10px",
                         top: "8px",
                         cursor: "pointer"
                      }}>
                     {showPassword ? "😁" : "😑"}
               </span>
          </div>

         <small className="text-danger">{passwordError}</small>
         <div style={{ position: "relative" }}>
              <input 
                   type={showConfirmPassword ? "text" : "password"}
                   className="register-input "
                   placeholder="Confirm Password 🔑"
                   onChange={(e)=>setConfirmPassword(e.target.value)}
              />

        <span className=" mt-1 py-2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
              position: "absolute",
              right: "10px",
              top: "8px",
              cursor: "pointer"
          }}>
           {showConfirmPassword ? "😁" : "😑"}
         </span>
   </div>
      <select className="register-input"
            onChange={(e)=>setGender(e.target.value)}>

            <option value="">Select Gender 🔎</option>
            <option value="Male">Male 👦</option>
            <option value="Female">Female 👧</option>
     </select>

     <textarea className="register-input"
               placeholder="Address 🏡"
               onChange={(e)=>setAddress(e.target.value)}>
               </textarea> 

     <button className="register-btn"
             onClick={register}>
             Register
     </button>

     <p className="register-link">
              Already have account? <Link to="/login">Login</Link>
     </p>
  </div>
</div>
)}

export default Register;