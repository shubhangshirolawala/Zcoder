import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Signin.css";

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form validation here

    // Log form data to console
    console.log(formData);
  };

  return (
    <div className="login">
      <div className="container">
        <header>
          <div className="header-headings">Sign In</div>{" "}
        </header>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username / Email-id"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
        <p>
          Forgot your password? <Link to="/forgot-password">Reset here</Link>
        </p>
      </div>
      <p>
        Don't have an account? <Link to="/signup">Sign Up here</Link>
      </p>
    </div>
  );
};

export default SignIn;
