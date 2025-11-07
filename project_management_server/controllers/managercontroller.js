import { getConnectionObject } from "../src/config.js";

// Get all projects managed by this manager
export async function getMyProjects(request, response) {
  try {
    const conn = await getConnectionObject();
    
    if (!conn) {
      return response.status(503).json({ error: "Database connection not available" });
    }

    const managerId = parseInt(request.params.id);

    if (isNaN(managerId)) {
      return response.status(400).json({ error: "Invalid manager ID" });
    }

    const qry = `
      SELECT project_id, project_name, description, start_date, end_date, status
      FROM projects
      WHERE manager_id = ?
      ORDER BY created_at DESC
    `;
    const [rows] = await conn.query(qry, [managerId]);
    response.status(200).json(rows);
  } catch (error) {
    console.log("Error in getMyProjects:", error);
    console.log("Error stack:", error.stack);
    response.status(500).json({ message: "Something went wrong while fetching projects", error: error.message });
  }
}

// Get all team members under manager
export async function getTeamMembers(request, response) {
  try {
    const conn = await getConnectionObject();
    
    if (!conn) {
      return response.status(200).json([]);
    }

    const managerId = parseInt(request.params.id);

    if (isNaN(managerId)) {
      return response.status(400).json({ error: "Invalid manager ID" });
    }

    // Get users who have tasks in manager's projects (simpler approach)
    // This gives us the team members who are working on manager's projects
    const qry = `
      SELECT DISTINCT u.user_id, u.name, u.email, u.role, u.status
      FROM users u
      INNER JOIN tasks t ON u.user_id = t.assigned_to
      INNER JOIN projects p ON t.project_id = p.project_id
      WHERE p.manager_id = ?
    `;
    const [rows] = await conn.query(qry, [managerId]);
    response.status(200).json(rows);
  } catch (error) {
    console.log("Error in getTeamMembers:", error);
    console.log("Error details:", error.message);
    console.log("Error stack:", error.stack);
    // If query fails, return empty array
    response.status(200).json([]);
  }
}

// Assign task to team member
export async function assignTaskToMember(request, response) {
  try {
    const conn = await getConnectionObject();
    
    if (!conn) {
      return response.status(503).json({ error: "Database connection not available" });
    }

    const { project_id, title, description, assigned_to, due_date, priority, start_date, status } = request.body;

    if (!title || !assigned_to || !due_date) {
      return response.status(400).json({ error: "Title, assigned_to, and due_date are required" });
    }

    const qry = `
      INSERT INTO tasks (project_id, title, description, assigned_to, start_date, due_date, priority, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [resultSet] = await conn.query(qry, [
      project_id || null,
      title,
      description || "",
      assigned_to,
      start_date || new Date().toISOString().split('T')[0],
      due_date,
      priority || 'Medium',
      status || 'To Do'
    ]);

    if (resultSet.affectedRows === 1) {
      response.status(200).json({ message: "Task assigned successfully", task_id: resultSet.insertId });
    } else {
      response.status(500).json({ error: "Failed to assign task" });
    }
  } catch (error) {
    console.log("Error in assignTaskToMember:", error);
    response.status(500).json({ error: "Something went wrong while assigning task", details: error.message });
  }
}

// View all tasks under manager’s projects
export async function getManagerTasks(request, response) {
  try {
    const conn = getConnectionObject();
    const managerId = request.params.id;

const qry = `
  SELECT u.user_id, u.full_name, u.email, u.role
  FROM users u
  JOIN project_team pt ON u.user_id = pt.user_id
  JOIN projects p ON pt.project_id = p.project_id
  WHERE p.manager_id = ${managerId}
`;

    const [rows] = await conn.query(qry);
    response.status(200).send(rows);
  } catch (error) {
    console.log("Error in getManagerTasks:", error);
    response.status(500).send({ message: "Something went wrong while fetching tasks" });
  }
}



