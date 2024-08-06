import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTitleWithUpVote(t: string, upVote: number): string {
  return t + `  --  {{upVotes:${upVote}}}`;
}
