// src/pages/MyFriends.jsx
import React, { useEffect, useState, useRef } from "react";
import "./MyFriends.css";
import axios from "axios";
import ChatWindow from "./chatWindow";
import { initMessageSocket } from "../components/msgSocket";
import { getMessageSocket } from "../components/msgSocket";

const MyFriends = () => {
  const [friends, setFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [openChats, setOpenChats] = useState([]);
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const load = async () => {
      // get current user from localStorage (set during sign-in)
      const user = localStorage.getItem("user");
      if (user) {
        setCurrentUser(JSON.parse(user));
        // ensure socket exists after page refresh
        const { _id } = JSON.parse(user);
        if (!getMessageSocket()) {
          await initMessageSocket(_id);
        }
      } else {
        // fallback: fetch from API
        try {
          const res = await axios.get("http://localhost:4000/api/v1/user/getUser", config);
          setCurrentUser(res.data.userData);
          if (!getMessageSocket()) {
            await initMessageSocket(res.data.userData._id);
          }
        } catch (err) {
          console.error("Failed to fetch current user:", err);
        }
      }
    };

    const fetchFriends = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/user/getAllFriends", config);
        const friendsIds = res.data.friends || [];
        const friendsData = await Promise.all(
          friendsIds.map(async (friendId) => {
            const friendRes = await axios.get(`http://localhost:4000/api/v1/user/getUserById/${friendId}`, config);
            return friendRes.data.userData;
          })
        );
        setFriends(friendsData);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setFriends([]);
      }
    };

    load();
    fetchFriends();
  }, []);

  const openChatWithFriend = (friend) => {
    // reuse a chat if already open for same friend (prevent duplicates)
    const exists = openChats.find((c) => c._id === friend._id);
    if (exists) return;
    const chatId = `${friend._id}-${Date.now()}`;
    setOpenChats((prev) => [...prev, { ...friend, chatId }]);
  };

  const closeChat = (chatId) => {
    setOpenChats((prev) => prev.filter((chat) => chat.chatId !== chatId));
  };

  return (
    <div className="friends-container">
      {/* <div className="friends-header">My Friends</div> */}
      <div className="friends-list">
        {friends.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center' }}>No friends found.</div>
        ) : (
          friends.map((friend, idx) => (
            <React.Fragment key={friend._id}>   
              <div className="friend-item">
                <img
                  src={friend.avatar ? `http://localhost:4000/${friend.avatar}` : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(friend.userName)}
                  alt={friend.userName}
                  className="friend-avatar"
                />
                <div className="friend-info">
                  <div className="friend-name">{friend.userName}</div>
                  <div className="friend-email">{friend.email}</div>
                </div>
                <button
                  style={{
                    marginLeft: '16px',
                    fontFamily: 'Raleway, sans-serif',
                    fontSize: '1.08rem',
                    color: '#fff',
                    background: '#ff69b4',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    height: '38px',
                    alignSelf: 'center',
                  }}
                  onClick={async () => {
                    if(window.confirm(`Remove ${friend.userName} from friends?`)) {
                      try {
                        await axios.patch(`http://localhost:4000/api/v1/user/removeFriend/${friend._id}`,null, config);
                        setFriends(friends.filter(f => f._id !== friend._id));
                      } catch (err) {
                        alert('Failed to remove friend.');
                      }
                    }
                  }}
                >
                  Remove
                </button>
                <button
                style={{
                    marginLeft: '16px',
                    fontFamily: 'Raleway, sans-serif',
                    fontSize: '1.08rem',
                    color: '#fff',
                    background: 'purple',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    height: '38px',
                    alignSelf: 'center',
                  }}
                  onClick={() => {
                    window.location.href = `/friend/${friend._id}`;
                  }}>
                    View Profile
                </button>
                <button className="friend-btn chat-btn"
               style={{ marginLeft: '16px',
                    fontFamily: 'Raleway, sans-serif',
                    fontSize: '1.08rem',
                    color: '#fff',
                    background: 'green',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    height: '38px',
                    alignSelf: 'center',
                }}
                onClick={() => openChatWithFriend(friend)}>Chat</button>
              </div>
              {idx !== friends.length - 1 && <div className="friend-divider" />}
            </React.Fragment>
          ))
        )}
      </div>

      {/* Open chat windows */}
      {openChats.map((chat, idx) => (
        <ChatWindow
          key={chat.chatId}
          friend={chat}
          currentUser={currentUser}
          initialMessages={[]} // ChatWindow will fetch history
          onClose={() => closeChat(chat.chatId)}
          positionIndex={idx}
        />
      ))}
    </div>
  );
};

export default MyFriends;
