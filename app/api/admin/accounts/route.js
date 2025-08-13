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

export async function GET() {
  let connection;

  try {
    // Get connection from pool
    connection = await pool.getConnection();

    // Fetch all accounts with relevant information
    const [accounts] = await connection.execute(`
      SELECT 
        id,
        company_name,
        d_user,
        contact_person,
        email,
        phone_no,
        cell_no,
        sira_sob_no,
        company_reg_no,
        city,
        zipcode,
        pobox,
        active,
        reg_date,
        first_reg_date,
        active_date
      FROM registration 
      ORDER BY reg_date DESC
    `);

    console.log(`Found ${accounts.length} accounts`);

    return NextResponse.json({
      success: true,
      data: accounts,
      total: accounts.length,
      message: "Accounts retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching accounts:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch accounts: " + error.message,
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

export async function PATCH(request) {
  let connection;

  try {
    // Parse the request body
    const body = await request.json();
    const { id, active } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Account ID is required",
        },
        { status: 400 }
      );
    }

    // Validate active status (should be 0 or 1)
    if (active !== 0 && active !== 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Active status must be 0 (inactive) or 1 (active)",
        },
        { status: 400 }
      );
    }

    // Get connection from pool
    connection = await pool.getConnection();

    // First, check if the account exists
    const [existingAccount] = await connection.execute(
      "SELECT id, company_name, d_user, active FROM registration WHERE id = ?",
      [id]
    );

    if (existingAccount.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Account not found",
        },
        { status: 404 }
      );
    }

    const account = existingAccount[0];

    // Check if the status is already the desired value
    if (account.active === active) {
      return NextResponse.json({
        success: true,
        message: `Account is already ${active === 0 ? "active" : "inactive"}`,
        data: {
          id: account.id,
          company_name: account.company_name,
          d_user: account.d_user,
          active: account.active,
        },
      });
    }

    // Update the active status and active_date to current timestamp
    const [result] = await connection.execute(
      "UPDATE registration SET active = ?, active_date = NOW() WHERE id = ?",
      [active, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update account status",
        },
        { status: 500 }
      );
    }

    console.log(
      `Account ID ${id} (${account.company_name}) status updated to ${
        active === 1 ? "active" : "inactive"
      }`
    );

    return NextResponse.json({
      success: true,
      message: `Account successfully ${
        active === 1 ? "activated" : "deactivated"
      }`,
      data: {
        id: parseInt(id),
        company_name: account.company_name,
        d_user: account.d_user,
        active: active,
        previousActive: account.active,
        updatedAt: new Date().toISOString(), // Optional: include timestamp in response
      },
    });
  } catch (error) {
    console.error("Error updating account status:", error);

    // Handle JSON parsing errors
    if (error.name === "SyntaxError") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update account status: " + error.message,
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

export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed",
    },
    { status: 405 }
  );
}
