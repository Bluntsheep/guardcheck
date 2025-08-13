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
  connectTimeout: 60000,
  idleTimeout: 300000,
  charset: "utf8mb4",
  timezone: "+00:00",
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

export async function DELETE(request) {
  let connection;
  try {
    connection = await pool.getConnection();

    // Extract the ID from the URL search parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { error: "CV ID is required for deletion." },
        { status: 400 }
      );
    }

    // SQL query to delete the row with the specified ID
    const query = "DELETE FROM guard_cv WHERE guardcv_id = ?";
    const queryParams = [id];

    console.log("Executing delete query for ID:", id);

    // Execute the delete query
    const [result] = await connection.execute(query, queryParams);

    if (result.affectedRows === 0) {
      // If no rows were affected, the CV with that ID was not found
      return Response.json({ error: "CV not found." }, { status: 404 });
    }

    return Response.json(
      { message: `CV with ID ${id} deleted successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting CV:", error);
    return Response.json(
      {
        error: "Failed to delete CV. Please try again.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
