"use client";
import { ReactElement, useRef, useState } from "react";
import UpVoteButton from "./UpVoteButton";
import TaskContent from "./TaskContent";
import TaskSheet from "./TaskSheet";
import { KeyedMutator } from "swr";
import { GetTasksResponse } from "@/lib/types/types";

interface Props {
  title: string;
  description: string;
  upVotes: number;
  stage: string;
  issueId: string;
  mutate: KeyedMutator<GetTasksResponse>;
}

export default function Task(props: Props): ReactElement {
  const { title, description, upVotes, stage, issueId, mutate } = props;

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex flex-row gap-0 items-center rounded-lg border border-gray-300 dark:border-gray-700  overflow-hidden shadow-md dark:shadow-[#141617] dark:bg-[#141617]">
      <TaskContent
        title={title}
        description={description}
        setOpenTaskSheet={() => buttonRef.current?.click()}
        stage={stage}
      />
      <UpVoteButton
        upVotes={upVotes}
        issueId={issueId}
        title={title}
        mutate={mutate}
      />
      <TaskSheet buttonRef={buttonRef} />
    </div>
  );
}
