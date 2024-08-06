import { NextRequest, NextResponse } from "next/server";
import { IssueConnection, LinearClient } from "@linear/sdk";
import { formatTitleWithUpVote } from "@/lib/utils";

export async function GET(): Promise<NextResponse> {
  const lc = new LinearClient({
    apiKey: process.env.LINEAR_API_KEY,
  });
  // gets the project using the projectId that you want to use
  const proj = await lc.project(process.env.PROJECT_ID ?? "");

  // gets all of the issues for that project
  const issues = await proj.issues();

  // Build the roadmap based on the stages of the issues
  const roadmap = await buildRoadmap(issues);

  return NextResponse.json(roadmap, { status: 200 });
}

interface Stage {
  title: string;
  position: number;
  tasks: {
    title: string;
    description: string;
    priority: string;
    upVotes: number;
    id: string;
  }[];
}

async function buildRoadmap(issues: IssueConnection) {
  const stages: Record<string, Stage> = {};

  // Iterate through the issues and group them by their stages
  for (const issue of issues.nodes) {
    const state = await issue.state;
    if (state) {
      const stateName = state.name;
      const statePosition = state.position;

      const description = removeMarkdownLink(issue.description || "");

      if (!stages[stateName]) {
        stages[stateName] = {
          title: stateName,
          position: statePosition,
          tasks: [],
        };
      }
      stages[stateName].tasks.push({
        title: stripUpvotesFromTitle(issue.title),
        description: description,
        priority: convertPriorityNumberToString(issue.priority ?? 4),
        upVotes: extractUpvotes(issue.title),
        id: issue.id,
      });
    }
  }

  // Convert the stages object into an array format and sort by position
  const roadmap = Object.values(stages).sort((a, b) => a.position - b.position);

  return { roadmap };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const lc = new LinearClient({
    apiKey: process.env.LINEAR_API_KEY,
  });

  const body = await req.json();
  const teams = await lc.teams();
  const team = teams.nodes[0];

  try {
    let imageUrl;
    if (body.image) {
      imageUrl = await uploadFileToLinear(base64ToFile(body.image, "image"));
    }

    const taskLink = "https://www.cnn.com";

    const description = imageUrl
      ? `${body.description} ![Image](${imageUrl}) \n\n[View this task in Roady](${taskLink})`
      : `${body.description}  \n\n[View this task in Roady](${taskLink})`;

    // automatically set the issue to the backlog stages
    const res = await lc.createIssue({
      teamId: team.id,
      title: formatTitleWithUpVote(body.title, 1),
      projectId: process.env.PROJECT_ID,
      description: description,
      priority: convertPriorityStringToNumber(body.priority),
    });

    return NextResponse.json(res.success, { status: 200 });
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}

function stripUpvotesFromTitle(t: string): string {
  const regex = / -- \{\{upVotes:\d+\}\}$/;
  return t.replace(regex, "").trim();
}

// linear priority rankings are integers so we need to convert the string priority to an int
// could just combine these two into a map but eh maybe later
function convertPriorityStringToNumber(p: string): number {
  switch (p) {
    case "low":
      return 4;
    case "medium":
      return 3;
    case "high":
      return 2;
    default:
      return 4;
  }
}

function convertPriorityNumberToString(p: number): string {
  switch (p) {
    case 4:
      return "low";
    case 3:
      return "medium";
    case 2:
      return "high";
    default:
      return "low";
  }
}

function extractUpvotes(t: string): number {
  const regex = /{{upVotes:(\d+)}}/;
  const match = t.match(regex);

  if (match && match[1]) {
    return parseInt(match[1], 10);
  }

  return 0;
}

async function uploadFileToLinear(file: File): Promise<string> {
  const lc = new LinearClient({
    apiKey: process.env.LINEAR_API_KEY,
  });
  const uploadPayload = await lc.fileUpload(file.type, file.name, file.size);

  if (!uploadPayload.success || !uploadPayload.uploadFile) {
    throw new Error("Failed to request upload URL");
  }

  const uploadUrl = uploadPayload.uploadFile.uploadUrl;
  const assetUrl = uploadPayload.uploadFile.assetUrl;

  const headers = new Headers();
  headers.set("Content-Type", file.type);
  headers.set("Cache-Control", "public, max-age=31536000");
  uploadPayload.uploadFile.headers.forEach(({ key, value }) =>
    headers.set(key, value)
  );

  try {
    await fetch(uploadUrl, {
      method: "PUT",
      headers,
      body: file,
    });

    return assetUrl;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to upload file to Linear");
  }
}

function base64ToFile(base64String: string, filename: string): File {
  const byteString = atob(base64String);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: "image/jpeg" });
  return new File([blob], filename, { type: "image/jpeg" });
}
// removes [Roady](xxxx) the link from the linear description
function removeMarkdownLink(str: string) {
  const regex = /\[View this task in Roady\]\(.*?\)/g;
  return str.replace(regex, "");
}
