import React from "react";
import { ScrollArea,ScrollBar } from "./ui/scroll-area";
import AnalyticsCard from "./AnalyticsCard";
import { Separator } from "./ui/separator";

type Props = {
  data?: {
    taskCount: number;
    taskDifference: number;
    assignedTaskCount: number;
    assignedTaskCountDifference: number;
    completedTaskCount: number;
    completedTaskCountDifference: number;
    incompleteTaskCount: number;
    incompleteTaskCountDifference: number;
    overdueTaskCount: number;
    overdueTaskCountDifference: number;
  };
};

function Analytics({ data:analyticsData }: Props) {
  if(!analyticsData) return null

  const getVariant = (value: number) => (value >= 0 ? "up" : "down");

  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row gap-2 p-4">
        <AnalyticsCard
          title="Total Tasks"
          value={analyticsData.taskCount}
          variant={getVariant(analyticsData.taskDifference)}
          increaseValue={Math.abs(analyticsData.taskDifference)}
        />
        <Separator orientation="vertical" className="h-auto" />
        <AnalyticsCard
          title="Assigned Tasks"
          value={analyticsData.assignedTaskCount}
          variant={getVariant(analyticsData.assignedTaskCountDifference)}
          increaseValue={Math.abs(analyticsData.assignedTaskCountDifference)}
        />
        <Separator orientation="vertical" className="h-auto" />
        <AnalyticsCard
          title="Completed Tasks"
          value={analyticsData.completedTaskCount}
          variant={getVariant(analyticsData.completedTaskCountDifference)}
          increaseValue={Math.abs(analyticsData.completedTaskCountDifference)}
        />
        <Separator orientation="vertical" className="h-auto" />
        <AnalyticsCard
          title="Incomplete Tasks"
          value={analyticsData.incompleteTaskCount}
          variant={getVariant(analyticsData.incompleteTaskCountDifference)}
          increaseValue={Math.abs(analyticsData.incompleteTaskCountDifference)}
        />
        <Separator orientation="vertical" className="h-auto" />
        <AnalyticsCard
          title="Overdue Tasks"
          value={analyticsData.overdueTaskCount}
          variant={getVariant(analyticsData.overdueTaskCountDifference)}
          increaseValue={Math.abs(analyticsData.overdueTaskCountDifference)}
        />
      </div>
      <ScrollBar orientation="horizontal"/>
    </ScrollArea>
  );
}

export default Analytics;
