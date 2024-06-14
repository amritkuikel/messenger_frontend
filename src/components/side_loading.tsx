import React from "react";
import { Skeleton } from "./ui/skeleton";

const SideLoading = () => {
  return (
    <div className="flex w-[25vw] h-[90vh] justify-end bg-gray-100 dark:bg-gray-900">
      <div className="text-center capitalize font-bold py-6 flex flex-col gap-4 px-2 w-full">
        <div className="w-full flex flex-col gap-4">
          <Skeleton className="w-full p-5 rounded h-9" />
          <Skeleton className="w-full p-5 rounded h-9" />
          <Skeleton className="w-full p-5 rounded h-9" />
          <Skeleton className="w-full p-5 rounded h-9" />
          <Skeleton className="w-full p-5 rounded h-9" />
          <Skeleton className="w-full p-5 rounded h-9" />
          <Skeleton className="w-full p-5 rounded h-9" />
        </div>
      </div>
      <div className="w-1 bg-blue-300 dark:bg-blue-600"></div>
    </div>
  );
};

export default SideLoading;
