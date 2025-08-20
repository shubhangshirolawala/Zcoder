import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import {useState , useRef} from 'react';
import Client from '../components/client'
import Editor from '../components/editor'
import { initSocket } from '../socket';
import { useLocation , useNavigate , Navigate , useParams} from 'react-router-dom';
import ACTIONS from '../Actions';
import logo from "../../assets/images/Zcoderlogo.svg"

const EditorPage = () => {
  // const init="hello"
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const init = async () => {
            try {
                socketRef.current = await initSocket();
                socketRef.current.on('connect_error', handleErrors);
                socketRef.current.on('connect_failed', handleErrors);

                socketRef.current.emit(ACTIONS.JOIN, {
                    roomId,
                    username: location.state?.username,
                });

                // Listening for joined event
                socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                });

                // Listening for disconnected
                socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients(prev => prev.filter(client => client.socketId !== socketId));
                });
            } catch (error) {
                handleErrors(error);
            }
        };

        const handleErrors = (error) => {
            console.error('socket error', error);
            toast.error('Socket connection failed, try again later.');
            reactNavigator('/rooms');
        };

        init();

        return () => {
            if (socketRef.current) {
                console.log("socketref is not null");
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
            }
        };
    }, [location.state?.username, reactNavigator, roomId]);

    const copyRoomId = async () => {
        
        try {
            toast.success('Room ID has been copied to your clipboard');
            await navigator.clipboard.writeText(roomId);
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
        console.log("copied")
    };

    const leaveRoom = () => {
        reactNavigator('/home/bookmark');
    };
     

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img src={logo} alt="Logo" width="100" height="96" className="logoImage" />
                        {/* <h1 className="coder">Coder</h1> */}
                    </div>
                    <h3 className="roomMembers">Room Members</h3>
                    <div className="clientList">
                        {clients.map(client => (
                            <Client key={client.socketId} username={client.username} />
                        ))}
                    </div>
                </div>
                <button className="btn copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
                <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>
                  {/* <button className="btn compileBtn" onClick={compileCode}>Compile</button> */}
            </div>
            <div className="editorWrap">
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={code => {
                        codeRef.current = code;
                    }}
                />
            </div>
        </div>
    );
};

export default EditorPage;