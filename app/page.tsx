"use client";
import { useGetTasks } from "@/lib/hooks/useGetTasks";
import Task from "../components/Task/Task";
import TaskInput from "@/components/Task/TaskInput";
import MainSkeleton from "@/components/ui/MainSkeleton";
import { ModeToggle } from "@/components/ModeToggle";
import { useState } from "react";
import GoogleOAuth from "@/components/GoogleOAuth";
import { useSession } from "next-auth/react";
import UserProfile from "@/components/UserProfile";

export default function Page() {
  const session = useSession();
  const isUserAuthenticated = useSession().data ? true : false;
  const { data, isLoading, mutate } = useGetTasks();
  const [openOAuth, setOpenOAuth] = useState<boolean>(false);

  if (isLoading || !mutate) {
    return <MainSkeleton />;
  }

  const priorityOrder: { [key: string]: number } = {
    high: 1,
    medium: 2,
    low: 3,
  };

  return (
    <div className="w-full flex flex-col gap-6 py-6">
      <div className="flex flex-row justify-end items-center gap-2">
        <ModeToggle />
        <GoogleOAuth setOpenOAuth={setOpenOAuth} openOAuth={openOAuth} />
        <UserProfile />
      </div>
      <TaskInput
        mutate={mutate}
        setOpenOAuth={setOpenOAuth}
        openOAuth={openOAuth}
      />
      <div className="flex flex-row items-start gap-4">
        {data?.roadmap.map((status) => (
          <div className="flex flex-col gap-2 w-full" key={status.title}>
            <h1>{status.title}</h1>
            <div className="flex flex-col gap-4">
              {status.tasks
                .sort(
                  (a, b) =>
                    priorityOrder[a.priority] - priorityOrder[b.priority]
                )
                .map((task) => (
                  <Task
                    title={task.title}
                    description={task.description}
                    upVotes={task.upVotes}
                    key={task.title}
                    stage={status.title}
                    issueId={task.id}
                    mutate={mutate}
                    priority={task.priority}
                    setOpenOAuth={setOpenOAuth}
                    openOAuth={openOAuth}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
