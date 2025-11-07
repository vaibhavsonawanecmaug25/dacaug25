import React from "react";
import { useAuth } from "./authcontext.jsx";
import DashboardAdmin from "./dashboardadmin.jsx";
import DashboardUser from "./dashboarduser.jsx";

export default function Dashboard() {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is admin (case-insensitive)
  const isAdmin = user?.role?.toLowerCase() === "admin";

  // Show admin dashboard for admin users, user dashboard for others
  if (isAdmin) {
    return <DashboardAdmin />;
  }

  return <DashboardUser />;
}
