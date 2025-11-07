import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./authcontext.jsx";
import API_URL from "../api";

export default function DashboardUser() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user || !user.id) {
      setError("User information not available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const headers = { Authorization: `Bearer ${token}` };

      const taskRes = await axios.get(`${API_URL}/api/dashboard/tasks/user/${user.id}`, { headers });
      const projectRes = await axios.get(`${API_URL}/api/dashboard/projects/user/${user.id}`, { headers });

      setTasks(taskRes.data || []);
      setProjects(projectRes.data || []);
    } catch (err) {
      console.error("Error loading user dashboard:", err);
      setError(err.response?.data?.message || err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

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
      <h2 className="mb-4 text-primary">My Dashboard</h2>
      <div className="row">
        <div className="col-md-6">
          <h4>My Tasks</h4>
          <ul className="list-group">
            {tasks.length ? (
              tasks.map(t => (
                <li key={t.id} className="list-group-item">
                  {t.title} – <strong>{t.status}</strong>
                </li>
              ))
            ) : (
              <li className="list-group-item">No tasks assigned yet.</li>
            )}
          </ul>
        </div>

        <div className="col-md-6">
          <h4>My Projects</h4>
          <ul className="list-group">
            {projects.length ? (
              projects.map(p => (
                <li key={p.id} className="list-group-item">
                  {p.title}
                </li>
              ))
            ) : (
              <li className="list-group-item">No projects assigned.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
