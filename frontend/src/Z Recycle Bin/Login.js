import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./CSS/Login.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login(){
const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [emailError,setEmailError] = useState("");
const [passwordError,setPasswordError] = useState("");
const [allError,setAllError] = useState("");

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

     if (res.data.status) {
  localStorage.setItem("token", res.data.token);

  localStorage.setItem("user", JSON.stringify({
    user_id: res.data.user_id,
    role: res.data.role,
    name: res.data.name
  }));

  if (res.data.role === "admin") navigate("/admin");
  else if (res.data.role === "storeowner") navigate("/store");
  else navigate("/home");
}else{
               toast.error(res.data.message);
          }
          }catch(error){
                console.log(error);
          }}

return(

       <div className="auth-container">
      
            <ToastContainer
        position="top-right"
        autoClose={2000}/>
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