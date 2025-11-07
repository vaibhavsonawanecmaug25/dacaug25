import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./authcontext.jsx";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Assign() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  // Task assignment form state
  const [taskForm, setTaskForm] = useState({
    project_id: "",
    title: "",
    description: "",
    assigned_to: "",
    start_date: "",
    due_date: "",
    priority: "Medium",
    status: "To Do"
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch manager's projects and all users
      const [projectsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/manager/${user.id}/projects`, { headers }),
        axios.get(`${API_URL}/users`, { headers })
      ]);

      setProjects(projectsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    
    if (!taskForm.project_id || !taskForm.title || !taskForm.assigned_to || !taskForm.start_date || !taskForm.due_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setAssigning(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const taskData = {
        project_id: parseInt(taskForm.project_id),
        title: taskForm.title,
        description: taskForm.description,
        assigned_to: parseInt(taskForm.assigned_to),
        start_date: taskForm.start_date,
        due_date: taskForm.due_date,
        priority: taskForm.priority,
        status: taskForm.status
      };

      const res = await axios.post(`${API_URL}/tasks`, taskData, { headers });

      toast.success("Task assigned successfully!");
      
      // Reset form
      setTaskForm({
        project_id: "",
        title: "",
        description: "",
        assigned_to: "",
        start_date: "",
        due_date: "",
        priority: "Medium",
        status: "To Do"
      });

      // Optionally navigate back to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Error assigning task:", err);
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to assign task");
    } finally {
      setAssigning(false);
    }
  };

  const handleAssignProject = async (projectId, userId) => {
    if (!projectId || !userId) {
      toast.error("Please select both project and user");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Assign manager to project (if not already assigned)
      await axios.post(
        `${API_URL}/projects/${projectId}/assignmanager`,
        { manager_id: user.id },
        { headers }
      );

      toast.success("Project assignment updated!");
    } catch (err) {
      console.error("Error assigning project:", err);
      toast.error(err.response?.data?.error || "Failed to assign project");
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

  return (
    <div className="container mt-4 mb-5">
      <ToastContainer position="top-center" />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary mb-0">
          <i className="bi bi-person-plus"></i> Assign Projects & Tasks
        </h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate("/dashboard")}>
          <i className="bi bi-arrow-left"></i> Back to Dashboard
        </button>
      </div>

      <div className="row">
        {/* Assign Task Section */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-list-check"></i> Assign Task to User
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleAssignTask}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Project <span className="text-danger">*</span></label>
                    <select
                      name="project_id"
                      className="form-select"
                      value={taskForm.project_id}
                      onChange={handleTaskFormChange}
                      required
                    >
                      <option value="">Select Project</option>
                      {projects.map(p => (
                        <option key={p.project_id} value={p.project_id}>
                          {p.project_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Assign To <span className="text-danger">*</span></label>
                    <select
                      name="assigned_to"
                      className="form-select"
                      value={taskForm.assigned_to}
                      onChange={handleTaskFormChange}
                      required
                    >
                      <option value="">Select User</option>
                      {users.map(u => (
                        <option key={u.user_id} value={u.user_id}>
                          {u.name} ({u.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-12 mb-3">
                    <label className="form-label">Task Title <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={taskForm.title}
                      onChange={handleTaskFormChange}
                      placeholder="Enter task title"
                      required
                    />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      value={taskForm.description}
                      onChange={handleTaskFormChange}
                      placeholder="Enter task description"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Start Date <span className="text-danger">*</span></label>
                    <input
                      type="date"
                      name="start_date"
                      className="form-control"
                      value={taskForm.start_date}
                      onChange={handleTaskFormChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Due Date <span className="text-danger">*</span></label>
                    <input
                      type="date"
                      name="due_date"
                      className="form-control"
                      value={taskForm.due_date}
                      onChange={handleTaskFormChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">Priority</label>
                    <select
                      name="priority"
                      className="form-select"
                      value={taskForm.priority}
                      onChange={handleTaskFormChange}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="col-md-12 mb-3">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={taskForm.status}
                      onChange={handleTaskFormChange}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="col-md-12">
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={assigning}
                    >
                      {assigning ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Assigning...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle"></i> Assign Task
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Info Section */}
        <div className="col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-info text-white">
              <h6 className="mb-0">
                <i className="bi bi-info-circle"></i> Quick Info
              </h6>
            </div>
            <div className="card-body">
              <p className="mb-2">
                <strong>Available Projects:</strong> {projects.length}
              </p>
              <p className="mb-2">
                <strong>Available Users:</strong> {users.length}
              </p>
              <hr />
              <small className="text-muted">
                <i className="bi bi-lightbulb"></i> Select a project and user to assign tasks. 
                All fields marked with <span className="text-danger">*</span> are required.
              </small>
            </div>
          </div>

          {/* My Projects List */}
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h6 className="mb-0">
                <i className="bi bi-folder"></i> My Projects
              </h6>
            </div>
            <div className="card-body p-0">
              {projects.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {projects.map(p => (
                    <li key={p.project_id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{p.project_name}</strong>
                          <br />
                          <small className="text-muted">{p.status}</small>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3 text-center text-muted">
                  <small>No projects available</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

