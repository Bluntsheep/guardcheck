// app/api/db-test/route.js

import { testDbConnection } from "@/lib/testConnection/testConnection";

// NO "use client"; at the top of this file!

export async function GET() {
  // A GET request is suitable for a health check

  const isConnected = await testDbConnection();

  if (isConnected) {
    return new Response(
      JSON.stringify({ message: "Database connection OK", status: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } else {
    // Return a 500 status if the database connection fails
    return new Response(
      JSON.stringify({ message: "Database connection FAILED", status: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// You could also add a POST function if you prefer to trigger it with POST
// export async function POST(req) {
//   const isConnected = await testDbConnection();
//   // ... same logic as GET ...
// }
