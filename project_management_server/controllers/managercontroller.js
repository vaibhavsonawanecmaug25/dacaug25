import { getConnectionObject } from "../src/config.js";

// Get all projects managed by this manager
export async function getMyProjects(request, response) {
  try {
    const conn = getConnectionObject();
    const managerId = request.params.id;

    const qry = `
      SELECT project_id, project_name, description, start_date, end_date, status
      FROM projects
      WHERE manager_id = ${managerId}
    `;
    const [rows] = await conn.query(qry);
    response.status(200).send(rows);
  } catch (error) {
    console.log("Error in getMyProjects:", error);
    response.status(500).send({ message: "Something went wrong while fetching projects" });
  }
}

// Get all team members under manager
export async function getTeamMembers(request, response) {
  try {
    const conn = getConnectionObject();
    const managerId = request.params.id;

    const qry = `
      SELECT u.user_id, u.name, u.email, u.role, u.status
      FROM users u
      JOIN teams t ON u.team_id = t.team_id
      WHERE t.manager_id = ${managerId}
    `;
    const [rows] = await conn.query(qry);
    response.status(200).send(rows);
  } catch (error) {
    console.log("Error in getTeamMembers:", error);
    response.status(500).send({ message: "Something went wrong while fetching team members" });
  }
}

// Assign task to team member
export async function assignTaskToMember(request, response) {
  try {
    const conn = getConnectionObject();
    const { project_id, title, description, assigned_to, due_date, priority } = request.body;

    const qry = `
      INSERT INTO tasks (project_id, title, description, assigned_to, due_date, priority, status)
      VALUES ('${project_id}', '${title}', '${description}', '${assigned_to}', '${due_date}', '${priority || 'Medium'}', 'Pending')
    `;
    const [resultSet] = await conn.query(qry);

    if (resultSet.affectedRows === 1) {
      response.status(200).send({ message: "Task assigned successfully", task_id: resultSet.insertId });
    } else {
      response.status(500).send({ message: "Failed to assign task" });
    }
  } catch (error) {
    console.log("Error in assignTaskToMember:", error);
    response.status(500).send({ message: "Something went wrong while assigning task" });
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



