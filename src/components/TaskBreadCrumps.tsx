import { Project, Task } from "@/types";
import React, { useState } from "react";
import ProjectAvatar from "./ProjectAvatar";
import useParamsHook from "@/hooks/useParams";
import Link from "next/link";
import { ChevronRight, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import { useRouter } from "next/navigation";

type Props = {
  project: Project;
  task: Task;
};

function TaskBreadCrumps({ project, task }: Props) {
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
        await axiosInstance.delete(`/task/${task.id}`);
        toast.success("Task deleted successfully!");
        router.push(`/workspaces/${workspaceId}/tasks`);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to delete task.");
      } finally {
        setIsDeleting(false);
      }
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar
        name={project.name}
        image={project.image}
        className="size-6 lg:size-8"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRight className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:size-5 text-muted-foreground whitespace-nowrap">
        {task.name}
      </p>

      <Button
        variant={"delete"}
        size={"sm"}
        className="ml-auto"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
}

export default TaskBreadCrumps;
