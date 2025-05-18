import { Task } from '@/types';
import { create } from 'zustand';

interface ModalState {
  isCreateWorkspaceModalOpen: boolean;
  openCreateWorkspaceModal: () => void;
  closeCreateWorkspaceModal: () => void;

  isCreateProjectModalOpen: boolean;
  openCreateProjectModal: () => void;
  closeCreateProjectModal: () => void;

  isTaskModalOpen: boolean;
  openTasktModal: () => void;
  closeTasktModal: () => void;

  isEditTaskModalOpen: boolean;
  taskToEdit: Task | null;
  openEditTasktModal: (task: Task) => void;
  closeEditTasktModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isCreateWorkspaceModalOpen: false,
  openCreateWorkspaceModal: () => set({ isCreateWorkspaceModalOpen: true }),
  closeCreateWorkspaceModal: () => set({ isCreateWorkspaceModalOpen: false }),

  isCreateProjectModalOpen: false,
  openCreateProjectModal: () => set({ isCreateProjectModalOpen: true }),
  closeCreateProjectModal: () => set({ isCreateProjectModalOpen: false }),

  isTaskModalOpen: false,
  openTasktModal: () => set({ isTaskModalOpen: true }),
  closeTasktModal: () => set({ isTaskModalOpen: false }),

  isEditTaskModalOpen: false,
  taskToEdit: null,
  openEditTasktModal: (task) => set({ isEditTaskModalOpen: true, taskToEdit: task }),
  closeEditTasktModal: () => set({ isEditTaskModalOpen: false, taskToEdit: null }),
}));
