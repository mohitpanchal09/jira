import { Task } from "@/types";
import React from "react";
import { Button } from "./ui/button";
import { PencilIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import OverviewProperty from "./OverviewProperty";
import MemberAvatar from "./MemberAvatar";
import TaskDate from "./TaskDate";
import { getStatusLabel } from "./TaskStatus";
import { useModalStore } from "@/store/modalStore";
import EditTaskModal from "./EditTaskModal";
import TaskDescription from "./TaskDescription";

type Props = {
  task: Task;
  userRoles:string[]
};

function TaskOverview({ task,userRoles }: Props) {
  const { openEditTasktModal } = useModalStore();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <EditTaskModal />
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
         {userRoles.includes('ADMIN') && <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => openEditTasktModal(task)}
          >
            <PencilIcon className="size-4 mr-2" />
            Edit
          </Button>}
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar
              name={task.assignee.username || ""}
              className="size-6"
            />
            <p>{task.assignee.username}</p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            {getStatusLabel(task.status)}
          </OverviewProperty>
        </div>
      </div>
      {/* <OverviewProperty label="Description"> */}
        <TaskDescription task={task} userRoles={userRoles} />
      {/* </OverviewProperty> */}
    </div>
  );
}

export default TaskOverview;
