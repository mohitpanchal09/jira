import { cn } from "@/lib/utils";
import { Project, Status, User } from "@/types";
import React from "react";
import MemberAvatar from "./MemberAvatar";
import ProjectAvatar from "./ProjectAvatar";
import useParamsHook from "@/hooks/useParams";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  id: number | string;
  project: Project;
  assignee: User;
  status: Status;
};

const statusColorMap: Record<Status, string> = {
  [Status.BACKLOG]: "border-l-gray-500",
  [Status.TODO]: "border-l-blue-500",
  [Status.IN_PROGRESS]: "border-l-yellow-500",
  [Status.IN_REVIEW]: "border-l-purple-500",
  [Status.DONE]: "border-l-green-500",
};

function EventCard({ title, id, project, assignee, status }: Props) {
    const workspaceId = useParamsHook().workspaceId
    const router = useRouter()
    const onClick=(e:React.MouseEvent<HTMLDivElement>)=>{
        e.stopPropagation()
        router.push(`/workspaces/${workspaceId}/tasks/${id}`)
    }

  return (
    <div className="px-2" onClick={onClick}>
      <div
        className={cn(
          "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
          statusColorMap[status]
        )}
      >
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          <MemberAvatar name={assignee?.username || ""} />
          <div className="size-1 rounded-full bg-neutral-500" />
          <ProjectAvatar name={project?.name} image={project?.image} />
        </div>
      </div>
    </div>
  );
}

export default EventCard;
