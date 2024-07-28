import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { Pool } from "pg";

const oauth2client = new OAuth2Client(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  process.env.GOOGLE_AUTH_REDIRECT
);

const pool = new Pool({
  connectionString: process.env.PG_DB_URL,
});

export async function GET(req: NextRequest) {
  console.log(
    `${process.env.NEXT_PUBLIC_URL}${process.env.GOOGLE_AUTH_REDIRECT}`
  );
  let code;
  let state;

  if (req.nextUrl.searchParams) {
    code = req.nextUrl.searchParams.get("code");
    state = req.nextUrl.searchParams.get("state");
  }

  if (!code) {
    const authUrl = oauth2client.generateAuthUrl({
      prompt: "consent",
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/userinfo.email"],
    });
    return NextResponse.redirect(authUrl);
  }

  const { tokens } = await oauth2client.getToken(code);

  // safely store the token in a database so that you can use it later
  // I'm using postgres here
  try {
    const client = await pool.connect();
    await client.query(
      "INSERT INTO oauth_tokens (access_token, refresh_token, scope, token_type, expiry_date) VALUES ($1, $2, $3, $4, $5)",
      [
        tokens.access_token,
        tokens.refresh_token,
        tokens.scope,
        tokens.token_type,
        tokens.expiry_date,
      ]
    );
    client.release();
  } catch (error) {
    console.error("Error storing tokens in the database", error);
    return NextResponse.json(
      { error: "Failed to store tokens" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(
    process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"
  );
}
