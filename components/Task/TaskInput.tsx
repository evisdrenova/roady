"use client";
import { ReactElement, useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { PaperclipIcon } from "lucide-react";
import { Tabs } from "../tabs";
import { Separator } from "../ui/separator";
import { CreateTaskResponse, GetTasksResponse } from "@/lib/types/types";
import { useForm } from "react-hook-form";
import { taskSchema } from "@/lib/types/zod";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Spinner from "../ui/spinner";
import { toast } from "sonner";
import { KeyedMutator } from "swr";
import { useSession } from "next-auth/react";

interface Props {
  mutate: KeyedMutator<GetTasksResponse>;
  setOpenOAuth: (val: boolean | ((prev: boolean) => boolean)) => void;
  openOAuth: boolean;
}

export default function TaskInput(props: Props): ReactElement {
  const { mutate, setOpenOAuth, openOAuth } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [priority, setPriority] = useState<string>("low");
  const user = useSession();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    if (!user.data) {
      setOpenOAuth(true);
      return;
    }
    setIsSubmitting(true);
    const tempTaskId = "temporary-id";

    const newTask = {
      title: values.title,
      description: values.description ?? "",
      priority,
      upVotes: 1,
      id: tempTaskId,
    };

    // update local cache for optimistic update of the UI
    mutate((data) => {
      if (!data) return data;
      const updatedRoadmap = data.roadmap.map((stage) => {
        if (stage.title === "Backlog") {
          return {
            ...stage,
            tasks: [newTask, ...stage.tasks],
          };
        }
        return stage;
      });

      return { ...data, roadmap: updatedRoadmap };
    }, false);
    try {
      await CreateTask(values.title, priority, values?.description ?? "");
      toast.success("Successfully created task!");
      setIsSubmitting(false);
      form.reset();
    } catch (error: any) {
      setIsSubmitting(false);
      toast.error("Unable to create new task");
      mutate((data) => {
        if (!data) return data;
        const updatedRoadmap = data.roadmap.map((stage) => {
          if (stage.title === "Backlog") {
            // roll task back since the update failed
            const filteredTasks = stage.tasks.filter(
              (item) => item.id != tempTaskId
            );
            return {
              ...stage,
              tasks: filteredTasks,
            };
          }
          return stage;
        });

        return { ...data, roadmap: updatedRoadmap };
      }, false);
    }
  }

  const isFormDirty = Object.keys(form.formState.dirtyFields).length > 0;

  return (
    <div className="shadow-md border border-gray-300 dark:border-gray-700 p-2 dark:bg-[#141617] rounded-lg flex flex-col gap-2 dark:shadow-[#141617]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Title"
                    className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 text-lg font-semibold placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:bg-[#141617] "
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Task Description. You can use text or code."
                    className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 text-sm placeholder:text-gray-300 dark:placeholder:text-gray-700 dark:bg-[#141617] "
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Separator className="dark:bg-gray-700" />
          <div className="w-full justify-between flex">
            <div className="flex flex-row gap-4 items-center">
              <PriorityTabs setPriority={setPriority} />
              <Button variant="ghost" size="sm">
                <PaperclipIcon className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-row gap-2">
              {isFormDirty && (
                <Button
                  className="rounded-xl"
                  type="submit"
                  variant="secondary"
                  onClick={() => form.reset()}
                >
                  Clear
                </Button>
              )}
              <Button
                className="rounded-xl"
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting ? <Spinner /> : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface PriorityTabsProps {
  setPriority: (priority: string) => void;
}

const PriorityTabs = ({ setPriority }: PriorityTabsProps): ReactElement => {
  const tabs = [
    {
      title: "Low",
      value: "low",
    },
    {
      title: "Medium",
      value: "medium",
    },
    {
      title: "High",
      value: "high",
    },
  ];

  return (
    <div className="flex flex-col items-left gap-1">
      <Tabs tabs={tabs} onTabChange={setPriority} />
    </div>
  );
};

async function CreateTask(
  title: string,
  priority: string,
  description?: string
): Promise<CreateTaskResponse> {
  const res = await fetch(`/api/tasks`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      description: description,
      priority: priority,
    }),
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message);
  }
  return await res.json();
}
