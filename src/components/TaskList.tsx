"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useParamsHook from "@/hooks/useParams";
import { useModalStore } from "@/store/modalStore";
import { Task } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import ProjectAvatar from "./ProjectAvatar";


interface TaskListProps {
  tasks: Task[];
  total: number;
}

export const TaskList = ({ tasks, total }: TaskListProps) => {
  const workspaceId=useParamsHook().workspaceId
  const { openTasktModal } = useModalStore();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-3">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total})</p>
          <Button variant={"muted"} size="icon" onClick={openTasktModal}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {tasks.map((item) => (
            <li key={item.id}>
              <Link href={`/workspaces/${item.workspaceId}/tasks/${item.id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4">
                    <p className="text-lg font-medium truncate">{item.name}</p>
                    <div className="flex items-center gap-x-2">
                    <ProjectAvatar name={item.project.name} image={item.project.image}/>  <p className="">{item.project?.name}</p>
                      <div className="rounded-full bg-neutral-300 size-1"/>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="size-3 mr-1"/>
                        <span className="truncate">
                          {formatDistanceToNow(new Date(item.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-center text-muted-foreground hidden first-of-type:block">
            No Tasks Found
          </li>
        </ul>
        <Button variant={'muted'} className="mt-4 w-full" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>
          Show all

          </Link>
        </Button>
      </div>
    </div>
  );
};
