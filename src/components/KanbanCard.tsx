import { Task } from "@/types";
import React from "react";
import TaskActions from "./TaskActions";
import { MoreHorizontal } from "lucide-react";
import { Separator } from "./ui/separator";
import MemberAvatar from "./MemberAvatar";
import TaskDate from "./TaskDate";
import ProjectAvatar from "./ProjectAvatar";

type Props = {
  task: Task;
};

function KanbanCard({ task }: Props) {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-x-2">
        <p>{task.name}</p>
        <TaskActions id={task.id} projectId={task.projectId} task={task}>
          <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:hopacity-75 transition" />
        </TaskActions>
      </div>
      <Separator/>
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar name={task.assignee.username } fallbackClassName="text-[10px]"/>
        <div className="size-1 rounded-full bg-neutral-300"/>
        <TaskDate value={task.dueDate}/>
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar name={task.project.name} image={task.project.image} fallbackClassname="text-[10px]"/>
        <span className="text-xs font-medium">{task.project.name}</span>
      </div>
    </div>
  );
}

export default KanbanCard;
