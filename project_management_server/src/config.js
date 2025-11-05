// src/config.js
import { createConnection } from "mysql2/promise";

let conn = null;

export async function connectDB() {
  try {
    if (!conn) {
      conn = await createConnection({
        host: 'localhost',
        user: 'root',
        password: 'cdac1234',
        database: 'project_management',
        port: 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true
      });

      // Test the connection
      const [rows] = await conn.query('SELECT 1');
      if (rows[0]['1'] === 1) {
        console.log("✅ Database connected successfully!");
        return conn;
      }
    }
    return conn;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    conn = null;
    throw error;
  }
}

export async function getConnectionObject() {
  try {
    if (!conn) {
      conn = await connectDB();
    } else {
      // Verify connection is still alive
      try {
        await conn.query('SELECT 1');
      } catch (error) {
        console.log("Reconnecting to database...");
        conn = await connectDB();
      }
    }
    return conn;
  } catch (error) {
    console.error("Failed to get database connection:", error.message);
    throw error;
  }
}

// Do not initialize connection here, let the server do it

