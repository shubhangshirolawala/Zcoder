import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import SearchUser from "../searchUsers/searchUsers";
const Profile = () => {
  const [data, setData] = useState({});
  const [editing, setEditing] = useState(false);
  const [college, setCollege] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchProfile = async () => {
    let res = await axios.get("http://localhost:4000/api/v1/user/getUser", config);
    setData(res.data.userData);
    setCollege(res.data.userData.college || "");
  };

  const getBookmarkCount=async () => {

    let res= await axios.post("http://localhost:4000/api/v1/questions/getAllBookmarks", {}, config);
   setBookmarkCount(res.data.bookmarks.length);
  }

  useEffect(() => {
    fetchProfile();
    getBookmarkCount();
    // eslint-disable-next-line
  }, []);

  const handleSave = async () => {
    const formData = new FormData();
    if (college) formData.append("college", college);
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      const res = await axios.patch(
        "http://localhost:4000/api/v1/user/updateProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setData(res.data.user);
      setEditing(false);
      setAvatarFile(null);
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={data.avatar? `http://localhost:4000/${data.avatar}`: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.userName)}
          alt="Profile"
          className="profile-image"
        />

        {editing && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
        )}

        <div className="profile-actions" style={{ marginTop: 10, marginBottom: 10 }}>
          {editing ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)}>Edit Profile</button>
          )}
        </div>

        <div className="profile-info">
          <p>
            <strong>Email:</strong> {data.email}
          </p>
          <p>
            <strong>Username:</strong> {data.userName}
          </p>
          <p>
            <strong>College:</strong>{" "}
            {editing ? (
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
              />
            ) : (
              data.college || "N/A"
            )}
          </p>
          <p>
            <strong>Bookmarks:</strong> {bookmarkCount}
          </p>
        </div>

            <SearchUser/>
         
      </div>
      
    </div>
  );
};

export default Profile;