import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

let connection;

export async function connectDB() {
  try {
    if (connection && connection.connection && connection.connection.state !== "disconnected") {
      console.log("Database already connected");
      return connection;
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "cdac1234",
      database: process.env.DB_NAME || "project_management",
      port: Number(process.env.DB_PORT) || 3306
    });

    console.log("Database connected successfully!");
    return connection;
  } catch (err) {
    console.error("Database connection failed:", err.message);
    return null;
  }
}

export async function getConnectionObject() {
  if (!connection) {
    connection = await connectDB();
  }
  return connection;
}
