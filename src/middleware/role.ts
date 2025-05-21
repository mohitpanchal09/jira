import { prisma } from "@/lib/db";


export async function isUserWorkspaceAdminOrCreator(workspaceId: number, userId: number) {
    try {
        const workspace = await prisma.workspace.findFirst({
            where: {
                id: workspaceId
            }
        });

        if (!workspace) {
            return { permission: false, message: "Workspace not found" };
        }

        if (workspace.userId === userId) {
            return { permission: true, message: "You are the creator" };
        }

        const member = await prisma.member.findFirst({
            where: {
                userId: userId,
                workspaceId: workspaceId
            }
        });

        if (!member) {
            return { permission: false, message: "You are not a member of this workspace" };
        }

        if (member.role !== "ADMIN") {
            return { permission: false, message: "You are not an admin" };
        }

        return { permission: true, message: "You are an admin" };
    } catch (err) {
        console.error("Permission check error:", err);
        return { permission: false, message: "Something went wrong" };
    }
}

export async function isUserWorkspaceAdminOrCreatorOrProjectCreator(
    workspaceId: number,
    userId: number,
    projectId: number
) {
    try {
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId }
        });

        if (!workspace) {
            return { permission: false, message: "Workspace not found" };
        }

        // Case 1: User is the creator of the workspace
        if (workspace.userId === userId) {
            return { permission: true, message: "You are the creator of the workspace" };
        }

        // Case 2: User is a member
        const member = await prisma.member.findFirst({
            where: {
                userId,
                workspaceId
            }
        });

        if (member && member.role === "ADMIN") {
            return { permission: true, message: "You are an admin" };
        }

        // Case 3: User is the creator of the project
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                workspaceId
            }
        });

        if (!project) {
            return { permission: false, message: "Project not found" };
        }

        if (project.userId === userId) {
            return { permission: true, message: "You are the creator of the project" };
        }

        return { permission: false, message: "You are not authorized" };
    } catch (err) {
        console.error("Permission check error:", err);
        return { permission: false, message: "Something went wrong" };
    }
}

export async function isUserWorkspaceAdminOrCreatorOrProjectCreatorOrTaskAssignee(
    workspaceId: number,
    userId: number,
    projectId: number
) {
    try {
        const workspace = await prisma.workspace.findFirst({
            where: { id: workspaceId }
        });

        if (!workspace) {
            return { permission: false, message: "Workspace not found" };
        }

        // Case 1: User is the creator of the workspace
        if (workspace.userId === userId) {
            return { permission: true, message: "You are the creator of the workspace" };
        }

        // Case 2: User is a member
        const member = await prisma.member.findFirst({
            where: {
                userId,
                workspaceId
            }
        });

        if (!member) {
            return { permission: false, message: "You are not a member of this workspace" };
        }

        if (member.role === "ADMIN") {
            return { permission: true, message: "You are an admin" };
        }

        // Case 3: Project check
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                workspaceId
            }
        });

        if (!project) {
            return { permission: false, message: "Project not found" };
        }

        if (project.userId === userId) {
            return { permission: true, message: "You are the creator of the project" };
        }

        // Case 4: Task assignee check
        const task = await prisma.task.findFirst({
            where: {
                assigneeId: userId,
                projectId: projectId
            }
        });

        if (task) {
            return { permission: true, message: "You are the assignee of the task" };
        }

        return { permission: false, message: "You are not authorized" };
    } catch (err) {
        console.error(`Permission check error:`, err);
        return { permission: false, message: "Something went wrong" };
    }
}
