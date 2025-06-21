import db from "@/app/lib/mysql";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM your_table LIMIT 10");
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("MySQL Error:", error);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }
}
