import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { Pool } from "pg";
import jwt from "jsonwebtoken";

const oauth2client = new OAuth2Client(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  process.env.GOOGLE_AUTH_REDIRECT
);

const pool = new Pool({
  connectionString: process.env.PG_DB_URL,
});

export async function GET(req: NextRequest) {
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
    console.error("Unable to store data in databse", error);
    return NextResponse.json(
      { error: "Failed to store data" },
      { status: 500 }
    );
  }

  console.log("the token", tokens.access_token);

  // Generate JWT and sign it using jwt secret
  const jwtToken = jwt.sign(
    { access_token: tokens.access_token },
    process.env.JWT_SECRET ?? "",
    { algorithm: "HS256", expiresIn: "1h" }
  );

  console.log("the signed token", jwtToken);

  // Set the JWT as a cookie
  const response = NextResponse.redirect(
    process.env.NEXT_PUBLIC_URL ?? "http://localhost:3001"
  );
  response.cookies.set("roady_auth_token", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: process.env.NEXT_PUBLIC_URL ?? "http://localhost:3001",
  });

  return response;
}
