import React from "react";
import { useAuth } from "./authcontext.jsx";
import { useLocation, Link } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <h5>Checking authentication...</h5>
        </div>
      </div>
    );
  }

  // 🚫 Not logged in → show professional message instead of redirect
  if (!user) {
    let pageMessage = "Please log in to access this page.";

    if (location.pathname.includes("create-project")) {
      pageMessage = "Sign in to create and manage projects efficiently.";
    } else if (location.pathname.includes("tasks")) {
      pageMessage = "Log in to view and update your assigned tasks.";
    } else if (location.pathname.includes("dashboard")) {
      pageMessage = "Access your personalized dashboard by signing in.";
    }

    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center p-4">
        <div
          className="shadow p-5 bg-white rounded"
          style={{ maxWidth: "500px", width: "90%" }}
        >
          <h2 className="mb-3 text-primary">🔒 Access Restricted</h2>
          <p className="text-muted mb-4">{pageMessage}</p>
          <Link to="/login" className="btn btn-primary px-4 py-2">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Logged in → allow page
  return children;
}
