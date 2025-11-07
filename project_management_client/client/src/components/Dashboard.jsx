import React from "react";
import { useAuth } from "./authcontext.jsx";
import DashboardAdmin from "./dashboardadmin.jsx";
import DashboardUser from "./dashboarduser.jsx";

export default function Dashboard() {
  const { user } = useAuth();

  // Show admin dashboard for admin users, user dashboard for others
  if (user?.role === "admin" || user?.role === "Admin") {
    return <DashboardAdmin />;
  }

  return <DashboardUser />;
}
