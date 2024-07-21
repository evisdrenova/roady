import { LinearClient } from "@linear/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const lc = new LinearClient({
    apiKey: process.env.LINEAR_API_KEY,
  });
  const { searchParams } = new URL(req.url);
  const issueId = searchParams.get("issueId") ?? "";

  // the new title with the updated upVote Count
  const title = searchParams.get("title") ?? "";

  // automatically set the issue to the backlog stages
  const res = await lc.updateIssue(issueId, {
    title: title,
  });

  return NextResponse.json(res.success, { status: 200 });
}
