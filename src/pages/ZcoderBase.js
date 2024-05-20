import React from 'react'
import Header from '../components/Routes/Header'
import Footer from '../components/LandingPage/Footer'
import LowerHeader from '../components/Routes/LowerHeader'
import { Outlet } from 'react-router-dom'
const ZcoderBase = () => {
  return (
    <div>

    
    <Header/>
      <LowerHeader/>
        <Outlet/>
    <Footer/>
    </div>
  )
}

export default ZcoderBase