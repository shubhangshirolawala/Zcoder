import React from "react";
import Form from "./Form";
import "./Login.css";
const Login = () => {
  const [option, setOption] = React.useState(1);

  return (
    <div id="login">
      <div className="container">
        <header>
          <div
            className={
              "header-headings " +
              (option === 1 ? "sign-in" : option === 2 ? "sign-up" : "forgot")
            }>
            <span>Sign in to your account</span>
            <span>Create an account</span>
            <span>Reset your password</span>
          </div>
        </header>

        <Form option={option} setOption={setOption} />
        <section>
          <div
            className={
              "section-headings " +
              (option === 1 ? "sign-in" : option === 2 ? "sign-up" : "forgot")
            }>
            {/* <ul className="options">
              <li
                className={option === 1 ? "active" : ""}
                onClick={() => setOption(1)}>
                Don't have an account ? Get started here
              </li>
              <li
                className={option === 2 ? "active" : ""}
                onClick={() => setOption(2)}>
                Sign up
              </li>
              <li
                className={option === 3 ? "active" : ""}
                onClick={() => setOption(3)}>
                Forgot
              </li>
            </ul> */}
            <div className="options bottomline">
              <span onClick={() => setOption(2)}>
                Don't have an account ? Get started here
              </span>
              <span onClick={() => setOption(1)}>
                Already a member? Log In here
              </span>
              <span onClick={() => setOption(1)}>Log In here</span>
            </div>
          </div>
        </section>
        {/* <header>
          <div
            className={
              "header-headings " +
              (option === 1 ? "sign-in" : option === 2 ? "sign-up" : "forgot")
            }>
            <span>Don't have an account? Get started here</span>
            <span>Already a member? Log In here</span>
            <span>Reset your password</span>
          </div>
        </header> */}
        <footer>
          <a
            href="https://dribbble.com/shots/5041581-Zenbu-Sign-in-up-forgot-page"
            target="_blank">
            Original design with animations by Zenbu
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Login;
