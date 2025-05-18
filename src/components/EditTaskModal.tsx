"use client";
import EditTaskFormWrapper from "./EditTaskFormWrapper";
import ResponsiveModal from "./ResponsiveModal";
import { useModalStore } from "@/store/modalStore";

type Props = {
};

export default function EditTaskModal({}: Props) {
  const { isEditTaskModalOpen, closeEditTasktModal,taskToEdit } = useModalStore();
  console.log("🚀 ~ EditTaskModal ~ taskToEdit:", taskToEdit)
  if(!taskToEdit) return null

  return (
    <ResponsiveModal 
      isOpen={isEditTaskModalOpen}
      onOpenChange={(open) => {
        if (!open) closeEditTasktModal();
      }}
    >
      <EditTaskFormWrapper/>
    </ResponsiveModal>
  );
}