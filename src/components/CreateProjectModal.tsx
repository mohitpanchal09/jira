"use client";
import { CreateProjectForm } from "./CreateProjectForm";
import { CreateWorkspaceForm } from "./CreateWorkspaceForm";
import ResponsiveModal from "./ResponsiveModal";
import { useModalStore } from "@/store/modalStore";

type Props = {};

export default function CreateProjectModal({}: Props) {
  const { isCreateProjectModalOpen, closeCreateProjectModal } = useModalStore();

  return (
    <ResponsiveModal 
      isOpen={isCreateProjectModalOpen}
      onOpenChange={(open) => {
        if (!open) closeCreateProjectModal();
      }}
    >
      <CreateProjectForm />
    </ResponsiveModal>
  );
}