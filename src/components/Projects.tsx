"use client";
import useParamsHook from "@/hooks/useParams";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/store/modalStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { RiAddCircleFill } from "react-icons/ri";
import ProjectAvatar from "./ProjectAvatar";

type Project = {
  id: number;
  name: string;
  image?: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function Projects() {
  const params = useParamsHook();
  const { openCreateProjectModal } = useModalStore();
  const pathname = usePathname();

  const { data, error, isLoading } = useSWR(
    params.workspaceId ? `/api/workspace/${params.workspaceId}/projects` : null,
    fetcher
  );

  const projects: Project[] = data?.projects || [];

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Projects</p>
        <RiAddCircleFill className="size-5 cursor-pointer" onClick={openCreateProjectModal} />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-destructive">Failed to load projects.</p>}

      {projects.map((project) => {
        const href = `/workspaces/${params.workspaceId}/projects/${project.id}`;
        const isActive = pathname === href;
        return (
          <Link href={href} key={project.id}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <ProjectAvatar name={project.name} image={project.image} />
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Projects;
