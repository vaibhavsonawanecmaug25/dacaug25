import { getConnectionObject } from "../src/config.js";

// ✅ Create Project
export async function createproject(request, response) {
  try {
    const conn = await getConnectionObject();
    const { project_name, description, start_date, end_date, manager_id, status } = request.body;

    const qry = `INSERT INTO projects (project_name, description, start_date, end_date, manager_id, status)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    const [resultSet] = await conn.query(qry, [
      project_name,
      description || "",
      start_date || null,
      end_date || null,
      manager_id || null,
      status || "Planned"
    ]);

    response.status(201).send({
      message: "Project created successfully",
      id: resultSet.insertId,
      project_name,
      description,
      start_date,
      end_date,
      manager_id,
      status
    });
  } catch (error) {
    console.error("Error creating project:", error);
    response.status(500).send("Something went wrong while creating project");
  }
}

// ✅ Get all projects
export async function getallprojects(request, response) {
  try {
    const conn = await getConnectionObject();
    if (!conn) {
      console.error("Database connection not available");
      return response.status(503).json({ error: "Database connection not available" });
    }
    const qry = `SELECT * FROM projects ORDER BY created_at DESC`;
    const [resultSet] = await conn.query(qry);
    console.log("Projects fetched:", resultSet.length);
    response.status(200).json(resultSet);
  } catch (error) {
    console.error("Error fetching projects:", error);
    response.status(500).json({ error: "Error fetching projects", details: error.message });
  }
}

// ✅ Get project by ID
export async function getprojectbyid(request, response) {
  try {
    const conn = await getConnectionObject();
    const { project_id } = request.params;
    const qry = `SELECT * FROM projects WHERE project_id = ${project_id}`;
    const [resultSet] = await conn.query(qry);
    response.status(200).send(resultSet);
  } catch (error) {
    console.error("Error fetching project:", error);
    response.status(500).send("Something went wrong");
  }
}

// ✅ Update project
export async function updateproject(request, response) {
  try {
    const conn = await getConnectionObject();
    const { project_id } = request.params;
    const { name, description, start_date, end_date, manager_id, status } = request.body;

    const qry = `UPDATE projects 
                 SET project_name='${name}', description='${description}', start_date='${start_date}', 
                 end_date='${end_date}', manager_id=${manager_id || null}, status='${status}'
                 WHERE project_id=${project_id}`;

    await conn.query(qry);
    response.status(200).send({ message: "Project updated successfully" });
  } catch (error) {
    console.error("Error updating project:", error);
    response.status(500).send("Something went wrong");
  }
}

// ✅ Delete project
export async function deleteproject(request, response) {
  try {
    const conn = await getConnectionObject();
    const { project_id } = request.params;
    const qry = `DELETE FROM projects WHERE project_id = ${project_id}`;
    await conn.query(qry);
    response.status(200).send({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    response.status(500).send("Something went wrong");
  }
}

// ✅ Assign manager to project
export async function assignmanagertoproject(request, response) {
  try {
    const conn = await getConnectionObject();
    const { project_id } = request.params;
    const { manager_id } = request.body;

    const qry = `UPDATE projects SET manager_id = ${manager_id} WHERE project_id = ${project_id}`;
    await conn.query(qry);
    response.status(200).send({ message: "Manager assigned to project successfully" });
  } catch (error) {
    console.error("Error assigning manager:", error);
    response.status(500).send("Something went wrong");
  }
}

// ✅ Remove manager from project
export async function removemanagerfromproject(request, response) {
  try {
    const conn = await getConnectionObject();
    const { project_id } = request.params;
    const qry = `UPDATE projects SET manager_id = NULL WHERE project_id = ${project_id}`;
    await conn.query(qry);
    response.status(200).send({ message: "Manager removed from project successfully" });
  } catch (error) {
    console.error("Error removing manager:", error);
    response.status(500).send("Something went wrong");
  }
}

// ✅ Get projects by manager
export async function getprojectbymanager(request, response) {
  try {
    const conn = await getConnectionObject();
    const { manager_id } = request.params;
    const qry = `SELECT * FROM projects WHERE manager_id = ${manager_id}`;
    const [resultSet] = await conn.query(qry);
    response.status(200).send(resultSet);
  } catch (error) {
    console.error("Error fetching projects by manager:", error);
    response.status(500).send("Something went wrong");
  }
}
