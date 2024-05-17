import React from "react";
import "./Login.css";
const Form = ({ option }) => {
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
