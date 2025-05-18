"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, Trash } from "lucide-react";
import { useConfirm } from "@/hooks/useConfirm";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useParamsHook from "@/hooks/useParams";
import { useModalStore } from "@/store/modalStore";
import EditTaskModal from "./EditTaskModal";
import { mutate } from "swr";

type Props = {
  id: string | number;
  projectId: string | number;
  children: React.ReactNode;
  task:any
};

function TaskActions({ id, projectId,task ,children }: Props) {
  const { openEditTasktModal } = useModalStore();
  const workspaceId = useParamsHook().workspaceId;
  const [isDeleting, setIsDeleting] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Confirm to delete",
    "Once deleted, you will not be able to recover this task!",
    "delete"
  );
  const router = useRouter();

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      setIsDeleting(true);
      try {
        await axiosInstance.delete(`/task/${id}`);
        // await mutate(``)
        toast.success("Task deleted successfully!");
        router.refresh();
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to delete task.");
      } finally {
        setIsDeleting(false);
      }
    }
  };
  return (
    <>
      <EditTaskModal />

      <div className="flex justify-end">
        <ConfirmDialog />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => {
                router.push(`/workspaces/${workspaceId}/tasks/${id}`);
              }}
              disabled={false}
              className="font-medium p-[10px]"
            >
              <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
              Task Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => openEditTasktModal(task)}
              disabled={false}
              className="font-medium p-[10px]"
            >
              <PencilIcon className="size-4 mr-2 stroke-2" />
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
              }}
              disabled={false}
              className="font-medium p-[10px]"
            >
              <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
              Open Project
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeleting}
              className="font-medium p-[10px]"
            >
              <Trash className="text-red-500 focus:text-red-500 size-4 mr-2 stroke-2" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}

export default TaskActions;
