import React from 'react'
import logo from "../../assets/images/zcoderlogo.jpg"
import "./Header.css"
const Header = () => {
  return (
    <header className="header">
    <div className="div1 ">
    < img src={logo} alt="Logo" width="100" height="96" className=" px-4 "/>
    <h1 className="coder">CODER</h1>
    </div>

   <div className="navbar">
   <div><p className="contact ">Contact</p></div>
   <div> <p className="lo">Log Out</p></div>
    
   </div>
   </header>
  )
}

export default Header