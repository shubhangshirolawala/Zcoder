import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './FriendProfile.css';

const FriendProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`http://localhost:4000/api/v1/user/getUserById/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.userData);
    };
    fetchUser();
    // fetchBookmarks will run after user is set
  }, [id, token]);

  useEffect(() => {
    if (user) {
      const fetchBookmarks = async () => {
        const res = await axios.post(`http://localhost:4000/api/v1/questions/getAllBookmarks/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarks(res.data.bookmarks);
      };
      fetchBookmarks();
    }
  }, [user, token]);

  if (!user) return <div className="friend-profile-container">Loading...</div>;

  return (
    <div className="friend-profile-container">
      <div className="friend-profile-header">
        <img
          src={user.avatar ? `http://localhost:4000/${user.avatar}` : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.userName)}
          alt={user.userName}
          className="friend-profile-image"
        />
        <div className="friend-profile-info">
          <h2>{user.userName}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>College:</strong> {user.college || 'N/A'}</p>
        </div>
      </div>
      <div className="friend-profile-bookmarks">
        <h3>{user.userName}'s Bookmarks</h3>
        {bookmarks.length === 0 ? (
          <div className="no-bookmarks">No bookmarks found.</div>
        ) : (
          <table className="friend-bookmarks-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Url</th>
                <th>Solution</th>
              </tr>
            </thead>
            <tbody>
              {bookmarks.map(bm => (
                <tr key={bm._id}>
                  <td>{bm.title}</td>
                  <td>
                    <a href={bm.url} target="_blank" rel="noopener noreferrer" style={{ color: '#6c3cc4', textDecoration: 'underline', wordBreak: 'break-all' }}>
                      {bm.url}
                    </a>
                  </td>
                  <td>{bm.solution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FriendProfile;
