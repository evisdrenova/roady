"use client";
import { useGetTasks } from "@/lib/hooks/useGetTasks";
import Task from "../components/Task/Task";
import TaskInput from "@/components/Task/TaskInput";
import MainSkeleton from "@/components/ui/MainSkeleton";
import { ModeToggle } from "@/components/ModeToggle";
import { useEffect, useState } from "react";
import { Stages } from "@/lib/types/types";

export default function Page() {
  const { data, isLoading, mutate } = useGetTasks();
  const [userFilter, setUserFilter] = useState<string>();
  const [filteredData, setFilteredData] = useState<Stages[] | undefined>(
    data?.roadmap
  );
  console.log("data", data);

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
  console.log("filted", filteredData);

  return (
    <div className="w-full flex flex-col gap-6 py-6">
      <div className="flex justify-end">
        <ModeToggle />
      </div>
      <TaskInput mutate={mutate} setUserFilter={setUserFilter} />
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
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
