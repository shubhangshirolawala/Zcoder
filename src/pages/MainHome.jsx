import React from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Header from '../components/Routes/Header'
import Footer from '../components/LandingPage/Footer'
const MainHome = () => {
  return (
    <BrowserRouter>

    <Header/>
    <Routes>

    </Routes>
    <Footer/>
  </BrowserRouter>
  )
}

export default MainHome