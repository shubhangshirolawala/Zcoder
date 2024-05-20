import React, { useState } from "react";
import axios from "axios";

const ReminderForm = () => {
  const [email, setEmail] = useState("");
  const [contestName, setContestName] = useState("");
  const [startTime, setStartTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/schedule-reminder", {
        email,
        contestName,
        startTime,
      });
      alert("Reminder scheduled");
    } catch (error) {
      console.error("Error scheduling reminder:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Contest Name:
        <input
          type="text"
          value={contestName}
          onChange={(e) => setContestName(e.target.value)}
          required
        />
      </label>
      <label>
        Start Time:
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </label>
      <button type="submit">Schedule Reminder</button>
    </form>
  );
};

export default ReminderForm;
