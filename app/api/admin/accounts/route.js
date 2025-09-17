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

function getBaseUrl(request) {
  const headers = request.headers;
  const protocol = headers.get("x-forwarded-proto") || "http";
  const host = headers.get("x-forwarded-host") || headers.get("host");
  return `${protocol}://${host}`;
}

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

// Check for active invoices within the last year
const checkActiveInvoice = async (connection, userEmail) => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const oneYearAgoFormatted = oneYearAgo.toISOString().split("T")[0]; // YYYY-MM-DD format

    const [invoices] = await connection.execute(
      `SELECT 
        invoice_number,
        invoice_date,
        status,
        total_amount
      FROM invoices 
      WHERE client_email = ? 
        AND invoice_date >= ? 
        AND status = 'paid'
      ORDER BY invoice_date DESC 
      LIMIT 1`,
      [userEmail, oneYearAgoFormatted]
    );

    return invoices.length > 0 ? invoices[0] : null;
  } catch (error) {
    console.error("Error checking active invoice:", error);
    throw error;
  }
};

// Send activation email without invoice
const sendActivationEmail = async (
  baseUrl,
  account,
  existingInvoice = null
) => {
  try {
    const validUntilDate = existingInvoice
      ? new Date(
          new Date(existingInvoice.invoice_date).setFullYear(
            new Date(existingInvoice.invoice_date).getFullYear() + 1
          )
        ).toLocaleDateString()
      : "";

    const emailResponse = await fetch(`${baseUrl}/api/generate-and-email-pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "simple-email", // This tells your endpoint it's just an email, no PDF
        emailTo: account.email,
        sendEmail: true,
        subject: "GUARDCHECK.COM Account Activated - Welcome Back!",
        customMessage: `Dear ${account.contact_person},

Great news! Your GUARDCHECK.COM account has been successfully activated!

Your premium access subscription is now active and you can start using all GUARDCHECK.COM features immediately.

Account Details:
- Company: ${account.company_name}
- Username: ${account.d_user}
- Activation Date: ${getSouthAfricaDateTime()}
- Subscription: Annual Premium Access
${
  existingInvoice
    ? `- Current Invoice: ${existingInvoice.invoice_number} (Valid until ${validUntilDate})`
    : ""
}

${
  existingInvoice
    ? "Your existing subscription is still valid, so no new invoice has been generated."
    : ""
}

Login to your account to start using GUARDCHECK.COM's premium security verification services.

If you have any questions or need assistance, please don't hesitate to contact our support team.

Welcome back to GUARDCHECK.COM Premium!

Best regards,
The GUARDCHECK.COM Team
Email: info@guardcheck.com
Phone: 012-492-9089`,
      }),
    });

    return emailResponse.ok;
  } catch (error) {
    console.error("Error sending activation email:", error);
    return false;
  }
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
      name: "GUARDCHECK.COM (Pty) Ltd",
      address: "Postnet Suite 103, Private bag X0003, Ifafi, 0260",
      city: "Cape Town, 8001",
      phone: "012-492-9089",
      email: "info@guardcheck.com",
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

// Save invoice to database
const saveInvoiceToDatabase = async (
  connection,
  invoiceData,
  registrationId
) => {
  try {
    // Convert date strings to MySQL date format
    const formatDateForMySQL = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // YYYY-MM-DD format
    };

    // Insert into invoices table
    const invoiceInsertQuery = `
      INSERT INTO invoices (
        invoice_number,
        registration_id,
        invoice_date,
        due_date,
        status,
        company_name,
        company_address,
        company_city,
        company_phone,
        company_email,
        company_website,
        client_name,
        client_contact_person,
        client_address,
        client_city,
        client_phone,
        client_email,
        subtotal,
        vat_amount,
        total_amount,
        amount_due,
        bank_name,
        account_number,
        account_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [invoiceResult] = await connection.execute(invoiceInsertQuery, [
      invoiceData.invoiceNumber,
      registrationId,
      formatDateForMySQL(invoiceData.invoiceDate),
      formatDateForMySQL(invoiceData.dueDate),
      invoiceData.status,
      invoiceData.company.name,
      invoiceData.company.address,
      invoiceData.company.city,
      invoiceData.company.phone,
      invoiceData.company.email,
      invoiceData.company.website,
      invoiceData.client.name,
      invoiceData.client.contactPerson,
      invoiceData.client.address,
      invoiceData.client.city,
      invoiceData.client.phone,
      invoiceData.client.email,
      invoiceData.subtotal,
      invoiceData.vat,
      invoiceData.total,
      invoiceData.amountDue,
      invoiceData.banking.bank,
      invoiceData.banking.accountNumber,
      invoiceData.banking.accountType,
    ]);

    const invoiceId = invoiceResult.insertId;

    // Insert invoice items
    const itemInsertQuery = `
      INSERT INTO invoice_items (
        invoice_id,
        item_number,
        description,
        coverage,
        premium,
        quantity
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const item of invoiceData.items) {
      await connection.execute(itemInsertQuery, [
        invoiceId,
        item.id,
        item.description,
        item.coverage,
        item.premium,
        item.quantity,
      ]);
    }

    console.log(
      `Invoice ${invoiceData.invoiceNumber} saved to database with ID: ${invoiceId}`
    );
    return invoiceId;
  } catch (error) {
    console.error("Error saving invoice to database:", error);
    throw error;
  }
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

    // Start transaction
    await connection.beginTransaction();

    // Get the full account details including email
    const [existingAccount] = await connection.execute(
      "SELECT * FROM registration WHERE id = ?",
      [id]
    );

    if (existingAccount.length === 0) {
      await connection.rollback();
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
      await connection.rollback();
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
      await connection.rollback();
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

    let invoiceId = null;
    let emailSent = false;
    let hasActiveInvoice = false;
    let existingInvoice = null;

    // If activating the account, check for existing invoices first
    if (active === 1) {
      try {
        // Check for active invoices within the last year
        existingInvoice = await checkActiveInvoice(connection, account.email);
        hasActiveInvoice = existingInvoice !== null;

        const baseUrl = getBaseUrl(request);

        if (hasActiveInvoice) {
          // User has an active invoice, just send activation email without generating new invoice
          console.log(
            `User ${account.email} has active invoice ${existingInvoice.invoice_number}, skipping invoice generation`
          );

          // Commit the transaction first
          await connection.commit();

          // Send simple activation email
          emailSent = await sendActivationEmail(
            baseUrl,
            account,
            existingInvoice
          );

          if (!emailSent) {
            console.error("Failed to send activation email");
          } else {
            console.log("Activation email sent successfully (no new invoice)");
          }
        } else {
          // No active invoice found, generate new invoice and send email with invoice
          console.log(
            `No active invoice found for ${account.email}, generating new invoice`
          );

          const invoiceNumber = generateInvoiceRef();
          const invoiceData = createInvoiceData(account, invoiceNumber);

          // Save invoice to database first
          invoiceId = await saveInvoiceToDatabase(connection, invoiceData, id);

          // Commit the transaction after successful invoice save
          await connection.commit();

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

Congratulations! Your GUARDCHECK.COM account has been successfully activated!

Your premium access subscription is now active and you can start using all GUARDCHECK.COM features immediately.

Account Details:
- Company: ${account.company_name}
- Username: ${account.d_user}
- Activation Date: ${getSouthAfricaDateTime()}
- Subscription: Annual Premium Access
- Invoice Number: ${invoiceNumber}

Please find attached your invoice for this subscription. Your account will remain active for 12 months from the activation date.

Login to your account to start using GUARDCHECK.COM's premium security verification services.

If you have any questions or need assistance, please don't hesitate to contact our support team.

Welcome to GUARDCHECK.COM Premium!

Best regards,
The GUARDCHECK.COM Team
Email: info@guardcheck.com
Phone: 012-492-9089`,
              }),
            }
          );

          emailSent = emailResponse.ok;

          if (!emailSent) {
            console.error(
              "Failed to send activation email with invoice:",
              await emailResponse.text()
            );
          } else {
            console.log("Activation email with invoice sent successfully");
          }
        }
      } catch (error) {
        await connection.rollback();
        console.error("Error in activation process:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to activate account: " + error.message,
          },
          { status: 500 }
        );
      }
    } else {
      // Just commit the deactivation
      await connection.commit();
    }

    return NextResponse.json({
      success: true,
      message: `Account successfully ${
        active === 1 ? "activated" : "deactivated"
      }${
        active === 1
          ? hasActiveInvoice
            ? ". Activation email sent (existing invoice still valid)."
            : ". Activation email sent and new invoice created."
          : ""
      }`,
      data: {
        id: parseInt(id),
        company_name: account.company_name,
        d_user: account.d_user,
        active: active,
        active_date: active === 1 ? getSouthAfricaDateTime() : null,
        previousActive: account.active,
        invoiceId: invoiceId,
        hasActiveInvoice: hasActiveInvoice,
        existingInvoiceNumber: existingInvoice?.invoice_number || null,
        emailSent: emailSent,
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
