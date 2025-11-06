import { getConnectionObject } from "../src/config.js";

// ✅ Create Project
export async function createproject(req, res) {
  try {
    const conn = await getConnectionObject();
    const { project_name, description, start_date, end_date, manager_id, status } = req.body;

    if (!project_name) {
      return res.status(400).json({ error: "Project name is required" });
    }

    const query = `
      INSERT INTO projects (project_name, description, start_date, end_date, manager_id, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await conn.query(query, [
      project_name,
      description || "",
      start_date || null,
      end_date || null,
      manager_id || null,
      status || "Planned"
    ]);

    res.status(201).json({
      message: "Project created successfully",
      project_id: result.insertId,
      project_name,
      description,
      start_date,
      end_date,
      manager_id,
      status
    });
  } catch (err) {
    console.error("❌ Error creating project:", err);
    res.status(500).json({ error: "Something went wrong while creating project", details: err.message });
  }
}

// ✅ Get All Projects
export async function getallprojects(req, res) {
  try {
    const conn = await getConnectionObject();
    const [projects] = await conn.query(`SELECT * FROM projects ORDER BY created_at DESC`);
    res.status(200).json(projects);
  } catch (err) {
    console.error("❌ Error fetching projects:", err);
    res.status(500).json({ error: "Error fetching projects", details: err.message });
  }
}

// ✅ Get Project by ID
export async function getprojectbyid(req, res) {
  try {
    const conn = await getConnectionObject();
    const { project_id } = req.params;
    const [rows] = await conn.query("SELECT * FROM projects WHERE project_id = ?", [project_id]);

    if (rows.length === 0) return res.status(404).json({ error: "Project not found" });
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching project:", err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
}

// ✅ Update Project
export async function updateproject(req, res) {
  try {
    const conn = await getConnectionObject();
    const { project_id } = req.params;
    const { project_name, description, start_date, end_date, manager_id, status } = req.body;

    const [result] = await conn.query(
      `UPDATE projects 
       SET project_name=?, description=?, start_date=?, end_date=?, manager_id=?, status=? 
       WHERE project_id=?`,
      [project_name, description, start_date, end_date, manager_id || null, status, project_id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Project not found" });

    res.status(200).json({ message: "Project updated successfully" });
  } catch (err) {
    console.error("❌ Error updating project:", err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
}

// ✅ Delete Project
export async function deleteproject(req, res) {
  try {
    const conn = await getConnectionObject();
    const { project_id } = req.params;
    const [result] = await conn.query("DELETE FROM projects WHERE project_id = ?", [project_id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Project not found" });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting project:", err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
}

// ✅ Assign Manager to Project
export async function assignmanagertoproject(req, res) {
  try {
    const conn = await getConnectionObject();
    const { project_id } = req.params;
    const { manager_id } = req.body;

    if (!manager_id)
      return res.status(400).json({ error: "Manager ID is required" });

    const [result] = await conn.query(
      "UPDATE projects SET manager_id=? WHERE project_id=?",
      [manager_id, project_id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Project not found" });

    res.status(200).json({ message: "Manager assigned successfully" });
  } catch (err) {
    console.error("❌ Error assigning manager:", err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
}

// ✅ Remove Manager from Project
export async function removemanagerfromproject(req, res) {
  try {
    const conn = await getConnectionObject();
    const { project_id } = req.params;
    const [result] = await conn.query("UPDATE projects SET manager_id=NULL WHERE project_id=?", [project_id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Project not found" });

    res.status(200).json({ message: "Manager removed successfully" });
  } catch (err) {
    console.error("❌ Error removing manager:", err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
}

// ✅ Get Projects by Manager
export async function getprojectbymanager(req, res) {
  try {
    const conn = await getConnectionObject();
    const { manager_id } = req.params;
    const [rows] = await conn.query("SELECT * FROM projects WHERE manager_id=?", [manager_id]);
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error fetching projects by manager:", err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
}
