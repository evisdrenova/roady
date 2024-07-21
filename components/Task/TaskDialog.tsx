"use client";
import { ReactElement, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { BadgeBar, handleIcon } from "./TaskContent";
import { Separator } from "../ui/separator";

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
        <DialogContent className="sm:max-w-[425px] md:w-[700px]">
          <DialogHeader>
            <DialogTitle>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                  <div>{handleIcon(stage)} </div>
                  <h1>{title}</h1>
                  <div>Votes: {upVotes}</div>
                </div>
                <div className="pl-5">
                  <BadgeBar priority={priority} />
                </div>
              </div>
            </DialogTitle>
            <DialogTaskBody description={description} />
          </DialogHeader>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
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
  return (
    <div className="flex flex-col pl-5">
      <div>
        {description}
        <Separator />
        <ActivityLog />
      </div>
    </div>
  );
}

function ActivityLog(): ReactElement {
  return (
    <div>
      <div>12/23/2024</div>
      <div>
        <TaskComment />
      </div>
    </div>
  );
}

function TaskComment(): ReactElement {
  return <div>i have a question</div>;
}
