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
    connection = await pool.getConnection();

    const { searchParams } = new URL(request.url);
    const idnumber = searchParams.get("idnum");
    const sira_sob_no = searchParams.get("snum");

    if (!idnumber && !sira_sob_no) {
      return Response.json(
        {
          error:
            "At least one search parameter (idnumber or sira_sob_no) is required",
        },
        { status: 400 }
      );
    }

    let query = "SELECT * FROM blacklistguard  WHERE ";
    let queryParams = [];
    let conditions = [];

    if (idnumber) {
      conditions.push("idnumber = ?");
      queryParams.push(idnumber);
    }

    if (sira_sob_no) {
      conditions.push("sira_sob_no = ?");
      queryParams.push(sira_sob_no);
    }

    query += conditions.join(" OR ");

    console.log("Executing query:", query);
    console.log("With parameters:", queryParams);

    const [guards] = await connection.execute(query, queryParams);

    const formattedGuards = guards.map((guard) => ({
      id: guard.id,
      companyName: guard.company_name || "N/A",
      contactPerson: guard.contact_person || "N/A",
      phoneNumber: guard.phonenum,
      guardName: guard.name,
      surname: guard.surname,
      gender: guard.gender,
      idNumber: guard.idnumber,
      siraSobNo: guard.sira_sob_no,
      date: guard.date,
      reason: guard.reason || "N/A",
      description: guard.description || "N/A",
      other: guard.other_info || guard.notes || "N/A",
      // Keep original fields for backwards compatibility
      name: guard.name,
      phone: guard.phonenum,
      grade: guard.hgrade,
      guardType: guard.guard_type,
      area: guard.area,
      town: guard.town,
      experience: guard.pexp,
      siraNumber: guard.sira_sob_no,
      uploadDate:
        guard.extra && !isNaN(guard.extra) && guard.extra > 0
          ? new Date(guard.extra * 1000).toISOString()
          : null,
    }));

    return Response.json({
      success: true,
      data: formattedGuards,
      total: guards.length,
      searchCriteria: {
        idnumber: idnumber || null,
        sira_sob_no: sira_sob_no || null,
      },
    });
  } catch (error) {
    console.error("Error searching guards:", error);

    if (error.code === "PROTOCOL_CONNECTION_LOST") {
      return Response.json(
        { error: "Database connection lost. Please try again." },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: false,
        error: "Failed to search guards. Please try again.",
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

export async function POST(request) {
  let connection;

  try {
    connection = await pool.getConnection();

    const body = await request.json();

    const {
      name,
      surname,
      gender,
      idnumber,
      sira_sob_no,
      date,
      reason,
      description,
      acceptance_letter,
      file,
      reg_user_id,
      read_l_report,
      other,
    } = body;

    const requiredFields = ["name", "surname", "idnumber"];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return Response.json(
        {
          error: `Missing required fields: ${missingFields.join(", ")}`,
          success: false,
        },
        { status: 400 }
      );
    }

    let checkQuery = "SELECT id FROM blacklistguard WHERE idnumber = ?";
    let checkParams = [idnumber];

    if (sira_sob_no) {
      checkQuery += " OR sira_sob_no = ?";
      checkParams.push(sira_sob_no);
    }

    const [existingGuards] = await connection.execute(checkQuery, checkParams);

    if (existingGuards.length > 0) {
      return Response.json(
        {
          error:
            "A guard with this ID number or SIRA/SOB number already exists in the blacklist",
          success: false,
        },
        { status: 409 }
      );
    }

    const insertQuery = `
      INSERT INTO blacklistguard 
      (name, surname, gender, idnumber, sira_sob_no, date, reason, description, acceptance_letter, file, reg_user_id, read_l_report, other) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertParams = [
      name,
      surname || null,
      gender || null,
      idnumber,
      sira_sob_no || null,
      date || new Date().toISOString().split("T")[0],
      reason || null,
      description || null,
      acceptance_letter || null,
      file || null,
      reg_user_id || null,
      read_l_report || null,
      other || null,
    ];

    console.log("Executing insert query:", insertQuery);
    console.log("With parameters:", insertParams);

    const [result] = await connection.execute(insertQuery, insertParams);

    return Response.json({
      success: true,
      message: "Guard successfully added to blacklist",
      data: {
        id: result.insertId,
        name,
        surname,
        gender,
        idnumber,
        sira_sob_no,
        date: date || new Date().toISOString().split("T")[0],
        reason,
        description,
        acceptance_letter,
        file,
        reg_user_id,
        read_l_report,
        other,
      },
    });
  } catch (error) {
    console.error("Error adding guard to blacklist:", error);

    if (error.code === "PROTOCOL_CONNECTION_LOST") {
      return Response.json(
        {
          error: "Database connection lost. Please try again.",
          success: false,
        },
        { status: 500 }
      );
    }

    if (error.code === "ER_DUP_ENTRY") {
      return Response.json(
        {
          error:
            "A guard with this information already exists in the blacklist",
          success: false,
        },
        { status: 409 }
      );
    }

    return Response.json(
      {
        success: false,
        error: "Failed to add guard to blacklist. Please try again.",
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
