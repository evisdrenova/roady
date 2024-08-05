"use client";
import { ReactElement } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { BadgeBar, handleIcon } from "./TaskContent";
import { Separator } from "../ui/separator";
import Image from "next/image";

interface Props {
  buttonRef: React.RefObject<HTMLButtonElement>;
  title: string;
  description: string;
  upVotes: number;
  priority: string;
  stage: string;
}

export default function TaskDialog(props: Props): ReactElement {
  const { buttonRef, title, description, upVotes, priority, stage } = props;
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button ref={buttonRef} className="hidden" />
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <div className="flex flex-col gap-2 pr-6">
                <div className="flex flex-row items-start gap-2 text-wrap w-full">
                  <div className="pt-2">{handleIcon(stage)}</div>
                  <h1 className="break-all">{title}</h1>
                </div>
                <div className="pl-5">
                  <BadgeBar priority={priority} upVotes={upVotes} />
                </div>
              </div>
            </DialogTitle>
            <div className="pt-4">
              <Separator />
            </div>
            <DialogTaskBody description={description} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface DialogTaskBodyProps {
  description: string;
}

function DialogTaskBody(props: DialogTaskBodyProps): ReactElement {
  const { description } = props;

  const imageLink = parseImageFromTask(description);
  const cleanedDescription = RemoveMarkdownImagnLink(description);

  console.log("imagelink", description);
  return (
    <div className="flex text-sm flex-col p-6 text-wrap break-all">
      <div>{cleanedDescription}</div>
      {imageLink && (
        <div className="rounded border dark:border-gray-700 border-gray-300 mt-10">
          <img
            src={imageLink}
            alt="task_image"
            className="rounded border dark:border-gray-700 border-gray-300 "
          />
        </div>
      )}
    </div>
  );
}

function parseImageFromTask(description: string): string | null {
  const regex = /!\[.*?\]\((.*?)\)/;
  const match = description.match(regex);
  return match ? match[1] : null;
}

export function RemoveMarkdownImagnLink(description: string): string {
  const regex = /\!\[Image\]\(.*?\)/g;
  return description.replace(regex, "");
}
