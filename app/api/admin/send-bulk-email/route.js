// pages/api/admin/send-bulk-email.js
// or app/api/admin/send-bulk-email/route.js (for App Router)

import nodemailer from "nodemailer";

// Option 2: Using Nodemailer with SMTP (for custom email servers)
const createSMTPTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST, // e.g., 'smtp.yourdomain.com'
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Main API handler

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Recipients array is required and cannot be empty",
      });
    }

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        error: "Subject is required",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    // Validate recipient format
    for (const recipient of recipients) {
      if (!recipient.email || !recipient.name) {
        return res.status(400).json({
          success: false,
          error: "Each recipient must have email and name fields",
        });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recipient.email)) {
        return res.status(400).json({
          success: false,
          error: `Invalid email address: ${recipient.email}`,
        });
      }
    }

    const transporter = createSMTPTransporter();

    const emailPromises = recipients.map(async (recipient) => {
      const mailOptions = {
        from: `"${process.env.FROM_NAME || "Admin"}" <${
          process.env.EMAIL_USER
        }>`,
        to: recipient.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin: 0;">Hello ${recipient.name},</h2>
              <p style="color: #666; margin: 5px 0 0 0;">From ${
                recipient.company || "your company"
              }</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
              <div style="white-space: pre-line; line-height: 1.6; color: #333;">
                ${message}
              </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
              <p style="color: #666; font-size: 12px; margin: 0;">
                This email was sent to ${recipient.company} (${recipient.email})
              </p>
              <p style="color: #666; font-size: 12px; margin: 5px 0 0 0;">
                If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        `,
        text: `Hello ${recipient.name},\n\n${message}\n\n---\nThis email was sent to ${recipient.company} (${recipient.email})`,
      };

      return transporter.sendMail(mailOptions);
    });

    // Send all emails
    const results = await Promise.allSettled(emailPromises);

    // Check results
    const successful = results.filter(
      (result) => result.status === "fulfilled"
    ).length;
    const failed = results.filter((result) => result.status === "rejected");

    if (failed.length > 0) {
      console.error(
        "Failed emails:",
        failed.map((f) => f.reason)
      );

      // If some emails failed but some succeeded
      if (successful > 0) {
        return res.status(207).json({
          success: true,
          message: `${successful} emails sent successfully, ${failed.length} failed`,
          details: {
            successful,
            failed: failed.length,
            errors: failed.map((f) => f.reason?.message || "Unknown error"),
          },
        });
      } else {
        // All emails failed
        return res.status(500).json({
          success: false,
          error: "Failed to send all emails",
          details: failed.map((f) => f.reason?.message || "Unknown error"),
        });
      }
    }
    return Response.json({
      success: true,
      message: "Emails sent successfully!",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
