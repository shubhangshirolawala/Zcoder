import React from "react";
import "./Signin.css";

const SignInForm = () => {
  return (
    <form className="account-form" onSubmit={(evt) => evt.preventDefault()}>
      <div className="account-form-fields sign-in">
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Username"
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
          Sign in
        </button>
      </div>
    </form>
  );
};

export default SignInForm;
