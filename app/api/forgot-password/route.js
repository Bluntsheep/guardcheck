// pages/api/forgot-password.js or app/api/forgot-password/route.js (for App Router)

import mysql from "mysql2/promise";
import nodemailer from "nodemailer";
import crypto from "crypto";

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

    const { email } = await request.json();

    if (!email) {
      return Response.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email in the registration table
    const [users] = await connection.execute(
      "SELECT id, d_user, email FROM registration WHERE email = ?",
      [email.toLowerCase()]
    );

    if (users.length === 0) {
      // For security, return success even if user doesn't exist
      return Response.json({
        success: true,
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    }

    const user = users[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Check if reset_password_token and reset_password_expires columns exist
    // If not, you'll need to add them to your registration table:
    /*
    ALTER TABLE registration 
    ADD COLUMN reset_password_token VARCHAR(255) NULL,
    ADD COLUMN reset_password_expires DATETIME NULL;
    */

    // Save reset token to database
    await connection.execute(
      "UPDATE registration SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?",
      [resetToken, resetTokenExpiry, user.id]
    );

    // Create email transporter with error checking
    // if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    //   console.error("Email credentials not configured");
    //   return Response.json(
    //     {
    //       success: false,
    //       message:
    //         "Email service not configured. Please contact administrator.",
    //     },
    //     { status: 500 }
    //   );
    // }

    // Create email transporter (configure with your email service)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., 'smtp.yourdomain.com'
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Get base URL with multiple fallback options
    const getBaseUrl = (request) => {
      if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL;
      }

      // Try to get from request headers
      const host = request.headers.get("host");
      const protocol = request.headers.get("x-forwarded-proto") || "http";

      if (host) {
        return `${protocol}://${host}`;
      }

      // Fallback
      return "http://localhost:3000";
    };

    const baseUrl = getBaseUrl(request);
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    console.log("Base URL:", baseUrl);
    console.log("Reset URL:", resetUrl);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #167BA9;">Password Reset Request</h2>
          <p>Hello ${user.d_user},</p>
          <p>You requested a password reset for your account. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #167BA9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #167BA9;">${resetUrl}</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return Response.json({
      success: true,
      message: "Password reset instructions have been sent to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred. Please try again later.",
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
