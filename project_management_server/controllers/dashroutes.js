// controllers/dashroutes.js
import express from "express";
import authMiddleware from "../middleware/middleware.js";
import { getConnectionObject } from "../src/config.js";

const router = express.Router();

// Test endpoint to verify route is working
router.get("/test", (req, res) => {
  res.json({ message: "Dashboard routes are working!", timestamp: new Date().toISOString() });
});

// Get all users for admin dashboard
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const conn = await getConnectionObject();
    const [rows] = await conn.query(
      "SELECT user_id as id, name, email, role, status FROM users ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// Get all projects for admin dashboard
router.get("/projects", authMiddleware, async (req, res) => {
  try {
    const conn = await getConnectionObject();
    const [rows] = await conn.query(
      "SELECT project_id as id, project_name as title, description, start_date, end_date, status, manager_id FROM projects ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Error fetching projects", error: err.message });
  }
});

// Get tasks for a specific user
router.get("/tasks/user/:id", authMiddleware, async (req, res) => {
  try {
    const conn = await getConnectionObject();
    const userId = req.params.id;
    const [rows] = await conn.query(
      `SELECT t.task_id as id, t.title, t.description, t.status, t.priority, 
              t.start_date, t.due_date, t.project_id,
              p.project_name, p.project_name as project_title
       FROM tasks t 
       LEFT JOIN projects p ON t.project_id = p.project_id 
       WHERE t.assigned_to = ? 
       ORDER BY t.created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching user tasks:", err);
    res.status(500).json({ message: "Error fetching user tasks", error: err.message });
  }
});

// Get projects for a specific user (projects where user has tasks or is manager)
router.get("/projects/user/:id", authMiddleware, async (req, res) => {
  try {
    const conn = await getConnectionObject();
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID", error: "User ID must be a number" });
    }

    // Get projects where user is manager OR has tasks assigned
    // Using subquery approach to handle both cases properly
    const [rows] = await conn.query(
      `SELECT DISTINCT p.project_id as id, p.project_name as title, p.description, 
              p.start_date, p.end_date, p.status, p.manager_id, p.created_at
       FROM projects p
       WHERE p.manager_id = ? 
          OR p.project_id IN (
              SELECT DISTINCT project_id 
              FROM tasks 
              WHERE assigned_to = ? AND project_id IS NOT NULL
          )
       ORDER BY p.created_at DESC`,
      [userId, userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching user projects:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ message: "Error fetching user projects", error: err.message });
  }
});

export default router;
