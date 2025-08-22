import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Client from '../components/client';
import Editor from '../components/editor';
import VideoTiles from '../components/VideoTiles';
import { initRoomSocket } from '../socket';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import ACTIONS from '../Actions';
import logo from "../../assets/images/Zcoderlogo.svg";

const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const editorRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const mountedRef = useRef(true);

  const [clients, setClients] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [connecting, setConnecting] = useState(true);

  // --- Helpers: persistence keys ---
  const codeKey = `room:${roomId}:code`;
  const camKey = `room:${roomId}:cameraOn`;
  const userIdKey = 'persistentUserId';

  // --- Helper: generate & cache a persistent userId ---
  const getOrCreateUserId = () => {
    let uid = localStorage.getItem(userIdKey);
    if (!uid) {
      // Simple UUID-ish generator; fine for session identity
      uid = 'u-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(userIdKey, uid);
    }
    return uid;
  };

  const persistentUserId = getOrCreateUserId();

  // --- Restore persisted UI state on mount ---
  useEffect(() => {
    try {
      const savedCam = localStorage.getItem(camKey);
      if (savedCam !== null) {
        setCameraOn(savedCam === 'true');
      }
    } catch {}

    try {
      const savedCode = localStorage.getItem(codeKey);
      if (savedCode != null) {
        codeRef.current = savedCode;
        // If editor is already ready later, we’ll also set it again in JOIN flow
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]); // runs when room changes

  // --- Persist camera toggle whenever it changes ---
  useEffect(() => {
    try {
      localStorage.setItem(camKey, String(cameraOn));
    } catch {}
  }, [cameraOn]);

  // --- Save username for convenience (optional, non-breaking) ---
  useEffect(() => {
    if (location.state?.username) {
      try {
        localStorage.setItem('lastUsername', location.state.username);
      } catch {}
    }
  }, [location.state?.username]);

const cleanupSocket = () => {
  if (socketRef.current) {
    try {
      socketRef.current.removeAllListeners();

      if (socketRef.current.connected) {
        socketRef.current.emit('leave-room', {
          roomId,
          userId: persistentUserId,
        });
      }

      socketRef.current.disconnect();
    } catch (error) {
      console.warn('[EditorPage] Error during socket cleanup:', error);
    }

    socketRef.current = null;
  }
};


  // --- Before unload: best-effort "leave" to reduce ghost users on refresh ---
  useEffect(() => {
   const handleBeforeUnload = () => {
  try {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave-room', {
        roomId,
        userId: persistentUserId,
      });
    }
  } catch {}
};

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [roomId, persistentUserId]);

  useEffect(() => {
    const handleErrors = (error) => {
      console.error('[EditorPage] socket error', error);
      if (!mountedRef.current) return;

      toast.error('Socket connection failed, try again later.');
      reactNavigator('/rooms');
    };

    const init = async () => {
      try {
        setConnecting(true);
        socketRef.current = await initRoomSocket();

        if (!mountedRef.current) {
          cleanupSocket();
          return;
        }

        console.log('[EditorPage] socketRef after init', socketRef.current.id);

        // Identify this browser session to the server (additive; doesn’t break existing servers)
        try {
          socketRef.current.emit('identify', {
            userId: persistentUserId,
            username: location.state?.username,
            roomId,
          });
        } catch (e) {
          console.warn('[EditorPage] identify emit failed (non-fatal):', e);
        }

        const onConnect = () => {
          if (!mountedRef.current || !socketRef.current) return;

          console.log('[EditorPage] socket connected, emitting JOIN', socketRef.current.id);
          socketRef.current.emit(ACTIONS.JOIN, {
            roomId,
            username: location.state?.username,
            userId: persistentUserId, // extra context
          });
          setSocketConnected(true);
          setConnecting(false);

          // If we already have saved code locally, ensure editor shows it ASAP
          if (codeRef.current != null && editorRef.current?.setValue) {
            try {
              editorRef.current.setValue(codeRef.current);
            } catch {}
          }
        };

        const onDisconnect = (reason) => {
          console.log('[EditorPage] socket disconnected:', reason);
          if (mountedRef.current) {
            setSocketConnected(false);
            setConnecting(false);

            // Only show error if it wasn't a manual disconnect
            if (reason !== 'io client disconnect') {
              toast.error('Connection lost. Please refresh to reconnect.');
            }
          }
        };

        const handleJoined = ({ clients: newClients = [], username, socketId }) => {
          if (!mountedRef.current) return;

          console.log('[EditorPage] JOINED event:', { newClients, username, socketId });

          // Filter out any duplicates and invalid entries
          const validClients = newClients.filter(
            (client) => client && client.socketId && client.username
          );

          // Remove duplicates based on socketId
          const uniqueClients = validClients.filter(
            (client, index, array) =>
              array.findIndex((c) => c.socketId === client.socketId) === index
          );

          setClients(uniqueClients);

          if (username && username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
          }

          // If we have a saved local code, set it into editor (if not already) and
          // let the just-joined peer sync from us when they request.
          if (codeRef.current != null && editorRef.current?.setValue) {
            try {
              editorRef.current.setValue(codeRef.current);
            } catch {}
          }
        };

        const handleDisconnected = ({ socketId, username }) => {
          if (!mountedRef.current) return;

          console.log('[EditorPage] DISCONNECTED event:', { socketId, username });

          if (username) {
            toast.success(`${username} left the room.`);
          }

          setClients((prev) => prev.filter((client) => client.socketId !== socketId));
        };

        const handleSyncCode = ({ socketId }) => {
          if (socketRef.current) {
            // Prefer persisted code if present, fall back to current ref
            const persisted = localStorage.getItem(codeKey);
            const codeToSend =
              persisted != null ? persisted : (codeRef.current ?? '');

            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              socketId,
              code: codeToSend,
            });
          }
        };

        const handleCodeChange = ({ code }) => {
          if (code !== null && code !== undefined) {
            codeRef.current = code;
            try {
              // Update editor UI
              editorRef.current?.setValue(code);
            } catch {}

            // Persist locally by room
            try {
              localStorage.setItem(codeKey, code);
            } catch {}
          }
        };

        // Set up event listeners
        if (socketRef.current.connected) {
          onConnect();
        } else {
          socketRef.current.on('connect', onConnect);
        }

        socketRef.current.on('disconnect', onDisconnect);
        socketRef.current.on('connect_error', handleErrors);
        socketRef.current.on('connect_failed', handleErrors);
        socketRef.current.on(ACTIONS.JOINED, handleJoined);
        socketRef.current.on(ACTIONS.DISCONNECTED, handleDisconnected);
        socketRef.current.on(ACTIONS.SYNC_CODE, handleSyncCode);
        socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);
      } catch (err) {
        console.error('[EditorPage] Init error:', err);
        if (mountedRef.current) {
          handleErrors(err);
        }
      }
    };

    init();

    return () => {
      mountedRef.current = false;
      cleanupSocket();
    };
  }, [location.state?.username, reactNavigator, roomId, codeKey, persistentUserId]);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID copied');
    } catch (e) {
      toast.error('Could not copy Room ID');
    }
  };

  const leaveRoom = () => {
    mountedRef.current = false;
    cleanupSocket();
    reactNavigator('/home/bookmark');
  };

  if (!location.state) return <Navigate to="/" />;

  return (
    <div
  className="mainWrap"
  style={{
    display: "flex", // instead of grid
    height: "100vh",
    overflow: "hidden",
  }}
>
  {/* LEFT SIDE */}
  <div
    className="leftPane"
    style={{
      width: "300px",
      display: "flex",
      flexDirection: "column",
      borderRight: "2px solid #2d2d2d",
      background: "#fff", // independent styling
    }}
  >
    {/* Logo Section */}
    <div
      style={{
        borderBottom: "2px solid #2d2d2d",
        height: "160px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img src={logo} alt="Logo" width="150" height="100" />
    </div>

    {/* Sidebar / Members */}
    <div
      className="asideInner"
      style={{ flex: 1, overflowY: "auto", padding: "10px" }}
    >
      <h3 className="roomMembers">Room Members ({clients.length})</h3>

      {connecting && (
        <div style={{ padding: "10px", color: "#999", fontSize: "14px" }}>
          Connecting...
        </div>
      )}

      <div
        className="clientList"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2px",
          marginTop: "10px",
          marginRight : 15
        }}
      >
        {clients.map((client) => (
          <Client key={client.socketId} username={client.username} />
        ))}
      </div>
    </div>

    {/* Sidebar Buttons */}
    <div style={{ padding: "10px" }}>
      <button className="btn copyBtn" onClick={copyRoomId} style={{ marginTop: 8 , marginLeft: 20 }} >
        Copy ROOM ID
      </button>

      <button
        className="btn copyBtn"
        onClick={() => setCameraOn((prev) => !prev)}
        style={{
          marginTop: 8,
          marginLeft : 20,
          backgroundColor: cameraOn ? "#dc2626" : "#059669",
        }}
        disabled={!socketConnected}
      >
        {cameraOn ? "Turn camera off" : "Turn camera on"}
      </button>

      <button className="btn leaveBtn" onClick={leaveRoom} style={{ marginTop: 8 , marginLeft: 20 }}>
        Leave Room
      </button>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div
    className="rightPane"
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: "#fff", // independent styling
    }}
  >
    {/* Video */}
    {socketRef.current && socketConnected ? (
      <VideoTiles
        socketRef={socketRef}
        roomId={roomId}
        enableMedia={cameraOn}
        clients={clients}
      />
    ) : (
      <div style={{ padding: 12, textAlign: "center", color: "#999" }}>
        Initializing video...
      </div>
    )}

    {/* Code Editor */}
    <div style={{ flex: 1, minHeight: 20, minWidth: 0 }}>
      <Editor
        socketRef={socketRef}
        roomId={roomId}
        onCodeChange={(code) => {
          codeRef.current = code;
          try {
            localStorage.setItem(codeKey, code ?? "");
          } catch {}
        }}
        editorRef={editorRef}
      />
    </div>
  </div>
</div>

  );
};

export default EditorPage;
