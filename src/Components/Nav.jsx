import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <Link to="/" className="text-center text-decoration-none">
      <h1 className="fw-bold" style={{ textShadow: "1px 1px 4px cyan" }}>
        <span className="blink2 rounded-top">.::'</span>
        <span className="blink rounded-top">|F1 RACE RESULTS|</span>
        <span className="blink2 rounded-top">'::.</span>
      </h1>
    </Link>
  );
};

export default Nav;
