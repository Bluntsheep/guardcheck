import puppeteer from "puppeteer";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// Email transporter configuration using your SMTP settings
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates if needed
    },
  });
};

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      type, // 'quote' or 'invoice'
      data, // quote/invoice data
      emailTo,
      emailCc = [],
      emailBcc = [],
      customMessage = "",
      sendEmail = true,
    } = body;

    // Validate required fields
    if (!type || !data) {
      return NextResponse.json(
        { error: "Missing required fields: type and data" },
        { status: 400 }
      );
    }

    if (sendEmail && !emailTo) {
      return NextResponse.json(
        { error: "emailTo is required when sendEmail is true" },
        { status: 400 }
      );
    }

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({ width: 1200, height: 1600 });

    // Create the HTML content directly with the quote template
    const htmlContent = generateQuoteHTML(data);

    // Set the HTML content
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // FIXED: Replace page.waitForTimeout with Promise-based timeout
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
      preferCSSPageSize: true,
    });

    await browser.close();

    // If email is not required, return the PDF
    if (!sendEmail) {
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${type}-${
            data[type === "quote" ? "quoteNumber" : "invoiceNumber"]
          }.pdf"`,
        },
      });
    }

    // Send email with PDF attachment
    const transporter = createTransporter();

    const documentType = type === "quote" ? "Quote" : "Invoice";
    const documentNumber =
      data[type === "quote" ? "quoteNumber" : "invoiceNumber"];
    const clientName = data.client?.name || "Valued Client";

    // Email content
    const subject = `Guard Check ${documentType} #${documentNumber}`;

    const defaultMessage =
      type === "quote"
        ? `Dear ${clientName},

Please find attached your premium access quote from Guard Check.

Quote Details:
- Quote Number: ${documentNumber}
- Valid Until: ${data.validUntil}
- Total Amount: R${data.total?.toLocaleString("en-ZA", {
            minimumFractionDigits: 2,
          })}

This quote is valid for 30 days. Please contact us if you have any questions or would like to proceed with your premium access subscription.

Best regards,
Guard Check Team`
        : `Dear ${clientName},

Please find attached your invoice from Guard Check.

Invoice Details:
- Invoice Number: ${documentNumber}
- Invoice Date: ${data.invoiceDate}
- Due Date: ${data.dueDate}
- Amount Due: R${data.amountDue?.toLocaleString("en-ZA", {
            minimumFractionDigits: 2,
          })}

Payment can be made via bank transfer using the details provided in the invoice.

Best regards,
Guard Check Accounts Team`;

    const emailContent = customMessage || defaultMessage;

    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || "Guard Check",
        address: process.env.EMAIL_USER,
      },
      to: emailTo,
      cc: emailCc.length > 0 ? emailCc : undefined,
      bcc: emailBcc.length > 0 ? emailBcc : undefined,
      subject: subject,
      text: emailContent,
      html: emailContent.replace(/\n/g, "<br>"),
      attachments: [
        {
          filename: `${type}-${documentNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "PDF generated and email sent successfully",
      emailInfo: {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
      },
      documentInfo: {
        type,
        documentNumber,
        recipient: emailTo,
      },
    });
  } catch (error) {
    console.error("Error generating PDF or sending email:", error);

    return NextResponse.json(
      {
        error: "Failed to generate PDF or send email",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// Generate HTML content for the quote
function generateQuoteHTML(data) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guard Check Quote</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            background-color: white;
            color: #333;
            line-height: 1.3;
        }
        
        .container {
            width: 210mm;
            min-height: 297mm;
            padding: 5mm;
            margin: 0 auto;
            background: white;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 4px solid #1e40af;
        }
        
        .company-logo h1 {
            color: #1e40af;
            font-size: 32px;
            font-weight: bold;
        }
        
        .quote-info h2 {
            color: #1e40af;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .quote-info p {
            font-size: 12px;
            color: #666;
            margin: 2px 0;
        }
        
        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
        }
        
        .info-box {
            width: 45%;
        }
        
        .info-box h3 {
            font-size: 16px;
            color: #374151;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .info-box p {
            font-size: 12px;
            color: #666;
            margin: 2px 0;
        }
        
        .info-box .highlight {
            color: #1f2937;
            font-weight: 600;
        }
        
        .items-section {
            margin-bottom: 15px;
        }
        
        .items-section h3 {
            font-size: 16px;
            color: #374151;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .items-table th {
            background-color: #1e40af;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: bold;
        }
        
        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 12px;
        }
        
        .items-table tr:hover {
            background-color: #f9fafb;
        }
        
        .text-right {
            text-align: right;
        }
        
        .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 15px;
        }
        
        .totals-table {
            width: 320px;
            border-collapse: collapse;
        }
        
        .totals-table .total-row {
            background-color: #1e40af;
            color: white;
        }
        
        .totals-table td {
            padding: 12px;
            font-size: 16px;
            font-weight: bold;
        }
        
        .banking-section {
            margin-bottom: 15px;
        }
        
        .banking-section h3 {
            font-size: 16px;
            color: #374151;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .banking-details {
            background-color: #dbeafe;
            border: 1px solid #93c5fd;
            border-radius: 8px;
            padding: 15px;
        }
        
        .banking-details p {
            font-size: 12px;
            color: #1f2937;
            margin: 8px 0;
        }
        
        .banking-details .label {
            font-weight: 600;
        }
        
        .notice-section {
            margin-bottom: 15px;
        }
        
        .notice-box {
            background-color: #dcfce7;
            border: 1px solid #86efac;
            border-radius: 8px;
            padding: 15px;
        }
        
        .notice-box h3 {
            color: #166534;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .notice-box p {
            color: #166534;
            font-size: 12px;
        }
        
        .terms-section {
            margin-bottom: 15px;
        }
        
        .terms-section h3 {
            font-size: 16px;
            color: #374151;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .terms-section p {
            font-size: 12px;
            color: #666;
            margin: 8px 0;
        }
        
        .footer {
            border-top: 1px solid #d1d5db;
            padding-top: 20px;
            text-align: center;
        }
        
        .footer p {
            font-size: 10px;
            color: #9ca3af;
            margin: 2px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="company-logo">
                <h1>GUARD CHECK</h1>
            </div>
            <div class="quote-info">
                <h2>QUOTATION</h2>
                <p><span class="label">Quote #:</span> ${data.quoteNumber}</p>
                <p><span class="label">Date:</span> ${data.quoteDate}</p>
            </div>
        </div>

        <!-- Company and Client Information -->
        <div class="info-section">
            <div class="info-box">
                <h3>From:</h3>
                <p class="highlight">${data.company.name}</p>
                <p>${data.company.address}</p>
                <p>${data.company.city}</p>
                <p>Phone: ${data.company.phone}</p>
                <p>Email: ${data.company.email}</p>
                <p>Web: ${data.company.website}</p>
            </div>

            <div class="info-box">
                <h3>To:</h3>
                <p class="highlight">${data.client.name}</p>
                <p>Attn: ${data.client.contactPerson}</p>
                <p>${data.client.address}</p>
                <p>${data.client.city}</p>
                <p>Phone: ${data.client.phone}</p>
                <p>Email: ${data.client.email}</p>
            </div>
        </div>

        <!-- Items Table -->
        <div class="items-section">
            <h3>Subscription Details</h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Coverage Period</th>
                        <th class="text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.items
                      .map(
                        (item) => `
                    <tr>
                        <td>${item.description}</td>
                        <td>${item.coverage}</td>
                        <td class="text-right">R${item.premium.toLocaleString(
                          "en-ZA",
                          { minimumFractionDigits: 2 }
                        )}</td>
                    </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
        </div>

        <!-- Totals -->
        <div class="totals-section">
            <table class="totals-table">
                <tr class="total-row">
                    <td class="text-right">Total Amount:</td>
                    <td class="text-right">R${data.total.toLocaleString(
                      "en-ZA",
                      { minimumFractionDigits: 2 }
                    )}</td>
                </tr>
            </table>
        </div>

        <!-- Banking Details -->
        <div class="banking-section">
            <h3>Banking Details</h3>
            <div class="banking-details">
                <p><span class="label">Bank:</span> ${data.banking.bank}</p>
                <p><span class="label">Account Number:</span> ${
                  data.banking.accountNumber
                }</p>
                <p><span class="label">Account Type:</span> ${
                  data.banking.accountType
                }</p>
                <p><span class="label">Reference:</span> ${data.quoteNumber}</p>
            </div>
        </div>

        <!-- Payment Notice -->
        <div class="notice-section">
            <div class="notice-box">
                <h3>Payment Instructions</h3>
                <p>Payment can be made via EFT into our bank account. Once the funds have cleared, your account will be activated.</p>
            </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="terms-section">
            <h4>Terms and Conditions</h4>
            <p>• Subscription access begins immediately upon payment confirmation.</p>
            <p>• Annual subscription is payable in advance.</p>
            <p>• Refunds are subject to our terms of service and cancellation policy.</p>
            <p>• Features and pricing may be updated with 30 days notice.</p>
        </div>
    </div>
</body>
</html>`;
}

// Optional: Add a GET method to test the API
export async function GET() {
  return NextResponse.json({
    message: "PDF Generation and Email API",
    usage: {
      method: "POST",
      requiredFields: ["type", "data"],
      optionalFields: [
        "emailTo",
        "emailCc",
        "emailBcc",
        "customMessage",
        "sendEmail",
      ],
      types: ["quote", "invoice"],
    },
  });
}
