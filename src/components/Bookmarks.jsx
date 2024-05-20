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

  const config={
    headers:{
      Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjQ5MTIxMzk1MDQ4NTI3MjhjNDVhZTAiLCJpYXQiOjE3MTYwNjQ3ODgsImV4cCI6MTcxODY1Njc4OH0.IbwRoritZW1QjxzM5JztNeZK_V3VxpkToq5NXsP8VFU'
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
         <button className="btn1" onClick={handleButtonClick}>Add A Bookmark</button>
       
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