import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (


    <nav className="navbar navbar-expand-lg navbar-dark  shadow-sm" style={{ backgroundColor: "rgb(11,23,81)" }}>
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary " to="/">Project Management Tool</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/create-project">Add Project</Link>
            </li>
            <li>
              <Link className="nav-link" to="/tasks">Tasks</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">Sign Up</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
