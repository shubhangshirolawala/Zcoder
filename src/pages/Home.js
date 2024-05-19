import React from 'react'
import { v4 as uuidV4 } from 'uuid';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';



const Home = () => {
    const [roomId,setRoomId]=useState('');
    const [username,setUserName]=useState('');
    const navigate=useNavigate();

    const createNewRoom = (e) => {
        e.preventDefault();
        const id=uuidV4();
        // console.log(id);
        setRoomId(id);
        toast.success('Created a new room')
    };

    const joinRoom = () => {
        if(!roomId || !username){
            toast.error('ROOM ID && username is required');
            return;
        }

        //for redirection and second term is for data paasng to one page to another page 
        navigate(`/editor/${roomId}`, {
            state:{
                username,
            },
        });
        
    };

  return (
    <div className="homePageWrapper">
        <div>
        < img src="/ZCODERLOGO.png" alt="Logo" width="100" height="96" className="homePageLogo"/>
        <h1 className="coder">Coder</h1>
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
  )
}

export default Home
