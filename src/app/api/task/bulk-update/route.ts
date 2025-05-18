import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Adjust this to your prisma client path
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = Number(session.user.id); // assuming it's a number
        const tasksToUpdate = await req.json();
        console.log("🚀 ~ POST ~ tasksToUpdate:", tasksToUpdate)

        if (!Array.isArray(tasksToUpdate) || tasksToUpdate.length === 0) {
            return NextResponse.json({ message: "Invalid payload format" }, { status: 400 });
        }

        const taskIds = tasksToUpdate.map((task: any) => task.id);

        const tasks = await prisma.task.findMany({
            where: { id: { in: taskIds } },
            select: {
                id: true,
                workspaceId: true,
                assigneeId: true,
            },
        });

        if (tasks.length !== taskIds.length) {
            return NextResponse.json({ message: "Some tasks not found" }, { status: 404 });
        }

        const uniqueWorkspaceIds = new Set(tasks.map((t) => t.workspaceId));
        if (uniqueWorkspaceIds.size > 1) {
            return NextResponse.json(
                { message: "All tasks must belong to the same workspace" },
                { status: 400 }
            );
        }

        const workspaceId = tasks[0].workspaceId;

        const isAssigneeForAll = tasks.every((task) => task.assigneeId === userId);

        const isAdmin = await prisma.member.findFirst({
            where: {
                userId,
                workspaceId,
                role: "ADMIN",
            },
        });

        if (!isAssigneeForAll && !isAdmin) {
            return NextResponse.json(
                { message: "You are not authorized to update these tasks" },
                { status: 403 }
            );
        }

        const updatedTasks = await Promise.all(
            tasksToUpdate.map((task: any) =>
                prisma.task.update({
                    where: { id: task.id },
                    data: {
                        status: task.status,
                        position: task.position,
                    },
                })
            )
        );

        return NextResponse.json({
            message: "Tasks updated successfully",
            data: updatedTasks,
        });
    } catch (err) {
        console.error("Task handler error:", err);
        return NextResponse.json(
            {
                message: "Something went wrong",
                //@ts-ignore
                error: err?.message || err,
            },
            { status: 500 }
        );
    }
}
