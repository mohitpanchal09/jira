"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useParamsHook from "@/hooks/useParams";
import { useModalStore } from "@/store/modalStore";
import { Project, Task } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import ProjectAvatar from "./ProjectAvatar";

interface ProjectListProps {
  projects: Project[];
  total: number;
}

export const ProjectList = ({ projects, total }: ProjectListProps) => {
  const workspaceId = useParamsHook().workspaceId;
  const { openCreateProjectModal } = useModalStore();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-3">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button variant={"muted"} size="icon" onClick={openCreateProjectModal}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <Separator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {projects.map((item: Project) => (
            <li key={item.id}>
              <Link href={`/workspaces/${item.workspaceId}/tasks/${item.id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectAvatar
                      name={item.name}
                      image={item.image}
                      className="size-12"
                      fallbackClassname="text-lg"
                    />
                    <p className="text-lg font-medium truncate">{item.name}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-center text-muted-foreground hidden first-of-type:block">
            No Projects Found
          </li>
        </ul>
        <Button variant={"muted"} className="mt-4 w-full" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show all</Link>
        </Button>
      </div>
    </div>
  );
};
