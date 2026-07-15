import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000,
  idleTimeout: 300000,
  charset: "utf8mb4",
  timezone: "+00:00",
});

export async function POST(request) {
  let connection;

  try {
    connection = await pool.getConnection();

    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const { password } = await request.json();

    if (!password || password.length < 6) {
      return Response.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check user exists
    const [users] = await connection.execute(
      "SELECT id FROM registration WHERE id = ?",
      [userId]
    );
    if (users.length === 0) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Hash the password (bcrypt)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update password field - assuming column is named 'password' (adjust if your column name differs)
    const [result] = await connection.execute(
      "UPDATE registration SET password = ? WHERE id = ?",
      [hashedPassword, userId]
    );

    if (result.affectedRows === 0) {
      return Response.json(
        { success: false, message: "Failed to update password" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
