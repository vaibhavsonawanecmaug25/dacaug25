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
  const activeProjects = projects.filter(p => p.status === "In Progress" || p.status === "Active").length;
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "Active").length;

  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "completed" || statusLower === "active") {
      return "bg-success";
    } else if (statusLower === "in progress" || statusLower === "pending") {
      return "bg-warning text-dark";
    } else if (statusLower === "planned") {
      return "bg-info";
    } else {
      return "bg-secondary";
    }
  };

  const getRoleBadgeClass = (role) => {
    const roleLower = role?.toLowerCase() || "";
    if (roleLower === "admin") {
      return "bg-danger";
    } else if (roleLower === "manager") {
      return "bg-primary";
    } else {
      return "bg-secondary";
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={fetchData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary mb-0">
          <i className="bi bi-speedometer2"></i> Admin Dashboard
        </h2>
        <button className="btn btn-outline-primary" onClick={fetchData}>
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-primary shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title text-muted">Total Users</h5>
              <h2 className="text-primary mb-0">{totalUsers}</h2>
              <small className="text-success">{activeUsers} Active</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-success shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title text-muted">Total Projects</h5>
              <h2 className="text-success mb-0">{projects.length}</h2>
              <small className="text-primary">{activeProjects} Active</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-warning shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title text-muted">Completed</h5>
              <h2 className="text-warning mb-0">{completedProjects}</h2>
              <small className="text-muted">
                {projects.length > 0 
                  ? Math.round((completedProjects / projects.length) * 100) 
                  : 0}%
              </small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-info shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title text-muted">In Progress</h5>
              <h2 className="text-info mb-0">{activeProjects}</h2>
              <small className="text-muted">Active Projects</small>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            <i className="bi bi-people"></i> All Users ({users.length})
          </h5>
        </div>
        <div className="card-body p-0">
          {users.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, index) => (
                    <tr key={u.id}>
                      <td>{index + 1}</td>
                      <td className="fw-semibold">{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${getRoleBadgeClass(u.role)}`}>
                          {u.role || "User"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                          {u.status || "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4 text-muted">
              <p className="mb-0">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Projects Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">
            <i className="bi bi-folder"></i> All Projects ({projects.length})
          </h5>
        </div>
        <div className="card-body p-0">
          {projects.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Project Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Start Date</th>
                    <th scope="col">End Date</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p, index) => (
                    <tr key={p.id}>
                      <td>{index + 1}</td>
                      <td className="fw-semibold">{p.title || "Untitled Project"}</td>
                      <td>
                        <span className="text-muted">
                          {p.description ? (p.description.length > 50 
                            ? `${p.description.substring(0, 50)}...` 
                            : p.description) 
                            : "—"}
                        </span>
                      </td>
                      <td>
                        {p.start_date 
                          ? new Date(p.start_date).toLocaleDateString() 
                          : "—"}
                      </td>
                      <td>
                        {p.end_date 
                          ? new Date(p.end_date).toLocaleDateString() 
                          : "—"}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(p.status)}`}>
                          {p.status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4 text-muted">
              <p className="mb-0">No projects found</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .table th {
          font-weight: 600;
          border-top: none;
        }
        .table-hover tbody tr:hover {
          background-color: rgba(0, 123, 255, 0.05);
          cursor: pointer;
        }
        .card-header {
          font-weight: 600;
        }
        .badge {
          padding: 0.4em 0.6em;
          font-size: 0.85em;
        }
      `}</style>
    </div>
  );
}
