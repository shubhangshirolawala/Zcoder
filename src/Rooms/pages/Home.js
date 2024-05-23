import React from 'react'
import { v4 as uuidV4 } from 'uuid';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import logo from "../../assets/images/Zcoderlogo.svg"

const Home = () => {
    const [roomId,setRoomId]=useState('');
    const [username,setUserName]=useState('');
    const navigate=useNavigate();

    const createNewRoom = (e) => {
        e.preventDefault();
        const id=uuidV4();
          console.log(id);
        setRoomId(id);
         toast.success('Created a new room')
        //  toast.success("please work")
    };

    const joinRoom = () => {
        if(!roomId || !username){
            toast.error('ROOM ID && username is required');
            return;
        }

        //for redirection and second term is for data paasng to one page to another page 
        console.log(roomId);
        navigate(`/editor/${roomId}`, {
            state:{
                username,
            },
        });
        
    };

  return (
            
    <div>
      <div>
      <Toaster 
      position="top-right"
      ></Toaster>
    </div>
    
    <div className="homePageWrapper">
        <div>
        < img src={logo} alt="Logo" width="200" height="96" className="homePageLogo"/>
        {/* <h1 className="coder">Coder</h1> */}
        </div>
        <div className="formWrapper">
            <h1 className="roomLable">Rooms</h1>
        <h4 className="mainLable">Paste invitation Room ID</h4>
        <div className="inputGroup">
            <input 
            type="text" 
            className="inputBox" 
            placeholder="ROOM ID"
            onChange={(e)=> setRoomId(e.target.value)}
            value={roomId}
            required
            />
            <input 
            type="text" 
            className="inputBox" 
            placeholder="USERNAME"
            onChange={(e)=>setUserName(e.target.value)}
            value={username}
            required
            />
            <button className="btn joinBtn" onClick={joinRoom}>
                Join
            </button>
        </div>
        <div>
        <span className="createInfo">
                If you don't have an invite then create &nbsp;
                <a 
                onClick={createNewRoom} 
                href="" 
                className="createNewBtn">
                    new room
                </a>
            </span>
            
        </div>
        </div>
    </div>
    </div>
  )
}

export default Home
