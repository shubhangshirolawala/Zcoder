import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css"; // We'll create this CSS file for styling

const Profile = () => {
  //   const [profile, setProfile] = useState(null);
const [data,setData]= useState([]);
  //   useEffect(() => {
  //     axios
  //       .get("https://api.example.com/user/profile") // Replace with your backend endpoint
  //       .then((response) => {
  //         setProfile(response.data);
  //       })
  //       .catch((error) => {
  //         console.error("There was an error fetching the profile!", error);
  //       });
  //   }, []);

  //   if (!profile) return <div>Loading...</div>;
     const token= localStorage.getItem('token')
   
   // console.log(token);
    // const {users,setUsers}=useState("");

    const config={
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
    const fetchProfile = async()=>{
      let res =await axios.get("http://localhost:4000/api/v1/user/getUser",config);
      console.log(res)
      setData(res.data.userData)
        // setUsers(res.data.bookmarks)
      
     // console.log(res);
    }
    useEffect(()=>{
      fetchProfile()
    },[])

  const profile = {
    college:"Indian Institue Of Technology",
    username: data.userName,
    name: data.name,
    image: "https://via.placeholder.com/150", // Placeholder image URL
  };
  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={profile.image} alt="Profile" className="profile-image" />
        <div className="profile-info">
          {/* <p>
            <strong>Name:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {profile.name}
          </p> */}
          <p>
            <strong>Username:</strong>&nbsp;&nbsp;&nbsp;{profile.username}
          </p>
          <p>
            <strong>College:</strong>&nbsp;&nbsp;&nbsp;&nbsp; {profile.college}
          </p>
        </div>
        <div className="profile-separator"></div>
        <div className="profile-links">
          <a href="/friends" className="profile-link">
            My Friends
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;