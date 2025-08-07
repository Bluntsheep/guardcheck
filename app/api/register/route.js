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
  idleTimeout: 300000,
  charset: "utf8mb4",
  timezone: "+00:00",
});

export async function POST(request) {
  let connection;

  try {
    connection = await pool.getConnection();

    const body = await request.json();
    console.log("Registration request body:", body);

    const {
      companyName,
      contactperson,
      contactcity,
      sira_sob_number,
      phoneNumber,
      username,
      cpass,
      companyRegNo,
      pobox,
      zipcode,
      email,
      cellNumber,
      apass,
    } = body;

    // Basic validations
    const requiredFields = [
      { key: "companyName", value: companyName, label: "Company Name" },
      { key: "contactperson", value: contactperson, label: "Contact Person" },
      { key: "email", value: email, label: "Email" },
      { key: "username", value: username, label: "Username" },
      { key: "apass", value: apass, label: "Password" },
      { key: "cpass", value: cpass, label: "Confirm Password" },
    ];

    for (const field of requiredFields) {
      if (!field.value || field.value.trim() === "") {
        return NextResponse.json(
          { success: false, error: `${field.label} is required` },
          { status: 400 }
        );
      }
    }

    // Password validation
    if (apass !== cpass) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (apass.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const [existingUser] = await connection.execute(
      "SELECT id FROM registration WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(apass, 12);

    // Insert new user with correct column names from your database
    const [result] = await connection.execute(
      "INSERT INTO registration (company_name, company_reg_no, cell_no, pobox, sira_sob_no, email, phone_no, contact_person, password, city, zipcode, d_user, first_reg_date, reg_date, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)",
      [
        companyName, // company_name
        companyRegNo, // company_reg_no
        cellNumber, // cell_no
        pobox, // pobox
        sira_sob_number, // sira_sob_no
        email, // email
        phoneNumber, // phone_no
        contactperson, // contact_person
        hashedPassword, // password
        contactcity, // city
        zipcode, // zipcode
        username, // d_user (username field)
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Registration failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: {
        id: result.id,
        username: user.d_user,
        active: user.active,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Registration failed",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
        sqlMessage: error.sqlMessage || undefined,
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
