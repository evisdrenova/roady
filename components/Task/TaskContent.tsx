import { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { ArrowTopRightIcon, Half2Icon } from "@radix-ui/react-icons";
import { Badge } from "../ui/badge";
import { BiMessageSquareDots } from "react-icons/bi";
import { TbCircleDashed } from "react-icons/tb";
import { Circle } from "lucide-react";

interface Props {
  title: string;
  description: string;
  stage: string;
  setOpenTaskSheet: () => void;
}

export default function TaskContent(props: Props): ReactElement {
  const { title, description, setOpenTaskSheet, stage } = props;

  const handleIcon = (stage: string): ReactElement => {
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

  return (
    <Button
      variant="ghost"
      className="w-4/5 group h-20"
      onClick={setOpenTaskSheet}
    >
      <div className="flex flex-col gap-2 text-left w-full ">
        <div>
          <div className="flex flex-row items-center gap-2">
            {handleIcon(stage)}
            <h2>{title}</h2>
            <ArrowTopRightIcon className="hidden group-hover:inline-block transition-opacity duration-300" />
          </div>
          <p className="description">{description}</p>
        </div>
        <BadgeBar />
      </div>
    </Button>
  );
}

function BadgeBar(): ReactElement {
  return (
    <div className="flex flex-row items-center gap-2 text-xs">
      <Badge variant="outline">Low</Badge>
      <Badge variant="outline" className="gap-2">
        <BiMessageSquareDots /> <div>7</div>
      </Badge>
    </div>
  );
}
