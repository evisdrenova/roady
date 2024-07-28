"use client";
import { useGetTasks } from "@/lib/hooks/useGetTasks";
import Task from "../components/Task/Task";
import TaskInput from "@/components/Task/TaskInput";
import MainSkeleton from "@/components/ui/MainSkeleton";
import { ModeToggle } from "@/components/ModeToggle";
import { useEffect, useState } from "react";
import { Stages } from "@/lib/types/types";
import Spinner from "@/components/ui/spinner";
import { CheckCheck, CircleCheck } from "lucide-react";
import GoogleOAuth from "@/components/GoogleOAuth";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";

export default function Page() {
  const session = useSession();
  const { data, isLoading, mutate } = useGetTasks();
  const [userFilter, setUserFilter] = useState<string>();
  const [filteredData, setFilteredData] = useState<Stages[] | undefined>(
    data?.roadmap
  );

  useEffect(() => {
    if (data?.roadmap) {
      if (userFilter) {
        setFilteredData(
          data.roadmap.map((stage) => ({
            ...stage,
            tasks: stage.tasks.filter((task) =>
              task.title.includes(userFilter)
            ),
          }))
        );
      } else {
        setFilteredData(data.roadmap);
      }
    }
  }, [data?.roadmap, userFilter]);

  if (isLoading || !mutate) {
    return <MainSkeleton />;
  }

  const hasTasks = filteredData?.some((stage) => stage.tasks.length > 0);

  return (
    <div className="w-full flex flex-col gap-6 py-6">
      <div className="flex justify-end items-center gap-4">
        <ModeToggle />
        <GoogleOAuth />
      </div>
      <div className="flex flex-col gap-1">
        {userFilter && hasTasks && (
          <div className="text-xs flex flex-row items-center gap-2 ">
            <Spinner />
            <div>Matching to existing tasks ...</div>
          </div>
        )}
        <TaskInput mutate={mutate} setUserFilter={setUserFilter} />
      </div>
      <div>
        {hasTasks ? (
          <div className="flex flex-row items-start gap-4">
            {filteredData?.map((status) => (
              <div className="flex flex-col gap-2 w-full" key={status.title}>
                <h1>{status.title}</h1>
                {status.tasks.map((task) => (
                  <Task
                    title={task.title}
                    description={task.description}
                    upVotes={task.upVotes}
                    key={task.title}
                    stage={status.title}
                    issueId={task.id}
                    mutate={mutate}
                    priority={task.priority}
                  />
                ))}
              </div>
            ))}{" "}
          </div>
        ) : (
          <div className="shadow-md border border-gray-300 dark:border-gray-700 py-8 px-2 dark:bg-[#141617] rounded-lg gap-2 dark:shadow-[#141617]  text-sm flex flex-row items-center justify-center dark:text-gray-400">
            <CircleCheck className="text-green-300" />
            Looks like a brand new task. Submit when you are ready!
          </div>
        )}
      </div>
    </div>
  );
}
