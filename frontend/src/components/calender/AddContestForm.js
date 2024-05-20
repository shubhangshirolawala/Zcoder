import React, { useState } from "react";
import axios from "axios";

const AddContestForm = () => {
  const [contestData, setContestData] = useState({
    name: "",
    start_time: "",
    end_time: "",
  });

  const handleChange = (e) => {
    setContestData({ ...contestData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/contests/add", contestData); // Updated endpoint
      alert("Contest added successfully");
      // Reset form fields or navigate to another page
    } catch (error) {
      console.error("Error adding contest:", error);
      alert("Failed to add contest");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={contestData.name}
        onChange={handleChange}
        placeholder="Contest Name"
        required
      />
      <input
        type="datetime-local"
        name="start_time"
        value={contestData.start_time}
        onChange={handleChange}
        required
      />
      <input
        type="datetime-local"
        name="end_time"
        value={contestData.end_time}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Contest</button>
    </form>
  );
};

export default AddContestForm;
