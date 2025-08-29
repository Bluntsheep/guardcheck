// pages/api/forgot-username.js or app/api/forgot-username/route.js (for App Router)

import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

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
      "SELECT id, username, email FROM registration WHERE email = ?",
      [email.toLowerCase()]
    );

    if (users.length === 0) {
      // For security, return success even if user doesn't exist
      return Response.json({
        success: true,
        message:
          "If an account with that email exists, the username has been sent.",
      });
    }

    const user = users[0];

    // Create email transporter (configure with your email service)
    const transporter = nodemailer.createTransporter({
      service: "gmail", // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Username Recovery",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #167BA9;">Username Recovery</h2>
          <p>Hello,</p>
          <p>You requested your username recovery. Here are the details for your account:</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #167BA9;">
            <h3 style="margin: 0; color: #167BA9;">Your Username:</h3>
            <p style="font-size: 18px; font-weight: bold; margin: 10px 0; color: #333;">${user.username}</p>
          </div>
          <p>You can now use this username to log into your account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/login" style="background-color: #167BA9; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Login</a>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">If you didn't request this username recovery, please contact support immediately for security reasons.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return Response.json({
      success: true,
      message: "Your username has been sent to your email address",
    });
  } catch (error) {
    console.error("Forgot username error:", error);
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
