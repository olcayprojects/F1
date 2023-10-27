import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <Link to="/" className="text-center text-decoration-none">
      <h1 className="fw-bold">| F1 Race Results |</h1>
    </Link>
  );
};

export default Nav;
