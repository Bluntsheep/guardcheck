import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const pool = mysql.createPool({
  host: "sql6.jnb1.host-h.net",
  user: "puzzled_user",
  password: "z01W079712LSp7",
  database: "puzzled_new_database",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
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

    const { token, password } = await request.json();

    if (!token || !password) {
      return Response.json(
        {
          success: false,
          message: "Token and password are required",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    // Find user by reset token and check if token is not expired
    const [users] = await connection.execute(
      "SELECT id, d_user, reset_password_expires FROM registration WHERE reset_password_token = ?",
      [token]
    );

    if (users.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Invalid reset token",
        },
        { status: 400 }
      );
    }

    const user = users[0];

    // Check if token has expired
    if (
      !user.reset_password_expires ||
      new Date(user.reset_password_expires) < new Date()
    ) {
      // Clear expired token
      await connection.execute(
        "UPDATE registration SET reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?",
        [user.id]
      );

      return Response.json(
        {
          success: false,
          message:
            "Reset token has expired. Please request a new password reset.",
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user's password and clear reset token fields
    const [result] = await connection.execute(
      "UPDATE registration SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    if (result.affectedRows === 0) {
      return Response.json(
        {
          success: false,
          message: "Failed to update password",
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred. Please try again later.",
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
