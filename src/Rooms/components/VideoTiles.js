import React, { useEffect, useRef, useState, useCallback } from "react";
import Peer from "simple-peer";
import ACTIONS from "../Actions";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const VideoTiles = ({ socketRef, roomId, enableMedia = false, clients = [] }) => {
  const [streams, setStreams] = useState({});
  const peersRef = useRef({});
  const localStreamRef = useRef(null);
  const localReadyRef = useRef(false);
  const pendingAllUsers = useRef([]);
  const pendingJoined = useRef([]);
  const pendingSignals = useRef([]);
  const [localId, setLocalId] = useState(null);
  const mountedRef = useRef(true);

  // --- Stream management ---
  const addStream = useCallback((id, stream) => {
    if (!mountedRef.current) return;
    setStreams((prev) => (prev[id] === stream ? prev : { ...prev, [id]: stream }));
  }, []);

  const removeStream = useCallback((id) => {
    if (!mountedRef.current) return;
    setStreams((prev) => {
      if (!prev[id]) return prev;
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }, []);

  const cleanupPeer = useCallback(
    (remoteId) => {
      const p = peersRef.current[remoteId];
      if (p) {
        try {
          p.destroy();
        } catch (e) {
          console.warn("[VideoTiles] Error destroying peer:", e);
        }
        delete peersRef.current[remoteId];
      }
      removeStream(remoteId);
      console.log("[VideoTiles] cleaned peer:", remoteId);
    },
    [removeStream]
  );

  const normalizeId = (incoming) =>
    typeof incoming === "string" ? incoming : incoming?.socketId;

  // --- Peer creation ---
  const createPeer = useCallback(
    (remoteId, initiator) => {
      if (!remoteId || peersRef.current[remoteId]) return peersRef.current[remoteId];

      const peer = new Peer({
        initiator,
        trickle: false,
        stream: localStreamRef.current || undefined,
      });

      peer.on("signal", (signal) => {
        try {
          socketRef.current?.emit("signal", { to: remoteId, signal });
        } catch (e) {
          console.warn("[VideoTiles] emit signal failed", e);
        }
      });

      peer.on("stream", (remoteStream) => {
        console.log("[VideoTiles] received stream from", remoteId);
        addStream(remoteId, remoteStream);
      });

      peer.on("close", () => {
        console.log("[VideoTiles] peer closed", remoteId);
        cleanupPeer(remoteId);
      });

      peer.on("error", (err) => {
        console.warn("[VideoTiles] peer error", remoteId, err);
        cleanupPeer(remoteId);
      });

      peersRef.current[remoteId] = peer;
      console.log("[VideoTiles] created peer for", remoteId, "initiator:", initiator);
      return peer;
    },
    [socketRef, addStream, cleanupPeer]
  );

  const flushPendingSignals = useCallback(
    (sock) => {
      pendingSignals.current.forEach(({ from, signal }) => {
        if (from === sock.id) return;
        if (!peersRef.current[from]) {
          addStream(from, null);
          createPeer(from, false);
        }
        try {
          peersRef.current[from]?.signal(signal);
        } catch (err) {
          console.warn("[VideoTiles] Error processing pending signal:", err);
        }
      });
      pendingSignals.current = [];
    },
    [addStream, createPeer]
  );

  // --- Start local media ---
  const startLocal = useCallback(async () => {
    const sock = socketRef?.current;
    if (!sock || !mountedRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      localReadyRef.current = true;
      setLocalId(sock.id);
      addStream(sock.id, stream);

      // Persist camera ON state
      localStorage.setItem("cameraOn", "true");

      // Process pending users
      pendingAllUsers.current.forEach((id) => {
        if (id === sock.id) return;
        addStream(id, null);
        if (!peersRef.current[id]) createPeer(id, true);
      });
      pendingAllUsers.current = [];

      pendingJoined.current.forEach((id) => {
        if (id === sock.id) return;
        addStream(id, null);
        if (!peersRef.current[id]) createPeer(id, false);
      });
      pendingJoined.current = [];

      flushPendingSignals(sock);
      sock.emit("media-ready", { roomId });
      console.log("[VideoTiles] local media started & media-ready emitted");
    } catch (err) {
      console.warn("[VideoTiles] getUserMedia failed:", err);
      // Still set ready to allow text chat
      localReadyRef.current = true;
      setLocalId(sock.id);
      addStream(sock.id, null);
      localStorage.setItem("cameraOn", "false");
      sock.emit("media-ready", { roomId });
      flushPendingSignals(sock);
    }
  }, [roomId, socketRef, addStream, createPeer, flushPendingSignals]);

  // --- Stop local media ---
  const stopLocal = useCallback(() => {
    const sock = socketRef?.current;

    if (localStreamRef.current) {
      try {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch (e) {
        console.warn("[VideoTiles] Error stopping tracks:", e);
      }
      localStreamRef.current = null;
    }

    localReadyRef.current = false;
    setLocalId(sock?.id);

    // Instead of removing stream completely, keep placeholder for avatar
    addStream(sock?.id, null);

    try {
      sock?.emit("media-stopped", { roomId });
    } catch (e) {
      console.warn("[VideoTiles] Error emitting media-stopped:", e);
    }

    localStorage.setItem("cameraOn", "false");
    console.log("[VideoTiles] local media stopped");
  }, [roomId, socketRef, addStream]);

  // --- Socket events ---
  useEffect(() => {
    if (!socketRef?.current) return;
    const sock = socketRef.current;

    const handleAllUsers = ({ users }) => {
      users.forEach((id) => {
        if (id === sock.id) return;
        if (localReadyRef.current) {
          addStream(id, null);
          if (!peersRef.current[id]) createPeer(id, true);
        } else {
          pendingAllUsers.current.push(id);
        }
      });
    };

    const handleUserJoined = ({ id }) => {
      if (id === sock.id) return;
      if (localReadyRef.current) {
        addStream(id, null);
        if (!peersRef.current[id]) createPeer(id, false);
      } else {
        pendingJoined.current.push(id);
      }
    };

    const handleSignal = ({ from, signal }) => {
      if (from === sock.id) return;
      if (localReadyRef.current) {
        if (!peersRef.current[from]) {
          addStream(from, null);
          createPeer(from, false);
        }
        try {
          peersRef.current[from]?.signal(signal);
        } catch (err) {
          console.warn("[VideoTiles] Error applying signal", err);
        }
      } else {
        pendingSignals.current.push({ from, signal });
      }
    };

  const handleUserDisconnected = ({ socketId }) => {
  if (!peersRef.current[socketId]) {
    console.log(`[CLIENT] Ignored user-disconnected for invalid socket ${socketId}`);
    return;
  }
  cleanupPeer(socketId);
};

    sock.on("all-users", handleAllUsers);
    sock.on("user-joined", handleUserJoined);
    sock.on("signal", handleSignal);
    sock.on("user-disconnected", handleUserDisconnected);
          const handleUserLeft = ({ socketId }) => {
            if (!peersRef.current[socketId]) {
    console.log(`[CLIENT] Ignored user-left for invalid socket ${socketId}`);
    return;
  }
            cleanupPeer(socketId);
            };

            
sock.on("user-left", handleUserLeft);

    return () => {
      sock.off("all-users", handleAllUsers);
      sock.off("user-joined", handleUserJoined);
      sock.off("signal", handleSignal);
      sock.off("user-disconnected", handleUserDisconnected);
          sock.off("user-left", handleUserLeft);

    };
  }, [roomId, socketRef, addStream, createPeer, cleanupPeer]);

  // --- Start / stop media based on prop or persisted state ---
  useEffect(() => {
    const savedCam = localStorage.getItem("cameraOn");
    if (savedCam === "true" && enableMedia) {
      startLocal();
    } else if (enableMedia) {
      startLocal();
    } else {
      stopLocal();
    }
  }, [enableMedia, startLocal, stopLocal]);

  // Cleanup on unmount
// Cleanup on unmount
useEffect(() => {
  return () => {
    mountedRef.current = false;

    // Stop local media
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
    }

    // Destroy all peers
    Object.keys(peersRef.current).forEach((id) => {
      try {
        peersRef.current[id].destroy();
      } catch (e) {}
      delete peersRef.current[id];
    });

    setStreams({});
    
    // Tell server we left
    socketRef?.current?.emit("leave-room", { roomId });
  };
}, [roomId, socketRef]);


  const getInitials = (username) => {
    if (!username) return "NA";
    const parts = username.split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
<div
  className="videoRibbon"
  style={{
    display: "flex",
    alignItems: "stretch",
    gap: 12,
    overflowX: "auto",
    overflowY: "hidden",
    padding: "10px 12px",
    borderBottom: "2px solid #333",
    flexWrap: "nowrap",
  }}
>
  {Object.entries(streams).map(([id, stream]) => {
    const client = clients.find((c) => c.socketId === id);
    if (!client) {
      console.warn("[VideoTiles] skipping stream without client", id);
      return null;
    }
    return (
      <div
        key={id}
        style={{
          flex: "0 0 auto", // 👈 prevents shrinking
          minWidth: "180px", // 👈 ensures scroll
        }}
      >
        <ResizableBox
          width={220}
          height={140}
          minConstraints={[160, 100]}
          maxConstraints={[420, 300]}
          resizeHandles={["se"]}
        >
          {stream ? (
            <video
              ref={(el) => {
                if (el && stream && el.srcObject !== stream) {
                  el.srcObject = stream;
                }
              }}
              autoPlay
              playsInline
              muted={id === localId}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 8,
                background: "#000",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 8,
                background:
                  "linear-gradient(135deg, #46319C 0%, #6B46C1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 24,
                fontWeight: 700,
                border: "2px solid #333",
              }}
            >
              {getInitials(client?.username)}
            </div>
          )}
        </ResizableBox>
      </div>
    );
  })}
</div>


  );
};

export default VideoTiles;
