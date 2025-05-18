import { Status } from "@/types";
import React from "react";
import { getStatusLabel } from "./TaskStatus";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { useModalStore } from "@/store/modalStore";

type Props = {
  board: Status;
  taskCount: number;
};

const statusIconMap: Record<Status, React.ReactNode> = {
  [Status.BACKLOG]: <CircleDashedIcon className="size-[18px] text-gray-400" />,
  [Status.TODO]: <CircleIcon className="size-[18px] text-blue-400" />,
  [Status.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-[18px] text-yellow-400" />
  ),
  [Status.IN_REVIEW]: <CircleDotIcon className="size-[18px] text-purple-400" />,
  [Status.DONE]: <CircleCheckIcon className="size-[18px] text-green-400" />,
};

function KanbanColumnHeader({ board, taskCount }: Props) {
    const {openTasktModal} = useModalStore()
  const icon = statusIconMap[board];
  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center justify-between  gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{board}</h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
          {taskCount}
        </div>
      </div>
      <Button onClick={openTasktModal} variant={'ghost'} size={'icon'} className="size-5">
        <PlusIcon className="size-4 text-neutral-500"/>
      </Button>
    </div>
  );
}

export default KanbanColumnHeader;
