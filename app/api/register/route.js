import { NextResponse } from "next/server";
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

export async function POST(request) {
  let connection;

  try {
    // Get connection from pool
    connection = await pool.getConnection();

    const body = await request.json();
    console.log("Received registration data:", body);

    // Validate required fields
    const requiredFields = [
      "companyName",
      "contactperson",
      "email",
      "apass",
      "cpass",
      "username",
    ];

    for (const field of requiredFields) {
      if (!body[field] || body[field].trim() === "") {
        return NextResponse.json(
          { error: `${field} is required and cannot be empty` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if passwords match
    if (body.apass !== body.cpass) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Check password strength
    if (body.apass.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const [existingUser] = await connection.execute(
      "SELECT id FROM registration WHERE email = ? OR d_user = ?",
      [body.email, body.username]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email or username already registered" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.apass, 12);

    // Insert new registration
    const [result] = await connection.execute(
      `INSERT INTO registration (
        reg_date, company_name, company_reg_no, contact_person, pobox, sira_sob_no,
        email, phone_no, cell_no, password, termandcondition, d_user,
        city, zipcode, role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        new Date().toISOString().slice(0, 19).replace("T", " "),
        body.companyName?.trim() || "",
        body.companyRegNo?.trim() || "",
        body.contactperson?.trim() || "",
        body.pobox?.trim() || "",
        body.sira_sob_number?.trim() || "",
        body.email?.trim() || "",
        body.phoneNumber?.trim() || "",
        body.cellNumber?.trim() || "",
        hashedPassword,
        "Yes I Agree",
        body.username?.trim() || "",
        body.contactcity?.trim() || "",
        body.zipcode?.trim() || "",
        "member",
      ]
    );

    console.log("Registration successful, ID:", result.insertId);

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle specific MySQL errors
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 400 }
      );
    }

    if (error.code === "PROTOCOL_CONNECTION_LOST") {
      return NextResponse.json(
        { error: "Database connection lost. Please try again." },
        { status: 500 }
      );
    }

    if (error.code === "ECONNREFUSED") {
      return NextResponse.json(
        { error: "Unable to connect to database. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Registration failed. Please try again.",
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
