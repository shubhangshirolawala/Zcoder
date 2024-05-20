import React from "react";
import SignInForm from "./SignInForm";
import "./Signin.css";
import zcoderlogo from "../../assets/images/Zcoderlogo.svg";

const SignIn = () => {
  return (
    <div className="out">
      <div className="logo">
        <img src={zcoderlogo} alt="Logo" width={208} height={96} />
      </div>
      <div id="login">
        <div className="container">
          <header>
            <div className="header-headings sign-in">
              <span>Sign in to your account</span>
            </div>
          </header>
          <SignInForm />
          <section>
            <div className="section-headings sign-in">
              <div className="options bottomline">
                <span onClick={() => (window.location.href = "/signup")}>
                  Don't have an account? Get started here
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
