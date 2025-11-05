import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";
import { Table, Button, Form, Container, Row, Col, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Tasks({ projectId = null }) { // default null => fetch all tasks
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    assigned_to: "",
    start_date: "",
    due_date: "",
    priority: "Medium",
    status: "Pending",
    description: ""
  });
  const [editTask, setEditTask] = useState({
    title: "",
    assigned_to: "",
    start_date: "",
    due_date: "",
    priority: "Medium",
    status: "Pending",
    description: ""
  });

  // ✅ Fetch all tasks or by project
  const fetchTasks = async () => {
    setLoading(true);
    try {
      console.log("Using API_URL:", API_URL);
      const url = projectId ? `${API_URL}/tasks/project/${projectId}` : `${API_URL}/tasks`;
      console.log("Fetching tasks from:", url);
      const res = await axios.get(url);
      console.log('Tasks fetched from API:', res.status, Array.isArray(res.data) ? res.data.length : typeof res.data);
      // Ensure we always set an array
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching tasks from API:", err?.response || err.message || err);
      const errorMsg = err?.response?.data?.error || err?.message || "Failed to load tasks";
      toast.error(errorMsg);
      setTasks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Tasks component mounting, projectId=', projectId);
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // ✅ Handle edit input change
  const handleEditChange = (e) => {
    setEditTask({ ...editTask, [e.target.name]: e.target.value });
  };

  // ✅ Open edit modal
  const handleEdit = (task) => {
    // Format dates for input fields (YYYY-MM-DD)
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    setEditingTask(task);
    setEditTask({
      title: task.title || "",
      assigned_to: task.assigned_to || "",
      start_date: formatDate(task.start_date),
      due_date: formatDate(task.due_date),
      priority: task.priority || "Medium",
      status: task.status || "Pending",
      description: task.description || ""
    });
    setShowEditModal(true);
  };

  // ✅ Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingTask(null);
    setEditTask({
      title: "",
      assigned_to: "",
      start_date: "",
      due_date: "",
      priority: "Medium",
      status: "Pending",
      description: ""
    });
  };

  // ✅ Update task
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      await axios.put(`${API_URL}/tasks/${editingTask.task_id}`, editTask);
      toast.success("✅ Task updated successfully!");
      handleCloseEditModal();
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
      const errorMsg = err?.response?.data?.error || "Failed to update task";
      toast.error(errorMsg);
    }
  };

  // ✅ Add task
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      // Only include project_id if it's provided
      const taskData = {
        ...newTask,
        ...(projectId && { project_id: projectId }),
      };
      
      await axios.post(`${API_URL}/tasks`, taskData);
      toast.success("✅ Task added successfully!");
      setNewTask({
        title: "",
        assigned_to: "",
        start_date: "",
        due_date: "",
        priority: "Medium",
        status: "Pending",
        description: ""
      });
      fetchTasks();
    } catch (err) {
      console.error("Error creating task:", err);
      const errorMsg = err?.response?.data?.error || "Failed to add task";
      toast.error(errorMsg);
    }
  };

  // ✅ Delete task
  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      toast.info("🗑️ Task deleted");
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task");
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <h2 className="text-primary mb-4">Task Management</h2>
          <p>Loading tasks...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <ToastContainer position="top-center" />
      <h2 className="text-center text-primary mb-4">Task Management</h2>

      {/* ✅ Add Task Form */}
      <Form
        onSubmit={handleAddTask}
        className="border p-4 rounded shadow-sm bg-light mb-4"
      >
        <Row className="g-3">
          <Col md={3}>
            <Form.Control
              type="text"
              name="title"
              placeholder="Task Title"
              value={newTask.title}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="number"
              name="assigned_to"
              placeholder="Assigned To (User ID)"
              value={newTask.assigned_to}
              onChange={handleChange}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="date"
              name="start_date"
              placeholder="Start Date"
              value={newTask.start_date}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="date"
              name="due_date"
              placeholder="Due Date"
              value={newTask.due_date}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={3}>
            <Form.Select
              name="priority"
              value={newTask.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              name="status"
              value={newTask.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </Form.Select>
          </Col>
          <Col md={3} className="text-end">
            <Button type="submit" variant="primary" className="w-100">
              Add Task
            </Button>
          </Col>
        </Row>
      </Form>

      {/* ✅ Task Table */}
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-primary text-center">
          <tr>
            <th>#</th>
            <th>Task Name</th>
            <th>Assigned To</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <tr key={task.task_id}>
                <td>{index + 1}</td>
                <td>{task.title}</td>
                <td>{task.assigned_to_name || task.assigned_to}</td>
                <td>
                  {task.due_date
                    ? new Date(task.due_date).toLocaleDateString()
                    : "—"}
                </td>
                <td>
                  <span className={`badge ${
                    task.priority === "High" 
                      ? "bg-danger" 
                      : task.priority === "Medium" 
                      ? "bg-warning text-dark" 
                      : "bg-info"
                  }`}>
                    {task.priority}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      task.status === "Completed"
                        ? "bg-success"
                        : task.status === "In Progress"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(task.task_id)}
                  >
                    Delete
                  </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-muted">
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* ✅ Edit Task Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateTask}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={12}>
                <Form.Label>Task Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Task Title"
                  value={editTask.title}
                  onChange={handleEditChange}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label>Assigned To (User ID)</Form.Label>
                <Form.Control
                  type="number"
                  name="assigned_to"
                  placeholder="Assigned To (User ID)"
                  value={editTask.assigned_to}
                  onChange={handleEditChange}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="description"
                  placeholder="Task Description"
                  value={editTask.description}
                  onChange={handleEditChange}
                />
              </Col>
              <Col md={6}>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="start_date"
                  value={editTask.start_date}
                  onChange={handleEditChange}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  name="due_date"
                  value={editTask.due_date}
                  onChange={handleEditChange}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={editTask.priority}
                  onChange={handleEditChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={editTask.status}
                  onChange={handleEditChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="To Do">To Do</option>
                </Form.Select>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Task
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default Tasks;
