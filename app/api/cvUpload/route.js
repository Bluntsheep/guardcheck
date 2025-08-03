import { NextResponse } from "next/server";
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
  connectTimeout: 60000, // 60 seconds
  idleTimeout: 300000,
  charset: "utf8mb4",
  timezone: "+00:00",
});

export async function POST(request) {
  let connection;

  try {
    // Get connection from pool
    connection = await pool.getConnection();

    const body = await request.json();
    console.log("Received guard CV data:", body);

    // Validate required fields
    const requiredFields = ["name", "surname", "idnum", "snum", "phonenum"];
    for (const field of requiredFields) {
      if (!body[field] || body[field].trim() === "") {
        return Response.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Extract data from request body (equivalent to PHP's extract($_POST))
    const {
      name,
      surname,
      idnum,
      snum,
      phonenum,
      g_area,
      town,
      g_hgrade,
      pexp,
      gender,
      guard_type,
    } = body;

    // Get current timestamp (equivalent to PHP's time())
    const time = Math.floor(Date.now() / 1000);

    // Check if CV already exists for this snum
    const [existingCV] = await connection.execute(
      "SELECT * FROM guard_cv WHERE snum = ?",
      [snum]
    );

    if (existingCV.length > 0) {
      return Response.json(
        {
          error:
            "Sorry you are already uploaded your cv so you cannot upload your CV.",
        },
        { status: 400 }
      );
    }

    // Check if user is blacklisted
    const [blacklisted] = await connection.execute(
      "SELECT * FROM blacklistguard WHERE sira_sob_no = ?",
      [snum]
    );

    if (blacklisted.length > 0) {
      return Response.json(
        { error: "Sorry you are blacklisted and you cannot upload your CV." },
        { status: 400 }
      );
    }

    // Insert new guard CV
    const [result] = await connection.execute(
      `INSERT INTO guard_cv (
        extra, name, surname, idnum, snum, phonenum, area, hgrade, pexp, gender, town, guard_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        time,
        name || "",
        surname || "",
        idnum || "",
        snum || "",
        phonenum || "",
        g_area || "",
        g_hgrade || "",
        pexp || "",
        gender || "",
        town || "",
        guard_type || "",
      ]
    );

    console.log("Guard CV upload successful, ID:", result.insertId);

    // Return success response (equivalent to PHP's echo "1")
    return Response.json({
      success: true,
      message: "CV uploaded successfully",
      response: "1", // Matching PHP response
      id: result.insertId,
    });
  } catch (error) {
    console.error("Guard CV upload error:", error);

    // Handle specific MySQL errors
    if (error.code === "ER_DUP_ENTRY") {
      return Response.json({ error: "Duplicate entry found" }, { status: 400 });
    }

    if (error.code === "PROTOCOL_CONNECTION_LOST") {
      return Response.json(
        { error: "Database connection lost. Please try again." },
        { status: 500 }
      );
    }

    return Response.json(
      {
        error: "CV upload failed. Please try again.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  } finally {
    // Release connection back to pool
    if (connection) {
      connection.release();
    }
  }
}
