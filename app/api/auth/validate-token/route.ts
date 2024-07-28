import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import jwt from "jsonwebtoken";

const pool = new Pool({
  connectionString: process.env.PG_DB_URL,
});

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  try {
    console.log("token", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "", {
      algorithms: ["HS256"],
    });

    console.log("decoded", decoded);

    // Check if the token exists in the database
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM oauth_tokens WHERE access_token = $1",
      [decoded.access_token]
    );
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Error validating token:", error);
    return NextResponse.json({ valid: false });
  }
}
