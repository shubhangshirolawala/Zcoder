import React from "react";
import yt from "../../assets/images/yt.png";
import li from "../../assets/images/linked in.png";
import meta from "../../assets/images/meta.png";
import ig from "../../assets/images/mdi_instagram.png";
import tw from "../../assets/images/prime_twitter.png";
//import you from "../../assets/images/"
//import tw from "../../"

import "./footer.css";
const Footer = () => {
  return (
    <div className="footer">
      <div className="icons">
        <img src={yt} alt="yt" className="b"></img>
        <img src={li} className="b"></img>
        <img src={meta} className="b"></img>
        <img src={ig} className="b"></img>
        <img src={tw} className="b"></img>
      </div>
      <div className="a">
        <p>Privacy Policy</p>
      </div>
      <div className="a">
        <p>Terms Of Service</p>
      </div>
      <div className="a">
        <p>@Copyright 2024 Zcoder-All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
