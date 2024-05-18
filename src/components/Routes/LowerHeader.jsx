import React from 'react'
import "./LowerHeader.css"
import { NavLink } from 'react-router-dom'
const LowerHeader = () => {
  return (
    <div className="lower">
         <p><NavLink to ="/bookmark" style={{ textDecoration: 'none'}}>BookMarks</NavLink></p>
         <p><NavLink to ="/rooms" style={{ textDecoration: 'none'}}>Rooms</NavLink></p>
         <p><NavLink to ="/calendar" style={{ textDecoration: 'none'}}>Calendar</NavLink></p>
         <p><NavLink to ="/profile" style={{ textDecoration: 'none'}}>Profile</NavLink></p>
         
    </div>
  )
}

export default LowerHeader