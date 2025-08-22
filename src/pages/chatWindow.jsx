// src/components/ChatWindow.jsx
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { getMessageSocket } from "../components/msgSocket";

const ChatWindow = ({ friend, currentUser, initialMessages = [], onClose, positionIndex = 0 }) => {
  const [messages, setMessages] = useState(initialMessages || []);
  const [input, setInput] = useState("");
  const scrollRef = useRef();
  const [socketReady, setSocketReady] = useState(false);
  const unsavedMessagesRef = useRef([]);

  // Reset messages when friend changes
  useEffect(() => {
    setMessages(initialMessages || []);
    unsavedMessagesRef.current = [];
  }, [friend?._id, initialMessages]);

  // Ensure socket is ready
  useEffect(() => {
    const s = getMessageSocket();
    if (s) {
      setSocketReady(true);
    } else {
      const t = setInterval(() => {
        const ss = getMessageSocket();
        if (ss) {
          setSocketReady(true);
          clearInterval(t);
        }
      }, 300);
      return () => clearInterval(t);
    }
  }, []);

  // Fetch message history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!friend || !currentUser) return;
      try {
        const res = await axios.post("http://localhost:4000/api/messages/history", {
          from: currentUser._id,
          to: friend._id,
        });

         console.log("[ChatWindow] History response raw data:", res.data); // <-- Add this

        const formatted = res.data.map(m => ({
          id: m._id,
          fromSelf: m.fromSelf,
          message: m.message,
          createdAt: m.createdAt,
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("[ChatWindow] Failed to fetch message history:", err);
      }
    };
    fetchHistory();
  }, [friend, currentUser]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

useEffect(() => {
  const socket = getMessageSocket();
  if (!socket || !friend) return;

  const handleReceive = ({ from, message, _id, createdAt }) => {
    if (from === friend._id) {
      const newMsg = {
        id: _id || uuidv4(),
        fromSelf: false,
        message: typeof message === "object" ? message.text : message,
        createdAt,
      };
      // Always append to messages
      setMessages(prev => [...prev, newMsg]);
      unsavedMessagesRef.current.push(newMsg);
    }
  };

  socket.on("msg-receive", handleReceive);
  return () => socket.off("msg-receive", handleReceive);
}, [friend?._id]);

  // Send message
  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const socket = getMessageSocket();
    if (!socket) return;

    const newMessage = {
      id: uuidv4(),
      fromSelf: true,
      message: text,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    unsavedMessagesRef.current.push(newMessage);
    setInput("");

    socket.emit("send-msg", { from: currentUser._id, to: friend._id, msg: text });
  };

  // Save unsaved messages to DB
  const saveMessagesToDB = async () => {
    if (unsavedMessagesRef.current.length === 0) return;

    try {
      const payload = unsavedMessagesRef.current.map(msg => ({
        from: currentUser._id,
        to: friend._id,
        message: msg.message,
      }));

      await Promise.all(payload.map(p => axios.post("http://localhost:4000/api/messages/send", p)));
      unsavedMessagesRef.current = [];
    } catch (err) {
      console.error("[ChatWindow] Failed to save messages:", err);
    }
  };

  // Periodically flush unsaved messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (unsavedMessagesRef.current.length > 0) saveMessagesToDB();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Save on unmount
  useEffect(() => {
    return () => saveMessagesToDB();
  }, []);

  // Close handler
  const handleClose = () => {
    saveMessagesToDB();
    onClose && onClose();
  };

  if (!currentUser) return null;
  if (!socketReady)
    return <div style={{ position: "fixed", right: positionIndex * 380 + 20 }}>Connecting...</div>;

  return (
    <Wrapper style={{ right: positionIndex * 380 + 20 }}>
      <Header>
        <UserInfo>
          <Avatar
            src={
              friend?.avatar
                ? `http://localhost:4000/${friend.avatar}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(friend?.userName || "User")}`
            }
            alt={friend?.userName}
          />
          <div>
            <Name>{friend?.userName}</Name>
          </div>
        </UserInfo>
        <HeaderButtons>
          <CloseBtn onClick={handleClose}>✕</CloseBtn>
        </HeaderButtons>
      </Header>

      <MessagesArea>
        {messages.map(m => (
          <MessageRow key={m.id} $me={m.fromSelf}>
            {!m.fromSelf && (
              <AvatarSmall
                src={
                  friend?.avatar
                    ? `http://localhost:4000/${friend.avatar}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(friend?.userName || "User")}`
                }
                alt={friend?.userName}
              />
            )}
            <Bubble $me={m.fromSelf}>{m.message}</Bubble>
            {m.fromSelf && <div style={{ width: 36 }} />}
          </MessageRow>
        ))}
        <div ref={scrollRef} />
      </MessagesArea>

      <InputArea>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Write a message..."
        />
        <SendBtn onClick={sendMessage} disabled={!input.trim()}>
          Send
        </SendBtn>
      </InputArea>
    </Wrapper>
  );
};

export default ChatWindow;

/* --- Styled components --- */
const Wrapper = styled.div`position: fixed; bottom: 20px; width: 400px; height: 600px; background: #0f1720; box-shadow: 0 10px 30px rgba(0,0,0,0.6); border-radius: 12px; display: flex; flex-direction: column; z-index: 9999; transition: transform .18s ease; overflow: hidden;`;
const Header = styled.div`padding: 10px 12px; display:flex; align-items:center; justify-content:space-between; border-bottom: 1px solid #1f2a33; background: linear-gradient(90deg,#07111a, #0b1720);`;
const UserInfo = styled.div`display:flex; align-items:center; gap: 10px;`;
const Avatar = styled.img`width:44px; height:44px; border-radius:8px; object-fit:cover;`;
const AvatarSmall = styled.img`width:32px; height:32px; border-radius:6px; object-fit:cover; margin-right:8px;`;
const Name = styled.div`font-weight:700; color:#fff; font-size:14px;`;
const HeaderButtons = styled.div``;
const CloseBtn = styled.button`background:transparent; border:none; color:#cbd5e1; font-size:18px; cursor:pointer;`;
const MessagesArea = styled.div`padding: 12px; flex: 1; overflow-y: auto; display:flex; flex-direction:column; gap:10px; background: linear-gradient(180deg, #07111a 0%, #071522 100%);`;
const MessageRow = styled.div`display:flex; align-items:flex-end; justify-content: ${props => (props.$me ? "flex-end" : "flex-start")}; gap: 8px;`;
const Bubble = styled.div`max-width: 74%; padding: 10px 12px; background: ${props => (props.$me ? "linear-gradient(90deg,#0ea5a4,#06b6d4)" : "#0b1220")}; color: ${props => (props.$me ? "#021" : "#cfe8ff")}; border-radius: 12px; border-bottom-right-radius: ${props => (props.$me ? "4px" : "12px")}; border-bottom-left-radius: ${props => (props.$me ? "12px" : "4px")}; word-break: break-word;`;
const InputArea = styled.div`display:flex; gap:8px; padding:10px; border-top:1px solid #0f2a33; background: linear-gradient(90deg,#041018,#07131a);`;
const Input = styled.input`flex:1; border-radius:8px; padding:8px 10px; border:1px solid #102226; background:#07141a; color:#e6eef6; outline:none; font-size:14px;`;
const SendBtn = styled.button`background: linear-gradient(90deg,#06b6d4,#0ea5a4); border:none; color:#012; padding:8px 12px; border-radius:8px; cursor:pointer; font-weight:700; &:disabled { opacity:0.5; cursor:not-allowed; }`;
