import React from "react";
import "./Routes/Bookmarks.css";
import { useNavigate } from "react-router-dom";
const Bookmarks = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/bookmarkform");
  };
  return (
    <div className="main">
      <div className="book ">
        <button className="btn1" onClick={handleButtonClick}>
          Add A Bookmark
        </button>
      </div>
    </div>
  );
};

export default Bookmarks;
