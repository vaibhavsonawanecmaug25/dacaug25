import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./authcontext.jsx";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

export default function DashboardManager() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
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

      // Fetch manager's projects, team members, and all tasks from their projects
      const [projectsRes, teamRes, tasksRes] = await Promise.all([
        axios.get(`${API_URL}/manager/${user.id}/projects`, { headers }),
        axios.get(`${API_URL}/manager/${user.id}/team-members`, { headers }).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/dashboard/tasks/user/${user.id}`, { headers }).catch(() => ({ data: [] }))
      ]);

      setProjects(projectsRes.data || []);
      setTeamMembers(teamRes.data || []);
      
      // Get all tasks from manager's projects
      const allTasks = [];
      for (const project of projectsRes.data || []) {
        try {
          const projectTasksRes = await axios.get(`${API_URL}/tasks/project/${project.project_id}`, { headers });
          allTasks.push(...(projectTasksRes.data || []));
        } catch (err) {
          console.error(`Error fetching tasks for project ${project.project_id}:`, err);
        }
      }
      setTasks(allTasks);

    } catch (err) {
      console.error("Error loading manager dashboard:", err);
      setError(err.response?.data?.message || err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "completed" || statusLower === "done") {
      return "bg-success";
    } else if (statusLower === "in progress" || statusLower === "pending") {
      return "bg-warning text-dark";
    } else if (statusLower === "to do" || statusLower === "planned") {
      return "bg-info";
    } else {
      return "bg-secondary";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    const priorityLower = priority?.toLowerCase() || "";
    if (priorityLower === "high" || priorityLower === "urgent") {
      return "bg-danger";
    } else if (priorityLower === "medium") {
      return "bg-warning text-dark";
    } else {
      return "bg-info";
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

  const completedProjects = projects.filter(p => p.status?.toLowerCase() === "completed").length;
  const activeProjects = projects.filter(p => p.status?.toLowerCase() === "in progress" || p.status?.toLowerCase() === "active").length;
  const completedTasks = tasks.filter(t => t.status?.toLowerCase() === "completed" || t.status?.toLowerCase() === "done").length;

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary mb-0">
          <i className="bi bi-speedometer2"></i> Manager Dashboard
        </h2>
        <div>
          <span className="text-muted me-3">Welcome, <strong>{user?.name || "Manager"}</strong></span>
          <button className="btn btn-outline-primary me-2" onClick={fetchData}>
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/assign")}>
            <i className="bi bi-person-plus"></i> Assign Tasks
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-primary shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title text-muted">My Projects</h5>
              <h2 className="text-primary mb-0">{projects.length}</h2>
              <small className="text-success">{activeProjects} Active</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-success shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title text-muted">Team Members</h5>
              <h2 className="text-success mb-0">{teamMembers.length}</h2>
              <small className="text-primary">Active Team</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-warning shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title text-muted">Total Tasks</h5>
              <h2 className="text-warning mb-0">{tasks.length}</h2>
              <small className="text-muted">{completedTasks} Completed</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-info shadow-sm h-100">
            <div className="card-body text-center">
              <h5 className="card-title text-muted">Completed</h5>
              <h2 className="text-info mb-0">{completedProjects}</h2>
              <small className="text-muted">
                {projects.length > 0 
                  ? Math.round((completedProjects / projects.length) * 100) 
                  : 0}%
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            <i className="bi bi-folder"></i> My Projects ({projects.length})
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
                    <tr key={p.project_id || index}>
                      <td>{index + 1}</td>
                      <td className="fw-semibold">{p.project_name || "Untitled Project"}</td>
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
              <p className="mb-0">
                <i className="bi bi-inbox"></i> No projects assigned.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Team Members Table */}
      {teamMembers.length > 0 && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">
              <i className="bi bi-people"></i> Team Members ({teamMembers.length})
            </h5>
          </div>
          <div className="card-body p-0">
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
                  {teamMembers.map((member, index) => (
                    <tr key={member.user_id || index}>
                      <td>{index + 1}</td>
                      <td className="fw-semibold">{member.name}</td>
                      <td>{member.email}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {member.role || "User"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${member.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                          {member.status || "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">
            <i className="bi bi-list-check"></i> Project Tasks ({tasks.length})
          </h5>
        </div>
        <div className="card-body p-0">
          {tasks.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Task Title</th>
                    <th scope="col">Project</th>
                    <th scope="col">Assigned To</th>
                    <th scope="col">Priority</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t, index) => (
                    <tr key={t.task_id || index}>
                      <td>{index + 1}</td>
                      <td className="fw-semibold">{t.title || "Untitled Task"}</td>
                      <td>
                        <span className="text-muted">
                          {t.project_name || "—"}
                        </span>
                      </td>
                      <td>
                        <span className="text-muted">
                          {t.assigned_to_name || "Unassigned"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getPriorityBadgeClass(t.priority)}`}>
                          {t.priority || "Medium"}
                        </span>
                      </td>
                      <td>
                        {t.due_date 
                          ? new Date(t.due_date).toLocaleDateString() 
                          : "—"}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(t.status)}`}>
                          {t.status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-4 text-muted">
              <p className="mb-0">
                <i className="bi bi-inbox"></i> No tasks found in your projects.
              </p>
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

