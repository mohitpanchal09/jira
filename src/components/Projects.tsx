"use client";
import useParamsHook from "@/hooks/useParams";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/store/modalStore";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { RiAddCircleFill } from "react-icons/ri";
import ProjectAvatar from "./ProjectAvatar";

type Project = {
  id: number;
  name: string;
  image?:string
};

type Props = {
};

function Projects({  }: Props) {
  const params = useParamsHook()
  const { openCreateProjectModal } = useModalStore();
  const pathname = usePathname();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`/api/workspace/${params.workspaceId}/projects`);
        setProjects(res.data.projects); 
    
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, [params.workspaceId]);

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Projects</p>
        <RiAddCircleFill className="size-5 cursor-pointer" onClick={openCreateProjectModal} />
      </div>
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
              <ProjectAvatar name={project.name} image={project.image}/>
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default Projects;
