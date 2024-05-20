import React from "react";
import Form from "./Form";
import "./Login.css";
// import Navbar from "../Navbar";
import zcoderlogo from "../../assets/images/Zcoderlogo.svg";
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
                "header-headings " + (option === 1 ? "sign-in" : "sign-up")
              }>
              <span>Sign in to your account</span>
              <span>Create an account</span>
            </div>
          </header>

          <Form option={option} setOption={setOption} />
          <section>
            <div
              className={
                "section-headings " + (option === 1 ? "sign-in" : "sign-up")
              }>
              <div className="options bottomline">
                <span onClick={() => setOption(2)}>
                  Don't have an account ? Get started here
                </span>
                <span onClick={() => setOption(1)}>
                  Already a member? Log In here
                </span>
                {/* <span onClick={() => setOption(1)}>Log In here</span> */}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Login;
