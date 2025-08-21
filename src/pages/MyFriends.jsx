import React, { useEffect, useState } from 'react';
import './MyFriends.css';
import axios from 'axios';

const MyFriends = () => {
    const [friends, setFriends] = useState([]);
    const token = localStorage.getItem('token');

    const config= {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const fetchFriends = async () => {
        const res = await axios.get('http://localhost:4000/api/v1/user/getAllFriends', config);
        const friendsIds = res.data.friends;

        try{
        const friendsData = await Promise.all(
            friendsIds.map(async (friendId) => {
                const friendRes = await axios.get(`http://localhost:4000/api/v1/user/getUserById/${friendId}`, config);
                return friendRes.data.userData;
            })
            
        );
    setFriends(friendsData);
    }
        catch (error) {
            console.error("Error fetching friends:", error);
            setFriends([]);
            return;
        }
        
    }

    useEffect(() => {
        fetchFriends();
    }, []);

   return (
    <div className="friends-container">
      <div className="friends-header">My Friends</div>
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
                <button
                style={{
                    marginLeft: '16px',
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
                  }}>Chat</button>
              </div>
              {idx !== friends.length - 1 && <div className="friend-divider" />}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default MyFriends;