import React from "react";
import SignUpForm from "./SignUpForm";
import "./Signin.css";
import zcoderlogo from "../../assets/images/Zcoderlogo.svg";

const SignUp = () => {
  return (
    <div className="out">
      <div className="logo">
        <img src={zcoderlogo} alt="Logo" width={208} height={96} />
      </div>
      <div id="login">
        <div className="container">
          <header>
            <div className="header-headings sign-up">
              <span>Create an account</span>
            </div>
          </header>
          <SignUpForm />
          <section>
            <div className="section-headings sign-up">
              <div className="options bottomline">
                <span onClick={() => (window.location.href = "/signin")}>
                  Already a member? Log In here
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
