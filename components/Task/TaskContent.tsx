import { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { ArrowTopRightIcon, Half2Icon } from "@radix-ui/react-icons";
import { Badge } from "../ui/badge";
import { TbCircleDashed } from "react-icons/tb";
import { Circle } from "lucide-react";
import { RemoveMarkdownImagnLink } from "./TaskDialog";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  stage: string;
  priority: string;
  setOpenTaskSheet: () => void;
  description: string;
  numStages: number;
}

export default function TaskContent(props: Props): ReactElement {
  const { title, setOpenTaskSheet, stage, priority, description, numStages } =
    props;

  const handleTitleMaxWidth = (numStages: number): number => {
    switch (numStages) {
      case 1:
        return 700;
      case 2:
        return 400;
      case 3:
        return 140;
      default:
        return 140;
    }
  };

  const handleDescriptionMaxWidth = (numStages: number): number => {
    switch (numStages) {
      case 1:
        return 1000;
      case 2:
        return 400;
      case 3:
        return 200;
      default:
        return 200;
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-4/5 group h-24"
      onClick={setOpenTaskSheet}
    >
      <div className="flex flex-col gap-3 text-left w-full ">
        <div className="flex flex-row items-center gap-2">
          {handleIcon(stage)}
          <h2
            className="truncate overflow-hidden"
            style={{ maxWidth: `${handleTitleMaxWidth(numStages)}px` }}
          >
            {title}
          </h2>
          <Badge variant="outline">{priority}</Badge>
          <ArrowTopRightIcon className="hidden group-hover:inline-block transition-opacity duration-300" />
        </div>
        <div
          className="text-xs pl-5 text-gray-400 font-light truncate overflow-hidden"
          style={{ maxWidth: `${handleDescriptionMaxWidth(numStages)}px` }}
        >
          {RemoveMarkdownImagnLink(description)}
        </div>
      </div>
    </Button>
  );
}

export const handleIcon = (stage: string): ReactElement => {
  switch (stage) {
    case "Backlog":
      return <TbCircleDashed className="h-[14px] w-[14px]" />;
    case "Todo":
      return <Circle className="h-[14px] w-[14px]" />;
    case "In Progress":
      return <Half2Icon className="h-4 w-4 text-orange-300" />;
    default:
      return <div></div>;
  }
};

interface BadgeBarProps {
  priority: string;
  upVotes?: number;
}

export function BadgeBar(props: BadgeBarProps): ReactElement {
  const { priority, upVotes } = props;

  return (
    <div className="flex flex-row items-center gap-2 text-xs">
      <Badge variant="outline">{priority}</Badge>
      <Badge variant="outline">+ {upVotes}</Badge>
    </div>
  );
}
