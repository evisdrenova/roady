"use client";
import { ReactElement, useRef } from "react";
import UpVoteButton from "./UpVoteButton";
import TaskContent from "./TaskContent";
import { KeyedMutator } from "swr";
import { GetTasksResponse } from "@/lib/types/types";
import TaskDialog from "./TaskDialog";

interface Props {
  title: string;
  description: string;
  upVotes: number;
  stage: string;
  issueId: string;
  priority: string;
  mutate: KeyedMutator<GetTasksResponse>;
  setOpenOAuth: (val: boolean) => void;
  openOAuth: boolean;
  numStages: number;
}

export default function Task(props: Props): ReactElement {
  const {
    title,
    description,
    upVotes,
    stage,
    issueId,
    mutate,
    priority,
    setOpenOAuth,
    openOAuth,
    numStages,
  } = props;

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex flex-row gap-0 items-center rounded-lg border border-gray-300 dark:border-gray-700  overflow-hidden shadow-md dark:shadow-[#141617] dark:bg-[#141617]">
      <TaskContent
        title={title}
        setOpenTaskSheet={() => buttonRef.current?.click()}
        stage={stage}
        priority={priority}
        description={description}
        numStages={numStages}
      />
      <UpVoteButton
        upVotes={upVotes}
        issueId={issueId}
        title={title}
        mutate={mutate}
        setOpenOAuth={setOpenOAuth}
        openOAuth={openOAuth}
      />
      <TaskDialog
        buttonRef={buttonRef}
        title={title}
        description={description}
        upVotes={upVotes}
        priority={priority}
        stage={stage}
      />
    </div>
  );
}
