import React from "react";
import "./Signin.css";

const SignUpForm = () => {
  return (
    <form className="account-form" onSubmit={(evt) => evt.preventDefault()}>
      <div className="account-form-fields sign-up">
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          required
        />
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          required
        />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          required
        />
      </div>
      <div id="subbtn">
        <button className="btn-submit-form" type="submit">
          Sign up
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
