import React, { useState } from "react";
import "./BookmarkForm.css"; // Add your CSS styles here
import { useNavigate } from "react-router-dom";
const BookmarkForm = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [solution, setSolution] = useState("");
  const navigate = useNavigate();


  const config={
    headers:{
      Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjQ5MTIxMzk1MDQ4NTI3MjhjNDVhZTAiLCJpYXQiOjE3MTYwNjQ3ODgsImV4cCI6MTcxODY1Njc4OH0.IbwRoritZW1QjxzM5JztNeZK_V3VxpkToq5NXsP8VFU'
    }
  }


  const HandleButtonClick = () => {
    navigate("/bookmark");
  };


  const HandleSubmit = async (e) => {
    e.preventDefault();
    console.log("hello")
    try {
      const response = await fetch('http://localhost:4000/api/v1/questions/createQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjQ5MTIxMzk1MDQ4NTI3MjhjNDVhZTAiLCJpYXQiOjE3MTYwNjQ3ODgsImV4cCI6MTcxODY1Njc4OH0.IbwRoritZW1QjxzM5JztNeZK_V3VxpkToq5NXsP8VFU'
        },
        body: JSON.stringify({ title, url, solution })
      });

      if (!response.ok) {
        throw new Error('BookMark Addition failed');
      }

    //   navigate('/');
      console.log('BookMark Addition successful');
    } catch (error) {
      console.error('Error during BookMark Addition:', error.message);
    }
  };


//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const bookmark = { title, url, solution };
//     console.log("Submitting:", bookmark);
//     // Replace with your backend URL
//     fetch("http://localhost:4000/api/v1/questions/createQuestion", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(bookmark),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Success:", data);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };

  return (
    <div className="bookmark-form">
      <button className="back-button" onClick={HandleButtonClick}>
        ←
      </button>
      <h2>Add a Bookmark</h2>
      <form onSubmit={HandleSubmit}>
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