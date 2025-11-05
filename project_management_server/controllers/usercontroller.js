import { getConnectionObject } from "../src/config.js";
import bcrypt from "bcrypt";


export async function createuser(request, response) {
  try {
    const conn = getConnectionObject();
    const { name, email, password, role, status } = request.body;

    const password_hash = await bcrypt.hash(password, 10);

    const qry = `
      INSERT INTO users (name, email, password_hash, role, status)
      VALUES ('${name}', '${email}', '${password_hash}', '${role || 'Developer'}', '${status || 'Active'}')
    `;
    const [resultSet] = await conn.query(qry);

    if (resultSet.affectedRows === 1) {
      response.status(200).send({ message: "User Registered Successfully", user_id: resultSet.insertId });
    } else {
      response.status(500).send({ message: "User registration failed" });
    }
  } catch (error) {
    console.log("Error in createUser:", error);
    response.status(500).send({ message: "Something went wrong " });
  }
}




export async function updateusers(request, response) {
  try {
    const conn = getConnectionObject();
    const { name, email, password, role, status } = request.body;

    
    const password_hash = await bcrypt.hash(password, 10);

    
    const qry = `
      UPDATE users 
      SET name='${name}', email='${email}', password_hash='${password_hash}', role='${role || 'Developer'}', status='${status || 'Active'}'
      WHERE user_id=${request.params.id}
    `;

    const [resultSet] = await conn.query(qry);

 if (resultSet.affectedRows === 1) {
      response.status(200).send({ message: "User Updated Successfully" });
    } else {
      response.status(400).send({ message: "User not found or no changes made" });
    }
  } catch (error) {
    console.log("Error in updateUser:", error);
    response.status(500).send({ message: "Something went wrong while updating user" });
  }
}



export async function getallusers(request, response) {
  try {
    const conn = getConnectionObject();
    const qry = `SELECT user_id, name, email, role, status, created_at, updated_at FROM users`;
    const [rows] = await conn.query(qry);
    response.status(200).send(rows);
  } catch (error) {
    console.log("Error in getAllUsers:", error);
    response.status(500).send({ message: "Something went wrong while fetching users" });
  }
}


export async function getuserbyid(request, response) {
  try {
    const conn = getConnectionObject();
    const qry = `SELECT user_id, name, email, role, status, created_at, updated_at FROM users WHERE user_id=${request.params.id}`;
    const [rows] = await conn.query(qry);

    if (rows.length === 0) {
      response.status(404).send({ message: "User not found" });
    } else {
      response.status(200).send(rows[0]);
    }
  } catch (error) {
    console.log("Error in getUserById:", error);
    response.status(500).send({ message: "Something went wrong while fetching user" });
  }
}

export async function deleteUser(request, response) {
  try {
    const conn = getConnectionObject();
    const qry = `DELETE FROM users WHERE user_id=${request.params.id}`;
    const [resultSet] = await conn.query(qry);

    if (resultSet.affectedRows === 0) {
      response.status(404).send({ message: "User not found" });
    } else {
      response.status(200).send({ message: "User Deleted Successfully" });
    }
  } catch (error) {
    console.log("Error in deleteUser:", error);
    response.status(500).send({ message: "Something went wrong while deleting user" });
  }
}
export async function getMyTasks(request, response) {
  try {
    const conn = getConnectionObject();
    const developerId = request.params.id;

    const qry = `
      SELECT task_id, title AS task_name, status
      FROM tasks
      WHERE assigned_to = ${developerId}
    `;
    const [rows] = await conn.query(qry);
    response.status(200).send(rows);
  } catch (error) {
    console.log("Error in getMyTasks:", error);
    response.status(500).send({ message: "Something went wrong" });
  }
}


export async function updateTaskStatus(request, response) {
  try {
    const conn = getConnectionObject();
    const { status } = request.body;
    const taskId = request.params.id;

    const qry = `UPDATE tasks SET status='${status}' WHERE task_id=${taskId}`;
    const [resultSet] = await conn.query(qry);

    if (resultSet.affectedRows === 1) {
      response.status(200).send({ message: "Task status updated successfully" });
    } else {
      response.status(404).send({ message: "Task not found" });
    }
  } catch (error) {
    console.log("Error in updateTaskStatus:", error);
    response.status(500).send({ message: "Something went wrong" });
  }
}

