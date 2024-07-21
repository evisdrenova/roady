import { ReactElement } from "react";
import { Skeleton } from "./skeleton";

export default function MainSkeleton(): ReactElement {
  return (
    <div className="space-y-6 pt-10">
      <Skeleton className="h-[200px] w-full" />
      <div className="flex flex-row items-top w-full gap-6">
        <div className="flex flex-col gap-6 w-1/3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <div className="flex flex-col gap-6 w-1/3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <div className="flex flex-col gap-6 w-1/3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    </div>
  );
}
