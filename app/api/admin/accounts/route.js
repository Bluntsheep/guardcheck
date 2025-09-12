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

// Helper function to get South African datetime in required format
const getSouthAfricaDateTime = () => {
  const now = new Date();
  const saTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Africa/Johannesburg" })
  );
  return saTime.toISOString().slice(0, 19).replace("T", " "); // Format: YYYY-MM-DD HH:mm:ss
};

// Generate unique invoice reference
const generateInvoiceRef = () => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `INV-${year}${month}-${random}`;
};

// Create invoice data from user registration data
const createInvoiceData = (userData, invoiceNumber) => {
  const invoiceDate = new Date().toLocaleDateString("en-ZA");
  const dueDate = invoiceDate; // Due immediately since they've already paid

  return {
    invoiceNumber,
    invoiceDate,
    dueDate,
    status: "paid",
    company: {
      name: "Guard Check (Pty) Ltd",
      address: "123 Business Street",
      city: "Cape Town, 8001",
      phone: "+27 21 123 4567",
      email: "accounts@guardcheck.com",
      website: "www.guardcheck.com",
    },
    client: {
      name: userData.company_name,
      contactPerson: userData.contact_person,
      address: userData.pobox || "Not specified",
      city: userData.city
        ? `${userData.city}, ${userData.zipcode || ""}`.trim()
        : "Not specified",
      phone: userData.phone_no || userData.cell_no || "Not provided",
      email: userData.email,
    },
    items: [
      {
        id: 1,
        description: "GuardCheck - Yearly Subscription",
        coverage: "Annual Premium Access - Activated",
        premium: 2850.0,
        quantity: 1,
      },
    ],
    subtotal: 2850.0,
    vat: 0.0,
    total: 2850.0,
    amountDue: 0.0, // Already paid
    banking: {
      bank: "Nedbank",
      accountNumber: "13118342535",
      accountType: "Current Account",
    },
  };
};

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

    // Get the full account details including email
    const [existingAccount] = await connection.execute(
      "SELECT * FROM registration WHERE id = ?",
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
        message: `Account is already ${active === 1 ? "active" : "inactive"}`,
        data: {
          id: account.id,
          company_name: account.company_name,
          d_user: account.d_user,
          active: account.active,
        },
      });
    }

    // Update the active status
    // If setting to active (1), set active_date to current timestamp in South Africa timezone
    // If setting to inactive (0), set active_date to NULL
    const [result] = await connection.execute(
      "UPDATE registration SET active = ?, active_date = ? WHERE id = ?",
      [active, active === 1 ? getSouthAfricaDateTime() : null, id]
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

    // If activating the account, send activation email with invoice
    if (active === 1) {
      try {
        const invoiceNumber = generateInvoiceRef();
        const invoiceData = createInvoiceData(account, invoiceNumber);

        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        // Send activation email with invoice
        const emailResponse = await fetch(
          `${baseUrl}/api/generate-and-email-pdf`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              type: "invoice",
              data: invoiceData,
              emailTo: account.email,
              sendEmail: true,
              customMessage: `Dear ${account.contact_person},

Congratulations! Your Guard Check account has been successfully activated!

Your premium access subscription is now active and you can start using all Guard Check features immediately.

Account Details:
- Company: ${account.company_name}
- Username: ${account.d_user}
- Activation Date: ${getSouthAfricaDateTime()}
- Subscription: Annual Premium Access

Please find attached your invoice for this subscription. Your account will remain active for 12 months from the activation date.

Login to your account to start using Guard Check's premium security verification services.

If you have any questions or need assistance, please don't hesitate to contact our support team.

Welcome to Guard Check Premium!

Best regards,
The Guard Check Team
Email: info@guardcheck.com
Phone: 012-492-9089`,
            }),
          }
        );

        if (!emailResponse.ok) {
          console.error(
            "Failed to send activation email:",
            await emailResponse.text()
          );
        } else {
          console.log("Activation email with invoice sent successfully");
        }
      } catch (emailError) {
        console.error("Error sending activation email:", emailError);
        // Don't fail the activation if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Account successfully ${
        active === 1 ? "activated" : "deactivated"
      }${active === 1 ? ". Activation email sent." : ""}`,
      data: {
        id: parseInt(id),
        company_name: account.company_name,
        d_user: account.d_user,
        active: active,
        active_date: active === 1 ? getSouthAfricaDateTime() : null,
        previousActive: account.active,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
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
