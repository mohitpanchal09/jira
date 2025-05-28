"use client";
import useSWR from "swr";
import useParamsHook from "@/hooks/useParams";
import PageLoader from "@/components/PageLoader";
import PageError from "@/components/PageError";
import TaskBreadCrumps from "@/components/TaskBreadCrumps";
import { Separator } from "@/components/ui/separator";
import TaskOverview from "@/components/TaskOverview";

type Props = {};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const TaskIdClinet = ({}: Props) => {
  const taskId = useParamsHook().taskId;
  const { data, error, isLoading } = useSWR(`/api/task/${taskId}`, fetcher);
  if (isLoading) return <PageLoader/>;
  if (error) return <PageError message="Task not found"/>;

  return (
    <div className="flex flex-col">
     <TaskBreadCrumps project={data.task.project} task={data.task} userRoles={data.userRoles}/>
     <Separator className="my-6"/>
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data.task} userRoles={data.userRoles}/>
     </div>
    </div>
  );
};
