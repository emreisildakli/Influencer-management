import React from "react";
import { Skeleton } from "../ui/skeleton";

function InfluencerSkeleton() {
  return (
    <div className="items-center space-x-4 p-3 pb-4 ">
      <div className="flex gap-5 items-center mb-5">
        <Skeleton className="h-12 w-12 rounded-full" />

        <Skeleton className="h-5 w-[250px]" />
      </div>

      <Skeleton className="h-5 w-[350px]" />
      <Skeleton className="h-5 w-[200px] mt-3" />
    </div>
  );
}

export default InfluencerSkeleton;
