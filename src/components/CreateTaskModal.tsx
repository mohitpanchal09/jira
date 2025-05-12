"use client";
import { CreateProjectForm } from "./CreateProjectForm";
import { CreateTaskForm } from "./CreateTaskForm";
import CreateTaskFormWrapper from "./CreateTaskFormWrapper";
import { CreateWorkspaceForm } from "./CreateWorkspaceForm";
import ResponsiveModal from "./ResponsiveModal";
import { useModalStore } from "@/store/modalStore";

type Props = {};

export default function CreateTaskModal({}: Props) {
  const { isTaskModalOpen, closeTasktModal } = useModalStore();

  return (
    <ResponsiveModal 
      isOpen={isTaskModalOpen}
      onOpenChange={(open) => {
        if (!open) closeTasktModal();
      }}
    >
      <CreateTaskFormWrapper />
    </ResponsiveModal>
  );
}