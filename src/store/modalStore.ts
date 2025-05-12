import { create } from 'zustand';
interface ModalState{
    isCreateWorkspaceModalOpen:boolean,
    openCreateWorkspaceModal:()=>void,
    closeCreateWorkspaceModal:()=>void,

    isCreateProjectModalOpen:boolean,
    openCreateProjectModal:()=>void,
    closeCreateProjectModal:()=>void

    isTaskModalOpen:boolean,
    openTasktModal:()=>void,
    closeTasktModal:()=>void
}

export const useModalStore = create<ModalState>((set)=>({
    isCreateWorkspaceModalOpen:false,
    openCreateWorkspaceModal:()=>set({isCreateWorkspaceModalOpen:true}),
    closeCreateWorkspaceModal:()=>set({isCreateWorkspaceModalOpen:false}),

    isCreateProjectModalOpen:false,
    openCreateProjectModal:()=>set({isCreateProjectModalOpen:true}),
    closeCreateProjectModal:()=>set({isCreateProjectModalOpen:false}),

    isTaskModalOpen:false,
    openTasktModal:()=>set({isTaskModalOpen:true}),
    closeTasktModal:()=>set({isTaskModalOpen:false})
}))