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

export async function GET(request) {
  let connection;

  try {
    console.log("API called with URL:", request.url);

    connection = await pool.getConnection();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("reg_d_user");

    console.log("Parameter received:", userId);

    if (!userId) {
      console.log("No reg_d_user parameter provided");
      return Response.json(
        { error: "reg_d_user parameter is required" },
        { status: 400 }
      );
    }

    // Simple test query first
    console.log("Testing database connection...");
    const [testResult] = await connection.execute("SELECT 1 as test");
    console.log("Database connection OK:", testResult);

    // Check if user exists by ID
    console.log("Checking if user exists by ID...");
    const [userCheck] = await connection.execute(
      "SELECT id, d_user, company_name FROM registration WHERE id = ?",
      [userId]
    );
    console.log("User check result:", userCheck);

    if (userCheck.length === 0) {
      console.log("User not found");
      return Response.json({
        success: true,
        data: [],
        total: 0,
        message: `No user found with ID: ${userId}`,
        searchCriteria: {
          reg_d_user: userId,
        },
      });
    }

    // Check for blacklisted guards
    console.log("Checking for blacklisted guards...");
    const [guardCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM blacklistguard WHERE reg_user_id = ?",
      [userId]
    );
    console.log("Guard count:", guardCount);

    // Get the actual guards - search by user ID
    const query = `
      SELECT 
        bg.*,
        ru.company_name as reg_company_name,
        ru.phone_no as reg_phone_no,
        ru.d_user as reg_d_user
      FROM blacklistguard bg
      LEFT JOIN registration ru ON bg.reg_user_id = ru.id
      WHERE bg.reg_user_id = ?
      ORDER BY bg.id DESC
    `;

    console.log("Executing main query...");
    const [guards] = await connection.execute(query, [userId]);
    console.log("Guards found:", guards.length);

    // Debug: Log the first guard to see all available fields
    if (guards.length > 0) {
      console.log("First guard data:", guards[0]);
    }

    const formattedGuards = guards.map((guard) => ({
      id: guard.id,
      guardName: guard.name,
      surname: guard.surname,
      idNumber: guard.idnumber,
      gender: guard.gender,
      siraSobNo: guard.sira_sob_no,
      reason: guard.reason || "N/A",
      description: guard.description || "N/A",
      date: guard.date,
      regUserId: guard.reg_user_id,
      registeredBy: {
        companyName: guard.reg_company_name,
        phoneNo: guard.reg_phone_no,
        dUser: guard.reg_d_user,
      },
    }));

    return Response.json({
      success: true,
      data: formattedGuards,
      total: guards.length,
      searchCriteria: {
        reg_d_user: userId,
      },
    });
  } catch (error) {
    console.error("API Error:", error);

    return Response.json(
      {
        success: false,
        error: "API Error: " + error.message,
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
