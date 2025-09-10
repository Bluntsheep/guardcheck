import puppeteer from "puppeteer";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// Email transporter configuration (use your preferred email service)
const createTransporter = () => {
  return nodemailer.createTransporter({
    // Gmail configuration (you can change this to your preferred service)
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // your-email@gmail.com
      pass: process.env.EMAIL_PASSWORD, // app-specific password
    },
    // Alternative SMTP configuration
    /*
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    */
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

    // Determine the template URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const templateUrl =
      type === "quote"
        ? `${baseUrl}/templates/quote`
        : `${baseUrl}/templates/invoice`;

    // Navigate to the template page with data
    const urlWithData = `${templateUrl}?data=${encodeURIComponent(
      JSON.stringify(data)
    )}`;

    await page.goto(urlWithData, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Wait for any dynamic content to load
    await page.waitForTimeout(2000);

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
        name: "Guard Check",
        address: process.env.EMAIL_FROM || process.env.EMAIL_USER,
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
      },
      { status: 500 }
    );
  }
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
