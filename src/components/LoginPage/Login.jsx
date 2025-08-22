import React from "react";
import Form from "./Form";
import "./Login.css";
// import Navbar from "../Navbar";
import { connectSocket } from "../msgSocket";
import zcoderlogo from "../../assets/images/Zcoderlogo.svg";

let socket = null;

const Login = () => {
  const [option, setOption] = React.useState(1);

  return (
    <div className="out">
      <div className="logo">
        <img src={zcoderlogo} alt="" width={208} height={96} />{" "}
      </div>
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
        </div>
      </div>
    </div>
  );
};

export default Login;