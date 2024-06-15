import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-0">
        <div className="container-fluid">
          <Link to="/" className="text-center text-black text-decoration-none">
            <h1 className="fw-bold">
              <span
                className="blink2 rounded-top pe-1"
                style={{ textShadow: "1px 1px 4px yellow" }}
              >
                <i className="spinner-grow"></i>
              </span>
              <span
                className="blink rounded-top"
                style={{ textShadow: "2px 3px 1px cyan" }}
              >
                F1 RACE RESULTS
              </span>
              <span
                className="blink2 rounded-top ps-1"
                style={{ textShadow: "1px 1px 4px yellow" }}
              >
                <i className="spinner-grow"></i>
              </span>
            </h1>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#/DriverStandings">
                  Driver Standings
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#/ConstructorStandings">
                  Constructor Standings
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#/RaceHistoryChart">
                  Race History Chart
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
