import { prisma } from "@/lib/db";


export async function isUserWorkspaceAdmin(workspaceId: number, userId: number) {
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
