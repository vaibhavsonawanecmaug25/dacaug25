'use strict';
import { getConnectionObject } from "../src/config.js";

export async function adminGetAllUsers(req, res) {
  try {
    const conn = getConnectionObject();
    const qry = `SELECT user_id, name, email, role, status, created_at, updated_at FROM users`;
    const [rows] = await conn.query(qry);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching users (Admin):", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function adminUpdateProject(req, res) {
  try {
    const conn = getConnectionObject();
    const { project_id } = req.params;
    const { project_name, description, status } = req.body;

    const qry = `
      UPDATE projects 
      SET project_name='${project_name}', description='${description}', status='${status}'
      WHERE id=${project_id}
    `;
    const [resultSet] = await conn.query(qry);

    if (resultSet.affectedRows === 0)
      return res.status(404).json({ message: "Project not found" });

    res.status(200).json({ message: "Project updated successfully" });
  } catch (error) {
    console.error("Error updating project (Admin):", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getuserbymanager(req, res) {
  try {
    const conn = getConnectionObject();
    const { manager_id } = req.params;
    const qry = `SELECT * FROM users WHERE manager_id = ${manager_id}`;
    const [resultSet] = await conn.query(qry);
    res.status(200).json(resultSet);
  } catch (error) {
    console.error("Error fetching users by manager (Admin):", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
