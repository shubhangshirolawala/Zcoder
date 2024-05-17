import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/forgot-password",
        { email }
      );
      console.log(response.data);
      // Handle successful password reset request
    } catch (error) {
      console.error("Error requesting password reset", error);
    }
  };

  return (
    <form onSubmit={handleForgotPassword}>
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Request Password Reset</button>
    </form>
  );
};

export default ForgotPassword;
