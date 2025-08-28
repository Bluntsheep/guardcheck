// app/api/profile/[userId]/route.js
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
      password, // Added password field
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

    // Validate password if provided
    if (password !== undefined && password.length > 0 && password.length < 6) {
      return Response.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
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

    // Handle password update if provided
    if (password !== undefined && password.length > 0) {
      // Hash the password using bcrypt with 10 salt rounds (same as your existing implementation)
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      updateFields.push("password = ?");
      updateValues.push(hashedPassword);
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
    console.log(
      "With parameters:",
      updateValues.map((val, index) =>
        updateFields[index]?.includes("password") ? "[HIDDEN]" : val
      )
    );

    const [result] = await connection.execute(updateQuery, updateValues);

    if (result.affectedRows === 0) {
      return Response.json(
        { success: false, message: "No changes were made" },
        { status: 400 }
      );
    }

    // Fetch updated user data (excluding password)
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
      message:
        password !== undefined && password.length > 0
          ? "Profile and password updated successfully"
          : "Profile updated successfully",
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

// DELETE - Delete user profile
export async function DELETE(request) {
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

    // Validate that userId is a number
    const numericUserId = parseInt(userId);
    if (isNaN(numericUserId)) {
      return Response.json(
        { success: false, message: "Invalid User ID format" },
        { status: 400 }
      );
    }

    // Check if user exists before deletion
    const checkUserQuery = `
      SELECT id, company_name, d_user, active 
      FROM registration 
      WHERE id = ?
    `;
    const [existingUser] = await connection.execute(checkUserQuery, [userId]);

    if (existingUser.length === 0) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const userToDelete = existingUser[0];

    // Start transaction for safe deletion
    await connection.beginTransaction();

    try {
      // If you have related tables that reference this user, delete from them first
      // Example: Delete user sessions, logs, or other related data

      // Delete related data (uncomment and modify as needed based on your database schema)
      /*
      // Delete user sessions if you have a sessions table
      await connection.execute(
        "DELETE FROM user_sessions WHERE user_id = ?",
        [userId]
      );

      // Delete user logs if you have a logs table
      await connection.execute(
        "DELETE FROM user_logs WHERE user_id = ?",
        [userId]
      );

      // Delete any other related records
      // await connection.execute("DELETE FROM other_table WHERE user_id = ?", [userId]);
      */

      // Delete the main user record
      const deleteUserQuery = "DELETE FROM registration WHERE id = ?";
      const [deleteResult] = await connection.execute(deleteUserQuery, [
        userId,
      ]);

      if (deleteResult.affectedRows === 0) {
        await connection.rollback();
        return Response.json(
          { success: false, message: "Failed to delete user profile" },
          { status: 500 }
        );
      }

      // Commit the transaction
      await connection.commit();

      console.log(
        `User profile deleted successfully: ID ${userId}, Company: ${userToDelete.company_name}, Username: ${userToDelete.d_user}`
      );

      return Response.json({
        success: true,
        message: `Profile for ${userToDelete.company_name} (${userToDelete.d_user}) has been deleted successfully`,
        deletedUser: {
          id: userToDelete.id,
          companyName: userToDelete.company_name,
          username: userToDelete.d_user,
        },
      });
    } catch (transactionError) {
      // Rollback transaction on error
      await connection.rollback();
      throw transactionError;
    }
  } catch (error) {
    console.error("Error deleting profile:", error);

    // Handle specific database errors
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return Response.json(
        {
          success: false,
          message:
            "Cannot delete user profile. This user has associated records that must be removed first.",
        },
        { status: 409 }
      );
    }

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
        message: "Failed to delete profile. Please try again.",
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
