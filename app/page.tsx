"use client";
import { useGetTasks } from "@/lib/hooks/useGetTasks";
import Task from "../components/Task/Task";
import TaskInput from "@/components/Task/TaskInput";
import MainSkeleton from "@/components/ui/MainSkeleton";
import { ReactElement, useState } from "react";
import { useSession } from "next-auth/react";
import TopNavBar from "@/components/TopNavBar";

export default function Page() {
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
      <TopNavBar setOpenOAuth={setOpenOAuth} openOAuth={openOAuth} />
      <TaskInput
        mutate={mutate}
        setOpenOAuth={setOpenOAuth}
        openOAuth={openOAuth}
      />
      {data?.roadmap.length == 0 || !data?.roadmap ? (
        <EmptyTaskState />
      ) : (
        <div
          className="flex flex-col lg:flex-row items-start gap-4 w-full"
          id="maincontainter"
        >
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
      )}
    </div>
  );
}

function EmptyTaskState(): ReactElement {
  return (
    <div className="flex justify-center items-center border dark:border-gray-700 border-gray-300 bg-gray-50 dark:bg-gray-700/10 backdrop-blur-sm text-sm p-20 rounded-lg ">
      No Tasks found for this project!
    </div>
  );
}
