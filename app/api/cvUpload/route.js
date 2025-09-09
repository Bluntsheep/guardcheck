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
  queueLimit: 50,
  connectTimeout: 60000, // ✅ Valid - connection timeout
  // acquireTimeout: 60000,     // ❌ Remove - invalid for pools
  // timeout: 40000,            // ❌ Remove - invalid for pools
  // reconnect: true,           // ❌ Remove - invalid for pools
  charset: "utf8mb4",
  timezone: "+00:00",
  multipleStatements: false, // ✅ Valid - security best practice
  ssl: false, // ✅ Valid - set to true if host requires SSL
});

// Add error handling for the pool
pool.on("error", (err) => {
  console.error("Database pool error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log("Database connection was closed.");
  }
  if (err.code === "ER_CON_COUNT_ERROR") {
    console.log("Database has too many connections.");
  }
  if (err.code === "ECONNREFUSED") {
    console.log("Database connection was refused.");
  }
});

// GET request to find guards by area
export async function GET(request) {
  let connection;

  try {
    // Get connection from pool
    connection = await pool.getConnection();

    // Parse URL parameters
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");

    // Validate that area parameter is provided
    if (!area) {
      return Response.json(
        { error: "Area parameter is required" },
        { status: 400 }
      );
    }

    // Query to find guards from the specified area
    const query = "SELECT * FROM guard_cv WHERE area = ?";
    const queryParams = [area];

    console.log("Executing query:", query);
    console.log("With area:", area);

    // Execute the query
    const [guards] = await connection.execute(query, queryParams);

    // Format the response data
    const formattedGuards = guards.map((guard) => ({
      id: guard.guardcv_id,
      name: guard.name,
      surname: guard.surname,
      phone: guard.phonenum,
      grade: guard.hgrade,
      guardType: guard.guard_type,
      area: guard.area,
      town: guard.town,
      gender: guard.gender,
      experience: guard.pexp,
      idNumber: guard.idnum,
      siraNumber: guard.snum,
      uploadDate:
        guard.extra && !isNaN(guard.extra) && guard.extra > 0
          ? new Date(guard.extra * 1000).toISOString()
          : null,
    }));

    return Response.json({
      success: true,
      data: formattedGuards,
      total: guards.length,
      area: area,
    });
  } catch (error) {
    console.error("Error fetching guards by area:", error);

    if (error.code === "PROTOCOL_CONNECTION_LOST") {
      return Response.json(
        { error: "Database connection lost. Please try again." },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: false,
        error: "Failed to fetch guards. Please try again.",
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

export async function POST(request) {
  let connection;

  try {
    // Get connection from pool
    connection = await pool.getConnection();

    // Start transaction explicitly
    await connection.beginTransaction();

    const body = await request.json();
    console.log("Received guard CV data:", body);

    // Validate required fields
    const requiredFields = ["name", "surname", "idnum", "snum", "phonenum"];
    for (const field of requiredFields) {
      if (!body[field] || body[field].trim() === "") {
        await connection.rollback();
        return Response.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Extract data from request body
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

    // Get current timestamp
    const time = Math.floor(Date.now() / 1000);

    // Check if CV already exists for this snum
    const [existingCV] = await connection.execute(
      "SELECT * FROM guard_cv WHERE snum = ?",
      [snum]
    );

    if (existingCV.length > 0) {
      await connection.rollback();
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
      await connection.rollback();
      return Response.json(
        { error: "Sorry you are blacklisted and you cannot upload your CV." },
        { status: 400 }
      );
    }

    // Insert new guard CV
    console.log("Inserting CV with data:", {
      time,
      name,
      surname,
      idnum,
      snum,
      phonenum,
      g_area,
      g_hgrade,
      pexp,
      gender,
      town,
      guard_type,
    });

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

    // Commit the transaction
    await connection.commit();

    console.log("Guard CV upload successful, ID:", result.insertId);

    // Verify the insert by selecting the record
    const [verification] = await connection.execute(
      "SELECT * FROM guard_cv WHERE guardcv_id = ?",
      [result.insertId]
    );

    console.log("Verification query result:", verification);

    // Return success response
    return Response.json({
      success: true,
      message: "CV uploaded successfully",
      response: "1",
      id: result.insertId,
      verification:
        verification.length > 0
          ? "Record found in database"
          : "Record NOT found in database",
    });
  } catch (error) {
    console.error("Guard CV upload error:", error);

    // Rollback transaction on error
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError);
      }
    }

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
