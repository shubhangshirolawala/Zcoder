import React from "react";
import "./Login.css";
const Form = ({ option, setOption }) => {
  return (
    <form className="account-form" onSubmit={(evt) => evt.preventDefault()}>
      <div
        className={
          "account-form-fields " + (option === 1 ? "sign-in" : "sign-up")
        }>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Username"
          required
        />
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email-id"
          required
        />
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          // required={option === 1 || option === 2 ? true : false}
          // disabled={option === 3 ? true : false}
        />
        {/* <input
          id="repeat-password"
          name="repeat-password"
          type="password"
          placeholder="Repeat password"
          required={option === 2 ? true : false}
          disabled={option === 1 || option === 3 ? true : false}
        /> */}
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
        {/* <li
          className={option === 3 ? "active" : ""}
          onClick={() => setOption(3)}>
          Forgot Password?
        </li> */}
      </ul>
      <div id="subbtn">
        <button className="btn-submit-form" type="submit">
          {option === 1 ? "Sign in" : "Sign up"}
        </button>
      </div>
    </form>
  );
};

export default Form;