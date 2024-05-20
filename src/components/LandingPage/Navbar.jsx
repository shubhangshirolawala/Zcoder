import React from "react";
import "./Navbar.css";
import logo from "../../assets/images/zcoderlogo.jpg";

import { useNavigate } from "react-router-dom";
const Navbar=()=>{
   const navigate=useNavigate();
   const get = ()=>{
      navigate('/signup');
  }
  const log =()=>{
   navigate("/signin")
  }
return(
   <header className="header">
    <div className="div1 ">
    < img src={logo} alt="Logo" width="100" height="96" className=" px-4 "/>
    <h1 className="coder">CODER</h1>
    </div>

   <nav className="navbar">
   <button className="btnget" onClick={get}>Get Started</button>
   <button className="btnlog" onClick={log}>Log In</button>
    
   </nav>
   </header>
);
}
export default Navbar;

//<img src={logo} alt="Logo" width="100" height="96" className="d-inline-block align-text-top "/>