"use client";
import { ReactElement, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PaperclipIcon } from "lucide-react";
import { Tabs } from "../tabs";
import { Separator } from "../ui/separator";
import { CreateTaskResponse, GetTasksResponse } from "@/lib/types/types";
import { useForm } from "react-hook-form";
import { taskSchema } from "@/lib/types/zod";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Spinner from "../ui/spinner";
import { toast } from "sonner";
import { KeyedMutator } from "swr";
import { useSession } from "next-auth/react";
import { useEditor, EditorContent, JSONContent, Editor } from "@tiptap/react";
import CodeBlock from "@tiptap/extension-code-block";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Code from "@tiptap/extension-code";
import { Placeholder } from "@tiptap/extension-placeholder";

interface Props {
  mutate: KeyedMutator<GetTasksResponse>;
  setOpenOAuth: (val: boolean | ((prev: boolean) => boolean)) => void;
  openOAuth: boolean;
}

// Wire up tiptap so that it gets stored in linear correctly as well
// then wire up retrieving it from linear and rendering it on the front end correctly

export default function TaskInput(props: Props): ReactElement {
  const { mutate, setOpenOAuth, openOAuth } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [priority, setPriority] = useState<string>("low");
  const [description, setDescription] = useState<string>("");
  // const [title, setTitle] = useState<JSONContent>();
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

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Placeholder.configure({
        placeholder: "Task Description. You can use text or code.",
      }),
      Code.configure({
        HTMLAttributes: {
          class: "tt-custom-code",
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "tt-custom-code-block",
          exitOnTripleEnter: true,
          exitOnArrowDown: true,
        },
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setDescription(extractTextFromHTML(editor.getHTML()));
      form.setValue("description", extractTextFromHTML(editor.getHTML()));
    },
  });

  // useEffect(() => {
  //   if (editor) {
  //     editor.on("update", () => {
  //       const html = editor.getHTML();
  //       // setDescription(JSON.stringify(editor.getJSON()));
  //       const extractedText = html.replace(/<\/?[^>]+(>|$)/g, "");
  //       setDescription(extractedText);
  //       form.setValue("description", extractedText);
  //     });
  //   }
  //   return () => {
  //     if (editor) {
  //       editor.destroy();
  //     }
  //   };
  // }, [editor, setDescription]);

  console.log("description", description);
  // console.log("json", editor?.getJSON());
  // console.log("json", editor?.getText());
  console.log("json", editor?.getHTML());

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
          <div className="pl-3 min-h-[80px]">
            <EditorContent editor={editor} />
          </div>
          {/* <FormField
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
          /> */}
          <EditorContent editor={editor} />
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
                  // onClick={() => form.reset()}
                  onClick={() => editor?.commands.setContent("")}
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

function extractTextFromHTML(htmlString: string): string {
  // Create a temporary DOM element to parse the HTML string
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  // Function to recursively extract text while preserving backticks and quotes
  function getText(node: Node): string {
    let text = "";

    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        text += child.textContent;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as HTMLElement;
        if (element.tagName === "CODE" || element.tagName === "PRE") {
          const isMultiLine = element.tagName === "PRE";
          const backticks = isMultiLine ? "```" : "`";
          text += `${backticks}${element.textContent}${backticks}`;
        } else {
          text += getText(child);
        }
      }

      // Preserve carriage returns
      if (
        child.nodeType === Node.ELEMENT_NODE &&
        (child as HTMLElement).tagName === "BR"
      ) {
        text += "\n";
      }
    });

    return text;
  }

  return getText(tempDiv);
}
