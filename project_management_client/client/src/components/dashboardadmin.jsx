import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";

export default function DashboardAdmin() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const headers = { Authorization: `Bearer ${token}` };

      const usersUrl = `${API_URL}/api/dashboard/users`;
      const projectsUrl = `${API_URL}/api/dashboard/projects`;
      
      console.log("Fetching users from:", usersUrl);
      console.log("Fetching projects from:", projectsUrl);

      const userRes = await axios.get(usersUrl, { headers });
      const projectRes = await axios.get(projectsUrl, { headers });

      console.log("Users response:", userRes.data);
      console.log("Projects response:", projectRes.data);

      setUsers(userRes.data || []);
      setProjects(projectRes.data || []);
    } catch (err) {
      console.error("Error loading admin data:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        `Failed to load dashboard data (Status: ${err.response?.status || 'Unknown'})`
      );
    } finally {
      setLoading(false);
    }
  };

  const completedProjects = projects.filter(p => p.status === "Completed").length;

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

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Admin Dashboard</h2>
      <div className="row">
        <div className="col-md-6">
          <h4>All Users</h4>
          <ul className="list-group">
            {users.map(u => (
              <li key={u.id} className="list-group-item">
                {u.name} – {u.role}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-6">
          <h4>All Projects</h4>
          <ul className="list-group">
            {projects.map(p => (
              <li key={p.id} className="list-group-item d-flex justify-content-between">
                {p.title} <span>{p.status}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 fw-bold">
            Completed Projects: {completedProjects} / {projects.length}
          </p>
        </div>
      </div>
    </div>
  );
}
