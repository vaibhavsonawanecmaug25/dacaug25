import { getConnectionObject } from "../src/config.js";

// Create a comment
export async function addComment(request, response) {
  try {
    const conn = getConnectionObject();
    const { task_id, user_id, comment_text } = request.body;

    const qry = `
      INSERT INTO comments (task_id, user_id, comment_text)
      VALUES ('${task_id}', '${user_id}', '${comment_text}')
    `;
    const [resultSet] = await conn.query(qry);

    if (resultSet.affectedRows === 1) {
      response.status(200).send({ message: "Comment added successfully" });
    } else {
      response.status(500).send({ message: "Failed to add comment" });
    }
  } catch (error) {
    console.log("Error in addComment:", error);
    response.status(500).send({ message: "Something went wrong" });
  }
}

// Get comments for a task
export async function getCommentsByTask(request, response) {
  try {
    const conn = getConnectionObject();
    const taskId = request.params.taskId;

    const qry = `
      SELECT c.comment_id, c.comment_text, c.created_at, 
             u.name AS commented_by
      FROM comments c
      JOIN users u ON c.user_id = u.user_id
      WHERE c.task_id = ${taskId}
      ORDER BY c.created_at DESC
    `;
    const [rows] = await conn.query(qry);
    response.status(200).send(rows);
  } catch (error) {
    console.log("Error in getCommentsByTask:", error);
    response.status(500).send({ message: "Something went wrong while fetching comments" });
  }
}

// Delete comment
export async function deleteComment(request, response) {
  try {
    const conn = getConnectionObject();
    const commentId = request.params.id;

    const qry = `DELETE FROM comments WHERE comment_id=${commentId}`;
    const [resultSet] = await conn.query(qry);

    if (resultSet.affectedRows === 1) {
      response.status(200).send({ message: "Comment deleted successfully" });
    } else {
      response.status(404).send({ message: "Comment not found" });
    }
  } catch (error) {
    console.log("Error in deleteComment:", error);
    response.status(500).send({ message: "Something went wrong while deleting comment" });
  }
}
