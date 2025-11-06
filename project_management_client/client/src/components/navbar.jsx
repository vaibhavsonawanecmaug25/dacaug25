import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./authcontext.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-xl navbar-dark shadow-sm"
      style={{ backgroundColor: "rgb(11,23,81)" }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          Project Management Tool
        </Link>

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
              <Link className="nav-link text-white" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/about">
                About Us
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white" to="/contact">
               Contact us
              </Link>
             </li>

           
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/create-project">
                    Add Project
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/tasks">
                    Tasks
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
              </>
            )}
          </ul>

        
          <div className="d-flex ms-3">
            {user ? (
              <button className="btn btn-outline-light" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <Link className="btn btn-outline-light me-2" to="/login">
                  Login
                </Link>
                <Link className="btn btn-light" to="/signup">
                  Signup
                </Link>
                
              </>
            )}
          </div>
               
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
