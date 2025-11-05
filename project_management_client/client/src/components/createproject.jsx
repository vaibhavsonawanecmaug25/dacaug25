import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CreateProject() {
  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "Planned",
    manager_id: "",
  });

  const [projects, setProjects] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // ✅ Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:4400/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to fetch projects.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Create or Update project
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        // ✅ Update existing project
        const res = await axios.put(
          `http://localhost:4400/projects/${editId}`,
          formData
        );
        if (res.status === 200) {
          toast.success("✅ Project updated successfully!");
          setEditMode(false);
          setEditId(null);
        }
      } else {
        // ✅ Create new project
        const res = await axios.post("http://localhost:4400/projects", formData);
        if (res.status === 200 || res.status === 201) {
          toast.success("🎉 Project created successfully!");
        }
      }

      // Reset form + refresh
      setFormData({
        project_name: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "Planned",
        manager_id: "",
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Error saving project to server.");
    }
  };

  // ✅ Edit project
  const handleEdit = (project) => {
    setEditMode(true);
    setEditId(project.project_id);
    setFormData({
      project_name: project.project_name,
      description: project.description || "",
      start_date: project.start_date ? project.start_date.split("T")[0] : "",
      end_date: project.end_date ? project.end_date.split("T")[0] : "",
      status: project.status || "Planned",
      manager_id: project.manager_id || "",
    });
  };

  // ✅ Delete project
  const handleDelete = async (project_id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await axios.delete(`http://localhost:4400/projects/${project_id}`);
      if (res.status === 200) {
        toast.success("🗑️ Project deleted successfully!");
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete project.");
    }
  };

  return (
    <div className="container mt-5" style={{ minHeight: "80vh" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "700px" }}>
        <h3 className="text-center text-primary mb-4">
          {editMode ? "Update Project" : "Create New Project"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Project Name</label>
              <input
                type="text"
                className="form-control"
                name="project_name"
                value={formData.project_name}
                onChange={handleChange}
                required
                placeholder="Enter project name"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Status</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Planned</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Enter short project description"
            ></textarea>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Start Date</label>
              <input
                type="date"
                className="form-control"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">End Date</label>
              <input
                type="date"
                className="form-control"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Manager ID</label>
            <input
              type="number"
              className="form-control"
              name="manager_id"
              value={formData.manager_id}
              onChange={handleChange}
              placeholder="Enter Manager ID (optional)"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {editMode ? "Update Project" : "Create Project"}
          </button>
        </form>
      </div>

      {/* Project List */}
      <div className="mt-5">
        <h4 className="text-center text-success mb-3">All Projects</h4>
        <table className="table table-bordered table-striped text-center">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Start</th>
              <th>End</th>
              <th>Manager</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((proj) => (
                <tr key={proj.project_id}>
                  <td>{proj.project_id}</td>
                  <td>{proj.project_name}</td>
                  <td>{proj.status}</td>
                  <td>{proj.start_date?.split("T")[0]}</td>
                  <td>{proj.end_date?.split("T")[0]}</td>
                  <td>{proj.manager_id || "—"}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(proj)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(proj.project_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No projects found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
