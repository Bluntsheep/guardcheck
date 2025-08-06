// app/api/profile/[userId]/route.js
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

// GET - Retrieve user profile data
export async function GET(request) {
  let connection;

  try {
    connection = await pool.getConnection();

    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const query = `
      SELECT 
        id, company_name, company_reg_no, contact_person, pobox, sira_sob_no,
        email, phone_no, cell_no, d_user, city, zipcode, reg_date, active
      FROM registration 
      WHERE id = ?
    `;

    const [rows] = await connection.execute(query, [userId]);

    if (rows.length === 0) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const user = rows[0];

    return Response.json({
      success: true,
      message: "Profile data retrieved successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
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

// PUT - Update user profile data
export async function PUT(request) {
  let connection;

  try {
    connection = await pool.getConnection();

    // Get userId from query string
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return Response.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      companyName,
      contactPerson,
      siraSobNumber,
      phoneNumber,
      username,
      companyRegNumber,
      poBox,
      postalCode,
      cellNumber,
    } = body;

    // Check if user exists
    const checkQuery = "SELECT id FROM registration WHERE id = ?";
    const [existingUser] = await connection.execute(checkQuery, [userId]);

    if (existingUser.length === 0) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if username is already taken by another user (if username is being updated)
    if (username) {
      const usernameCheckQuery =
        "SELECT id FROM registration WHERE d_user = ? AND id != ?";
      const [usernameCheck] = await connection.execute(usernameCheckQuery, [
        username,
        userId,
      ]);

      if (usernameCheck.length > 0) {
        return Response.json(
          { success: false, message: "Username is already taken" },
          { status: 409 }
        );
      }
    }

    // Build dynamic update query for only changed fields
    let updateFields = [];
    let updateValues = [];

    if (companyName !== undefined) {
      updateFields.push("company_name = ?");
      updateValues.push(companyName.trim() || null);
    }
    if (contactPerson !== undefined) {
      updateFields.push("contact_person = ?");
      updateValues.push(contactPerson.trim() || null);
    }
    if (siraSobNumber !== undefined) {
      updateFields.push("sira_sob_no = ?");
      updateValues.push(siraSobNumber.trim() || null);
    }
    if (phoneNumber !== undefined) {
      updateFields.push("phone_no = ?");
      updateValues.push(phoneNumber.trim() || null);
    }
    if (username !== undefined) {
      updateFields.push("d_user = ?");
      updateValues.push(username.trim() || null);
    }
    if (companyRegNumber !== undefined) {
      updateFields.push("company_reg_no = ?");
      updateValues.push(companyRegNumber.trim() || null);
    }
    if (poBox !== undefined) {
      updateFields.push("pobox = ?");
      updateValues.push(poBox.trim() || null);
    }
    if (postalCode !== undefined) {
      updateFields.push("zipcode = ?");
      updateValues.push(postalCode.trim() || null);
    }
    if (cellNumber !== undefined) {
      updateFields.push("cell_no = ?");
      updateValues.push(cellNumber.trim() || null);
    }

    if (updateFields.length === 0) {
      return Response.json(
        { success: false, message: "No fields to update" },
        { status: 400 }
      );
    }

    // Add userId to the end of values array
    updateValues.push(userId);

    const updateQuery = `
      UPDATE registration 
      SET ${updateFields.join(", ")} 
      WHERE id = ?
    `;

    console.log("Executing update query:", updateQuery);
    console.log("With parameters:", updateValues);

    const [result] = await connection.execute(updateQuery, updateValues);

    if (result.affectedRows === 0) {
      return Response.json(
        { success: false, message: "No changes were made" },
        { status: 400 }
      );
    }

    // Fetch updated user data
    const fetchUpdatedQuery = `
      SELECT 
        id, company_name, company_reg_no, contact_person, pobox, sira_sob_no,
        email, phone_no, cell_no, d_user, city, zipcode, reg_date, active
      FROM registration 
      WHERE id = ?
    `;
    const [updatedUser] = await connection.execute(fetchUpdatedQuery, [userId]);

    return Response.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser[0],
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    if (error.code === "PROTOCOL_CONNECTION_LOST") {
      return Response.json(
        {
          success: false,
          message: "Database connection lost. Please try again.",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "Failed to update profile. Please try again.",
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
