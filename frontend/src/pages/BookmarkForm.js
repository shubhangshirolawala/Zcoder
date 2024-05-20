// src/BookmarkForm.js
import React, { useState } from "react";
import "./BookmarkForm.css"; // Add your CSS styles here
import { useNavigate } from "react-router-dom";
const BookmarkForm = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [solution, setSolution] = useState("");
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/bookmark");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const bookmark = { title, url, solution };
    console.log("Submitting:", bookmark);
    // Replace with your backend URL
    fetch("http://localhost:5000/bookmarks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookmark),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="bookmark-form">
      <button className="back-button" onClick={handleButtonClick}>
        ←
      </button>
      <h2>Add a Bookmark</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. write a reverse string in Java"
            required
          />
        </label>
        <label>
          URL
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Link here"
            required
          />
        </label>
        <label>
          Solution
          <textarea
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Describe the solution"
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BookmarkForm;
