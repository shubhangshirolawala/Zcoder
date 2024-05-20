import React, { useState } from "react";
import "./Login.css";

//import { useNavigate } from "react-router-dom";
const Form = ({ option, setOption }) => {

    const  [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [userName,setUserName]=useState("");

    const HandleSubmit = async (e) => {
        e.preventDefault();
        
        try {
          const response = await fetch('http://localhost:4000/api/v1/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, userName })
          });
    
          if (!response.ok) {
            throw new Error('Registration failed');
          }
    
         // navigate('/');
          console.log('Registration successful');
        } catch (error) {
          console.error('Error during registration:', error.message);
        }
      };
  return (

   
    <form className="account-form" onSubmit={(evt) => evt.preventDefault()}>
      <div
        className={
          "account-form-fields " +
          (option === 1 ? "sign-in" : option === 2 ? "sign-up" : "forgot")
        }>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Username / Email-id"
          required
        />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          required={option === 1 || option === 2 ? true : false}
          disabled={option === 3 ? true : false}
        />
        <input
          id="repeat-password"
          name="repeat-password"
          type="password"
          placeholder="Repeat password"
          required={option === 2 ? true : false}
          disabled={option === 1 || option === 3 ? true : false}
        />
      </div>
      <ul className="options">
        {/* <li
          className={option === 1 ? "active" : ""}
          onClick={() => setOption(1)}>
          Sign in
        </li>
        <li
          className={option === 2 ? "active" : ""}
          onClick={() => setOption(2)}>
          Sign up
        </li> */}
        <li
          className={option === 3 ? "active" : ""}
          onClick={() => setOption(3)}>
          Forgot Password?
        </li>
      </ul>
      <div id="subbtn">
        <button className="btn-submit-form" type="submit">
          {option === 1
            ? "Sign in"
            : option === 2
            ? "Sign up"
            : "Reset password"}
        </button>
      </div>
    </form>
  );
};

export default Form;