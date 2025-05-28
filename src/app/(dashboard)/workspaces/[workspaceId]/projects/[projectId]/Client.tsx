"use client";

import Analytics from "@/components/Analytics";
import PageError from "@/components/PageError";
import PageLoader from "@/components/PageLoader";
import ProjectAvatar from "@/components/ProjectAvatar";
import TaskViewSwitcher from "@/components/TaskViewSwitcher";
import { Button } from "@/components/ui/button";
import useParamsHook from "@/hooks/useParams";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Props={
  permission:{
    permission:boolean,
    message:string
  }
}

function Client({permission}:Props) {
  console.log("🚀 ~ Client ~ permission:", permission)
  const params = useParamsHook();

  const {
    data: projectData,
    error: projectError,
    isLoading: projectLoading,
  } = useSWR(`/api/project/${params.projectId}`, fetcher);

  const {
    data: analyticsData,
    error: analyticsError,
    isLoading: analyticsLoading,
  } = useSWR(`/api/project/${params.projectId}/analytics`, fetcher);

  if (projectLoading || analyticsLoading) return <PageLoader />;
  if (projectError || analyticsError) return <PageError message="Task not found" />;

  if (!projectData) return null;

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={projectData.project.name}
            className="size-8"
            image={projectData.project.image || undefined}
          />
          <p className="text-lg font-semibold">{projectData.project.name}</p>
        </div>
        <div>
         {permission.permission && <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${params.workspaceId}/projects/${params.projectId}/settings`}
            >
              <PencilIcon className="mr-1 w-4 h-4" />
              Edit Project
            </Link>
          </Button>}
        </div>
      </div>
      <Analytics data={analyticsData} />
      <TaskViewSwitcher hideProjectFilter permission={permission}/>
    </div>
  );
}

export default Client;
