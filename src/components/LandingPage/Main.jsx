import React from 'react'
import mainpic from "../../assets/images/mainpic.png"
import "./Main.css"

const Main = () => {
  return (
    <div className='main'>
          <div className='text'>
          <h2 className='big '>BookMark Your Coding Problems On A Click</h2>
          
        <p className='a'>Something Something</p>
        <p className='a'>Something Something</p>
        <p className='a'>Something Something</p>
          
          </div>
        < img src={mainpic} alt="mainpic" width="630" height="508" className=" mainpic "/>
    </div>
  )
}

export default Main