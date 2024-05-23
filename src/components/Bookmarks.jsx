import React, { useEffect, useState } from 'react'
import axios from "axios"
import "./Routes/Bookmarks.css"
import { useNavigate } from "react-router-dom";
const Bookmarks = () => {
  // console.log("bkm is Rendered");
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/home/bookmarkform");
  };
  const [users,setUsers]=useState([]);

  const token=localStorage.getItem('token')
  console.log(token);
  const config={
    headers:{
      Authorization:`Bearer ${token}`
    }
  }
  const fetchBookmark = async()=>{
    let res =await axios.post("http://localhost:4000/api/v1/questions/getAllBookmarks",{},config);
    console.log(res)
    
      setUsers(res.data.bookmarks)
    
    console.log(users)
  }
  useEffect(()=>{
    fetchBookmark()
  },[])
  return (
    
    <div className="main">
    <div className='book '>
         <button className="btn1 " onClick={handleButtonClick}>Add A Bookmark</button>
       
            <div className=" class ">
              <div className='subclass'>
            <table className='table'>
              <thead>
                <tr>
                  <th>
                    Name
                  </th>
                  <th>
                    Url
                  </th>
                  <th>
                    Solution
                  </th>
                </tr>
              </thead>
              <tbody>
              {
          users.map((data,index)=>(

              <tr>
                
                <td key={index}>{data.title}</td>
                <td key={index}>{data.url}</td>
                <td key={index}>{data.solution}</td>
              </tr>


          ))
        }
              </tbody>
            </table>
            </div>
            </div>
            
       
    </div>
    </div>
  )
}

export default Bookmarks

//<h1 key={index}>{data.title}</h1>