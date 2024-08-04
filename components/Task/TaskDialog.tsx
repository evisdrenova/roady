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
  return (
    <div className="flex flex-col p-6 text-wrap break-all">
      <div>{description}</div>
    </div>
  );
}
