import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./CSS/Login.css";

function Login(){
const [toast, setToast] = useState("");
const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [emailError,setEmailError] = useState("");
const [passwordError,setPasswordError] = useState("");
const [allError,setAllError] = useState("");

const showToast = (msg) => {
  setToast(msg);

  setTimeout(() => {
    setToast("");
  }, 3000); // auto hide after 3 sec
};

const login = async () => {

              setEmailError("");
              setPasswordError(""); 
              setAllError("");

              if(email === "" || password === ""){
                       setAllError("Please fill all fields");
                       return;
              }

             const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

             if(!emailPattern.test(email)){
                     setEmailError("Enter valid email");
                     return;
             }

             if(password.length < 6){
                      setPasswordError("Password must be at least 6 characters");
                      return;
             }
  
  try{

       const res = await axios.post("http://localhost:8080/login",{
       email: email,
       password: password
});

       if(res.data.status){

                  localStorage.setItem(
   "user",
   JSON.stringify(res.data)
);

// check user role
       if(res.data.role === "admin"){
              navigate("/admin");
              }
              else if(res.data.role === "Store Owner"){
                     navigate("/store");
              }else{
                   navigate("/home");
          }
          }else{
               showToast(res.data.message);
          }
          }catch(error){
                console.log(error);
          }}

return(

       <div className="auth-container">
      
             {toast && (
                 <div className="toast-message">
                      {toast}
                 </div>
             )}
           <div className="auth-card">
                <h3 className="auth-title">Login</h3>
                <small className="text-danger">{allError}</small>

                <input className="auth-input"
                       name="email"
                       placeholder="Email 📩"
                       onChange={(e)=>setEmail(e.target.value)}/>
                <small className="text-danger">{emailError}</small>

                <input type="password"
                       className="auth-input"
                       name="password"
                       placeholder="Password 🔑"
                       onChange={(e)=>setPassword(e.target.value)}/>
                <small className="text-danger">{passwordError}</small>

                <button className="auth-btn"
                        onClick={login}>
                        Login </button>                

                <p className="auth-text">
                   Don't have an account? 
                   <Link to="/">Register</Link>
                </p>
      </div>
</div>

)
}

export default Login;