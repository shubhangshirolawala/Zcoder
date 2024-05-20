import React from 'react'
import {useState} from 'react';
// import Client from '../components..//client'
// import Editor from '../components/editor'
import Client from '../components/Rooms/client';
import Editor from '../components/Rooms/editor';
import logo from "../assets/images/zcoderlogo.jpg"
import { Toaster } from 'react-hot-toast';
const EditorPage = () => {
  const [clients,setClients]=useState([
    {socketId:1, username : 'kushal patel'},
    {socketId:2, username : 'manav patel'},
  {socketId:3, username : 'yashvi patel'}]
  );

  return (
   
        
    
    <div className="mainWrap">
        
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
              < img src={logo} alt="Logo" width="100" height="96" className="logoImage"/>
              <h1 className="coder">CODER</h1>
            </div>
              <h3 className='roomMembers'>Room Members</h3>
              <div className="clientList">
                {clients.map((client)=>(
                  <Client
                  key={client.socketId}
                  username={client.username}
                  />
                ))}
            </div>
          </div>
            <button className="btn copyBtn">Copy ROOM ID</button>
            <button className="btn leaveBtn">Leave</button>
        </div>
        <div className="editorWrap">
          <Editor/>
        </div>
      </div>
      
    
  )
}

export default EditorPage