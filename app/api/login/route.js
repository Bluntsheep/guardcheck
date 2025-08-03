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
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  idleTimeout: 300000,
  charset: "utf8mb4",
  timezone: "+00:00",
});

export async function GET(request, { params }) {
  let connection;

  try {
    connection = await pool.getConnection();
    const { username } = params;

    if (!username) {
      return Response.json(
        {
          success: false,
          message: "Username is required",
        },
        { status: 400 }
      );
    }

    const query = `
      SELECT active 
      FROM registration 
      WHERE d_user = ? OR email = ?
    `;

    const [rows] = await connection.execute(query, [username, username]);

    if (rows.length > 0) {
      const isActive =
        rows[0].active === 1 ||
        rows[0].active === "1" ||
        rows[0].active === true;

      return Response.json({
        success: true,
        isActive: isActive,
        message: isActive ? "User is active" : "User is not active",
      });
    } else {
      return Response.json(
        {
          success: false,
          isActive: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Active status check error:", error);
    return Response.json(
      {
        success: false,
        isActive: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function POST(request) {
  let connection;

  try {
    connection = await pool.getConnection();

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return Response.json(
        {
          success: false,
          message: "Username and password are required",
        },
        { status: 400 }
      );
    }

    // Updated query to include username and active status
    const query = `
      SELECT reg.d_user, reg.password, reg.active 
      FROM registration reg 
      WHERE (reg.d_user = ? OR reg.email = ?)
    `;

    const [rows] = await connection.execute(query, [username, username]);

    if (rows.length > 0) {
      const user = rows[0];

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return Response.json({
          success: true,
          message: "Login successful",
          user: {
            username: user.d_user,
            active: user.active,
          },
        });
      } else {
        return Response.json(
          {
            success: false,
            message: "Invalid credentials",
          },
          { status: 401 }
        );
      }
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
