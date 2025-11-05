import { getConnectionObject } from "../src/config.js";

// ✅ Create Task
export async function createtask(request, response) {
  try {
    const conn = await getConnectionObject();

    const {
      project_id,
      title,
      description,
      assigned_to,
      start_date,
      due_date,
      priority = "Medium",
      status = "To Do",
    } = request.body;

    console.log("📦 Task data received:", request.body);

    // ✅ Validation
    if (!title || !assigned_to || !start_date || !due_date) {
      return response
        .status(400)
        .json({ error: "Missing required fields: title, assigned_to, start_date, and due_date are required" });
    }
    
    // project_id is optional - task can exist without a project

    // ✅ Build SQL Query with parameterized values
    const qry = `
      INSERT INTO tasks 
      (project_id, title, description, assigned_to, start_date, due_date, priority, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [resultSet] = await conn.query(qry, [
      project_id,
      title,
      description || "",
      assigned_to,
      start_date,
      due_date,
      priority,
      status
    ]);

    console.log("🟢 Task created successfully:", resultSet);

    response.status(201).send({
      message: "Task created successfully",
      id: resultSet.insertId,
      project_id,
      title,
      description,
      assigned_to,
      start_date,
      due_date,
      priority,
      status,
    });
  } catch (error) {
    console.error("🔴 Error creating task:", error);
    response.status(500).send({
      error: "Failed to create task",
      details: error.message,
    });
  }
}

// ✅ Get all tasks
export async function getalltasks(request, response) {
  try {
    const conn = await getConnectionObject();
    if (!conn) {
      console.error("Database connection not available");
      return response.status(503).json({ error: "Database connection not available" });
    }
    const qry = `
      SELECT t.*, p.project_name, u.name as assigned_to_name 
      FROM tasks t 
      LEFT JOIN projects p ON t.project_id = p.project_id 
      LEFT JOIN users u ON t.assigned_to = u.user_id 
      ORDER BY t.created_at DESC
    `;
    const [resultSet] = await conn.query(qry);
    console.log("Tasks fetched:", resultSet.length);
    response.status(200).json(resultSet);
  } catch (error) {
    console.error("🔴 Error fetching tasks:", error);
    response.status(500).json({ 
      error: "Error fetching tasks", 
      details: error.message 
    });
  }
}

// ✅ Get tasks by project ID
export async function gettaskbyproject(request, response) {
  try {
    const conn = await getConnectionObject();
    if (!conn) {
      console.error("Database connection not available");
      return response.status(503).json({ error: "Database connection not available" });
    }
    const { project_id } = request.params;
    const qry = `
      SELECT t.*, p.project_name, u.name as assigned_to_name 
      FROM tasks t 
      LEFT JOIN projects p ON t.project_id = p.project_id 
      LEFT JOIN users u ON t.assigned_to = u.user_id 
      WHERE t.project_id = ?
      ORDER BY t.created_at DESC
    `;
    const [resultSet] = await conn.query(qry, [project_id]);
    console.log(`Tasks fetched for project ${project_id}:`, resultSet.length);
    response.status(200).json(resultSet);
  } catch (error) {
    console.error("🔴 Error fetching tasks by project:", error);
    response.status(500).json({ 
      error: "Error fetching tasks", 
      details: error.message 
    });
  }
}

// ✅ Get task by ID
export async function gettaskbyid(request, response) {
  try {
    const conn = await getConnectionObject();
    if (!conn) {
      console.error("Database connection not available");
      return response.status(503).json({ error: "Database connection not available" });
    }
    const { task_id } = request.params;
    const qry = `SELECT * FROM tasks WHERE task_id = ?`;
    const [resultSet] = await conn.query(qry, [task_id]);
    response.status(200).json(resultSet);
  } catch (error) {
    console.error("🔴 Error fetching task:", error);
    response.status(500).json({ 
      error: "Error fetching task", 
      details: error.message 
    });
  }
}

// ✅ Update task
export async function updatetask(request, response) {
  try {
    const conn = await getConnectionObject();
    if (!conn) {
      console.error("Database connection not available");
      return response.status(503).json({ error: "Database connection not available" });
    }
    const { task_id } = request.params;
    const {
      title,
      description,
      assigned_to,
      start_date,
      due_date,
      priority,
      status,
    } = request.body;

      const qry = `
        UPDATE tasks 
        SET 
          title=?, 
          description=?, 
          assigned_to=?, 
          start_date=?, 
          due_date=?, 
          priority=?, 
          status=?
        WHERE task_id=?
      `;

    console.log("🟡 SQL QUERY:", qry);

      await conn.query(qry, [
        title,
        description || "",
        assigned_to,
        start_date,
        due_date,
        priority,
        status,
        task_id
      ]);
    response.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("🔴 Error updating task:", error);
    response.status(500).json({ 
      error: "Error updating task", 
      details: error.message 
    });
  }
}

// ✅ Delete task
export async function deletetask(request, response) {
  try {
    const conn = await getConnectionObject();
    if (!conn) {
      console.error("Database connection not available");
      return response.status(503).json({ error: "Database connection not available" });
    }
    const { task_id } = request.params;
    const qry = `DELETE FROM tasks WHERE task_id = ?`;
    await conn.query(qry, [task_id]);
    response.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("🔴 Error deleting task:", error);
    response.status(500).json({ 
      error: "Error deleting task", 
      details: error.message 
    });
  }
}
