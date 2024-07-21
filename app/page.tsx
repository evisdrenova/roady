"use client";
import { useGetTasks } from "@/lib/hooks/useGetTasks";
import Task from "../components/Task/Task";
import TaskInput from "@/components/Task/TaskInput";
import MainSkeleton from "@/components/ui/MainSkeleton";
import { ModeToggle } from "@/components/ModeToggle";

export default function Page() {
  const { data, isLoading, mutate } = useGetTasks();
  console.log("data", data);

  if (isLoading || !mutate) {
    return <MainSkeleton />;
  }

  return (
    <div className="w-full flex flex-col gap-6 py-6">
      <div className="flex justify-end">
        <ModeToggle />
      </div>
      <TaskInput />
      <div className="flex flex-row items-start gap-4">
        {data?.roadmap?.map((status) => (
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
