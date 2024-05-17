import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Signin.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form validation here

    // Log form data to console
    console.log({ email });
  };

  return (
    <div className="auth-form">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      <p>
        Remembered your password? <Link to="/signin">Sign In here</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
