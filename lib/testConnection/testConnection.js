// import pool from "@/lib/testConnection/testConnection";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "sql6.jnb1.host-h.net",
  user: "puzzled_user",
  password: "z01W079712LSp7",
  database: "puzzled_new_database",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function testDbConnection() {
  let connection;
  try {
    console.log("Attempting to connect to MySQL database for testing...");
    connection = await pool.getConnection();
    await connection.query("SELECT 1 + 1 AS solution");
    console.log("✔️ MySQL database connection successful!");
    return true;
  } catch (error) {
    console.error(
      "❌ Error during MySQL database connection test:",
      error.message
    );
    return false;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
