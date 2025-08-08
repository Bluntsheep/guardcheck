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

export async function DELETE(request) {
  let connection;

  try {
    // Parse the request body
    const { id, idNumber, siraSobNo } = await request.json();

    // Validate required fields
    if (!idNumber && !siraSobNo && !id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "At least one identifier (id, idNumber, or sira_sob_No) is required",
        },
        { status: 400 }
      );
    }

    // Get connection from pool
    connection = await pool.getConnection();

    // Build the DELETE query with multiple possible identifiers
    let query = "DELETE FROM blacklistguard WHERE ";
    const conditions = [];
    const params = [];

    if (id) {
      conditions.push("id = ?");
      params.push(id);
    }

    if (idNumber) {
      conditions.push("idNumber = ?");
      params.push(idNumber);
    }

    if (siraSobNo) {
      conditions.push("sira_sob_No = ?");
      params.push(siraSobNo);
    }

    // Join conditions with OR to match any of the provided identifiers
    query += conditions.join(" OR ");

    console.log("Executing delete query:", query);
    console.log("With parameters:", params);

    // Execute the DELETE query
    const [result] = await connection.execute(query, params);

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No matching record found to delete",
        },
        { status: 404 }
      );
    }

    console.log(`Successfully deleted ${result.affectedRows} record(s)`);

    return NextResponse.json({
      success: true,
      message: `Successfully removed ${result.affectedRows} guard(s) from blacklist`,
      deletedCount: result.affectedRows,
    });
  } catch (error) {
    console.error("Error deleting guard from blacklist:", error);

    // Handle specific MySQL errors
    if (error.code === "ER_NO_SUCH_TABLE") {
      return NextResponse.json(
        {
          success: false,
          error: "Blacklist table not found in database",
        },
        { status: 500 }
      );
    }

    if (error.code === "ER_BAD_FIELD_ERROR") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid field name in query",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete guard from blacklist: " + error.message,
      },
      { status: 500 }
    );
  } finally {
    // Always release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed",
    },
    { status: 405 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed",
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed",
    },
    { status: 405 }
  );
}
