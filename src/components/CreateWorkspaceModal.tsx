"use client";
import { CreateWorkspaceForm } from "./CreateWorkspaceForm";
import ResponsiveModal from "./ResponsiveModal";
import { useModalStore } from "@/store/modalStore";

type Props = {};

export default function CreateWorkspaceModal({}: Props) {
  const { isCreateWorkspaceModalOpen, closeCreateWorkspaceModal } = useModalStore();

  return (
    <ResponsiveModal 
      isOpen={isCreateWorkspaceModalOpen}
      onOpenChange={(open) => {
        if (!open) closeCreateWorkspaceModal();
      }}
    >
      <CreateWorkspaceForm />
    </ResponsiveModal>
  );
}