// src/pages/SignInForm.jsx
import React, { useState } from "react";
import "./Signin.css";
import { useNavigate } from "react-router-dom";
import { initMessageSocket } from "../msgSocket";

const SignInForm = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const Handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });
      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();

      localStorage.setItem("token", data.token);

      // fetch full user details
      const userResponse = await fetch("http://localhost:4000/api/v1/user/getUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      });
      if (!userResponse.ok) throw new Error("Failed to fetch user info");
      const userDataJson = await userResponse.json();
      const userObj = userDataJson.userData;
      localStorage.setItem("user", JSON.stringify(userObj));

      // connect message socket and register userId before navigating
      await initMessageSocket(userObj._id);

      navigate("/home/bookmark");
    } catch (error) {
      console.error("Error during login:", error);
      // show user error message if desired
    }
  };

  return (
    <form className="account-form" onSubmit={Handlesubmit}>
      <div className="account-form-fields sign-in">
        <input value={userName} onChange={(e) => setUserName(e.target.value)} required placeholder="Username" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Password" />
      </div>
      <div id="subbtn">
        <button className="btn-submit-form" type="submit">Sign in</button>
      </div>
    </form>
  );
};

export default SignInForm;
