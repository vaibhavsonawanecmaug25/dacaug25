import React from "react";
import { useAuth } from "./authcontext.jsx";
import DashboardAdmin from "./dashboardadmin.jsx";
import DashboardUser from "./dashboarduser.jsx";
import DashboardManager from "./dashboardmanager.jsx";

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

  // Check user role (case-insensitive)
  const userRole = user?.role?.toLowerCase();
  const isAdmin = userRole === "admin";
  const isManager = userRole === "manager";

  // Show appropriate dashboard based on role
  if (isAdmin) {
    return <DashboardAdmin />;
  } else if (isManager) {
    return <DashboardManager />;
  }

  return <DashboardUser />;
}
