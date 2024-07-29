import { formatTitleWithUpVote } from "@/app/api/tasks/route";
import { Button } from "@/components/ui/button";
import { CaretUpIcon } from "@radix-ui/react-icons";
import { ReactElement, useState } from "react";
import Spinner from "../ui/spinner";
import { GetTasksResponse } from "@/lib/types/types";
import { KeyedMutator } from "swr";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface Props {
  upVotes: number;
  issueId: string;
  title: string;
  mutate: KeyedMutator<GetTasksResponse>;
  setOpenOAuth: (val: boolean) => void;
  openOAuth: boolean;
}

export default function UpVoteButton(props: Props): ReactElement {
  const { upVotes, issueId, title, mutate, openOAuth, setOpenOAuth } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const user = useSession();

  async function handleUpVote(issueId: string, title: string, upVotes: number) {
    if (!user.data) {
      setOpenOAuth(true);
      return;
    }
    setIsSubmitting(true);
    // update local cache for optimistic update of the UI
    mutate((data) => {
      if (!data) return data;

      const updatedRoadmap = data.roadmap.map((status) => {
        return {
          ...status,
          tasks: status.tasks.map((task) => {
            if (task.id === issueId) {
              return { ...task, upVotes: upVotes + 1 };
            }
            return task;
          }),
        };
      });

      return { ...data, roadmap: updatedRoadmap };
    }, false);

    try {
      await UpVoteTask(issueId, formatTitleWithUpVote(title, upVotes + 1));
      toast.success("Upvote successful!");
      mutate();
      setIsSubmitting(false);
    } catch (e) {
      setIsSubmitting(false);
      toast.error("Unable to upvote");
      mutate((data) => {
        if (!data) return data;

        const updatedRoadmap = data.roadmap.map((status) => {
          return {
            ...status,
            tasks: status.tasks.map((task) => {
              if (task.id === issueId) {
                return { ...task, upVotes: upVotes };
              }
              return task;
            }),
          };
        });

        return { ...data, roadmap: updatedRoadmap };
      }, false);
    }
  }

  return (
    <Button
      variant="ghost"
      className="w-1/5 h-20 border-l border-l-gray-200 dark:border-gray-700 flex flex-col gap-2 group"
      onClick={() => handleUpVote(issueId, title, upVotes)}
    >
      <div className="transform transition-transform group-hover:-translate-y-[3px]">
        <CaretUpIcon />
      </div>
      <div>{isSubmitting ? <Spinner /> : upVotes}</div>
    </Button>
  );
}

async function UpVoteTask(issueId: string, title: string): Promise<string> {
  const res = await fetch(`/api/up-vote?issueId=${issueId}&title=${title}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message);
  }
  return await res.json();
}
