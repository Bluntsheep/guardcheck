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

function getBaseUrl(request) {
  const headers = request.headers;
  const protocol = headers.get("x-forwarded-proto") || "http";
  const host = headers.get("x-forwarded-host") || headers.get("host");
  return `${protocol}://${host}`;
}

// Generate unique quote reference
const generateQuoteRef = () => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `GC-${year}${month}-${random}`;
};

// Create quote data from registration
const createQuoteData = (userData, quoteNumber) => {
  const quoteDate = new Date().toLocaleDateString("en-ZA");
  const validUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-ZA");

  return {
    quoteNumber,
    quoteDate,
    validUntil,
    status: "pending",
    company: {
      name: "GUARDCHECK.COM (Pty) Ltd",
      address: "Postnet Suite 103, Private bag X0003, Ifafi, 0260",
      city: "Cape Town, 8001",
      phone: "012-492-9089",
      email: "info@guardcheck.com",
      website: "www.guardcheck.com",
    },
    client: {
      name: userData.companyName,
      contactPerson: userData.contactperson,
      address: userData.pobox || "Not specified",
      city: userData.contactcity
        ? `${userData.contactcity}, ${userData.zipcode || ""}`.trim()
        : "Not specified",
      phone: userData.phoneNumber || userData.cellNumber || "Not provided",
      email: userData.email,
    },
    items: [
      {
        id: 1,
        description: "GUARDCHECK.COM - Yearly Subscription",
        coverage: "Annual Premium Access",
        premium: 2850.0,
        quantity: 1,
      },
    ],
    subtotal: 2850.0,
    vat: 0.0,
    total: 2850.0,
    banking: {
      bank: "Nedbank",
      accountNumber: "13118342535",
      accountType: "Current Account",
    },
  };
};

export async function POST(request) {
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

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
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: `${field.label} is required` },
          { status: 400 }
        );
      }
    }

    // Password validation
    if (apass !== cpass) {
      await connection.rollback();
      return NextResponse.json(
        { success: false, error: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (apass.length < 6) {
      await connection.rollback();
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
      await connection.rollback();
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
      await connection.rollback();
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(apass, 12);

    // Insert new user
    const [result] = await connection.execute(
      "INSERT INTO registration (company_name, company_reg_no, cell_no, pobox, sira_sob_no, email, phone_no, contact_person, password, city, zipcode, d_user, first_reg_date, reg_date, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 0)",
      [
        companyName,
        companyRegNo,
        cellNumber,
        pobox,
        sira_sob_number,
        email,
        phoneNumber,
        contactperson,
        hashedPassword,
        contactcity,
        zipcode,
        username,
      ]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return NextResponse.json(
        { success: false, error: "Registration failed" },
        { status: 500 }
      );
    }

    const userId = result.insertId;

    // Generate quote
    const quoteNumber = generateQuoteRef();
    const quoteDate = new Date();
    const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Insert quote record
    await connection.execute(
      "INSERT INTO quotes (quote_number, user_id, company_name, contact_person, email, phone_number, cell_number, address, city, postal_code, quote_date, valid_until, subtotal, vat, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        quoteNumber,
        userId,
        companyName,
        contactperson,
        email,
        phoneNumber,
        cellNumber,
        pobox,
        contactcity,
        zipcode,
        quoteDate,
        validUntil,
        2850.0,
        0.0,
        2850.0,
        "pending",
      ]
    );

    // Get the newly created user data
    const [newUser] = await connection.execute(
      "SELECT id, d_user, active FROM registration WHERE id = ?",
      [userId]
    );

    const userData = newUser[0];

    // Commit the transaction
    await connection.commit();

    // Prepare quote data for PDF generation
    const quoteData = createQuoteData(body, quoteNumber);

    // Send quote email (async, don't wait for it)
    try {
      const baseUrl = getBaseUrl(request);

      const emailResponse = await fetch(
        `${baseUrl}/api/generate-and-email-pdf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "quote",
            data: quoteData,
            emailTo: email,
            sendEmail: true,
            customMessage: `Dear ${contactperson},

Thank you for registering with GUARDCHECK.COM! We're excited to have you join our community.

Please find attached your personalized quote for GUARDCHECK.COM premium access. This comprehensive solution will provide you with advanced security verification and background checking capabilities.

Quote Details:
- Quote Number: ${quoteNumber}
- Valid Until: ${quoteData.validUntil}
- Total Amount: R${quoteData.total.toLocaleString("en-ZA", {
              minimumFractionDigits: 2,
            })}

Next Steps:
1. Review the attached quote
2. Make payment using the banking details provided
3. Your account will be activated once payment is confirmed
4. Start using GUARDCHECK.COM premium features immediately

If you have any questions about your quote or our services, please don't hesitate to contact us.

Welcome to Guard Check!

Best regards,
The Guard Check Team
Email: info@guardcheck.com
Phone: 012-492-9089`,
          }),
        }
      );

      if (!emailResponse.ok) {
        console.error(
          "Failed to send quote email:",
          await emailResponse.text()
        );
      } else {
        console.log("Quote email sent successfully");
      }
    } catch (emailError) {
      console.error("Error sending quote email:", emailError);
      // Don't fail the registration if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful! A quote has been sent to your email.",
      user: {
        id: userData.id,
        username: userData.d_user,
        active: userData.active,
      },
      quote: {
        number: quoteNumber,
        total: 2850.0,
        validUntil: quoteData.validUntil,
      },
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
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
