import { getConnectionObject } from "../src/config.js";

// Create a new team
export async function createTeam(request, response) {
  try {
    const conn = getConnectionObject();
    const { team_name, manager_id } = request.body;

    const qry = `
      INSERT INTO teams (team_name, manager_id)
      VALUES ('${team_name}', '${manager_id}')
    `;
    const [resultSet] = await conn.query(qry);

    if (resultSet.affectedRows === 1) {
      response.status(200).send({ message: "Team created successfully", team_id: resultSet.insertId });
    } else {
      response.status(500).send({ message: "Failed to create team" });
    }
  } catch (error) {
    console.log("Error in createTeam:", error);
    response.status(500).send({ message: "Something went wrong while creating team" });
  }
}

// Add user to a team
export async function addMemberToTeam(request, response) {
  try {
    const conn = getConnectionObject();
    const { user_id, team_id } = request.body;

    const qry = `
      UPDATE users
      SET team_id='${team_id}'
      WHERE user_id=${user_id}
    `;
    const [resultSet] = await conn.query(qry);

    if (resultSet.affectedRows === 1) {
      response.status(200).send({ message: "User added to team successfully" });
    } else {
      response.status(404).send({ message: "User not found or already assigned" });
    }
  } catch (error) {
    console.log("Error in addMemberToTeam:", error);
    response.status(500).send({ message: "Something went wrong while adding member" });
  }
}

// Get all teams
export async function getAllTeams(request, response) {
  try {
    const conn = getConnectionObject();
    const qry = `
      SELECT t.team_id, t.team_name, u.name AS manager_name
      FROM teams t
      JOIN users u ON t.manager_id = u.user_id
    `;
    const [rows] = await conn.query(qry);
    response.status(200).send(rows);
  } catch (error) {
    console.log("Error in getAllTeams:", error);
    response.status(500).send({ message: "Something went wrong while fetching teams" });
  }
}

// Get members of a team
export async function getTeamMembers(request, response) {
  try {
    const conn = getConnectionObject();
    const teamId = request.params.id;

    const qry = `
      SELECT user_id, name, email, role, status
      FROM users
      WHERE team_id = ${teamId}
    `;
    const [rows] = await conn.query(qry);
    response.status(200).send(rows);
  } catch (error) {
    console.log("Error in getTeamMembers:", error);
    response.status(500).send({ message: "Something went wrong while fetching team members" });
  }
}

// Delete team
export async function deleteTeam(request, response) {
  try {
    const conn = getConnectionObject();
    const teamId = request.params.id;

    const qry = `DELETE FROM teams WHERE team_id=${teamId}`;
    const [resultSet] = await conn.query(qry);

    if (resultSet.affectedRows === 1) {
      response.status(200).send({ message: "Team deleted successfully" });
    } else {
      response.status(404).send({ message: "Team not found" });
    }
  } catch (error) {
    console.log("Error in deleteTeam:", error);
    response.status(500).send({ message: "Something went wrong while deleting team" });
  }
}
