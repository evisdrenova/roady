import { NextRequest, NextResponse } from "next/server";
import { IssueConnection, LinearClient } from "@linear/sdk";

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

      if (!stages[stateName]) {
        stages[stateName] = {
          title: stateName,
          position: statePosition,
          tasks: [],
        };
      }
      stages[stateName].tasks.push({
        title: stripUpvotesFromTitle(issue.title),
        description: issue.description || "",
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

  // automatically set the issue to the backlog stages
  const res = await lc.createIssue({
    teamId: team.id,
    title: formatTitleWithUpVote(body.title, 1),
    projectId: process.env.PROJECT_ID,
    description: body.description,
    priority: convertPriorityStringToNumber(body.priority),
  });

  return NextResponse.json(res.success, { status: 200 });
}

export function formatTitleWithUpVote(t: string, upVote: number): string {
  return t + `  --  {{upVotes:${upVote}}}`;
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
