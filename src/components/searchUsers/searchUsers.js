import React, { useState } from "react";
import axios from "axios";

const SearchUser = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [friends, setFriends] = useState([]);

  const token = localStorage.getItem("token");
    
   const fetchFriends = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/user/getAllFriends",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFriends(res.data.friends || []);
      } catch (err) {
        setFriends([]);
      }
    };
  React.useEffect(() => {
      fetchFriends();
    }, []);
    
    console.log(friends)

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/user/searchUsers?q=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResults(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by username"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          fontFamily: "Raleway, sans-serif",
          fontSize: "1.08rem",
          color: "#46319c",
          border: "1.5px solid #e5d6fa",
          borderRadius: "6px",
          padding: "8px 12px",
          marginRight: "8px",
          outline: "none",
          background: "#f8f9fa",
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          fontFamily: "Raleway, sans-serif",
          fontSize: "1.08rem",
          color: "#fff",
          background: "#6c3cc4",
          border: "none",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
      >
        Search
      </button>

      <ul
        style={{
          marginTop: "18px",
          fontFamily: "Raleway, sans-serif",
          fontSize: "1.08rem",
          color: "#46319c",
        }}
      >
        {results.map((user) => {
          const isFriend = friends.includes(user._id);
        //   console.log(user._id, isFriend);
          return (
            <li
              key={user._id}
              style={{
                background: "#f7f5fa",
                borderBottom: "2px solid #e5d6fa",
                padding: "8px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>
                {user.userName} ({user.email})
              </span>
              {!isFriend && (
                <button
                  style={{
                    marginLeft: "16px",
                    fontFamily: "Raleway, sans-serif",
                    fontSize: "1.08rem",
                    color: "#fff",
                    background: "#6c3cc4",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onClick={async () => {
                    try {
                      await axios.patch(
                        // console.log(user._id),
                        `http://localhost:4000/api/v1/user/addFriend/${user._id}`,null,
                       
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );
                      setFriends([...friends, user._id]);
                    } catch (err) {
                      alert("Failed to add friend.");
                    }
                  }}
                >
                  Add Friend
                </button>
              )}
              {isFriend && (
                <span
                  style={{
                    color: "#6c3cc4",
                    marginLeft: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Friend
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SearchUser;
