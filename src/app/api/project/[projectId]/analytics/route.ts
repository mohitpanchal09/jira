import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/db";
import { Status } from "@/types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { AuthOptions, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);
        const projectId = Number(params.projectId);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = Number(session.user.id);

        const existingProject = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!existingProject) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        const member = await prisma.member.findFirst({
            where: {
                userId,
                workspaceId: existingProject.workspaceId,
            },
        });

        if (!member) {
            return NextResponse.json({ message: "You are not a member of this workspace" }, { status: 403 });
        }

        const now = new Date();
        const thisMonthStart = startOfMonth(now);
        const thisMonthEnd = endOfMonth(now);
        const lastMonthStart = startOfMonth(subMonths(now, 1));
        const lastMonthEnd = endOfMonth(subMonths(now, 1));

        // Helper to count tasks
        const getTaskStats = async (start: Date, end: Date) => {
            const [taskCount, assignedTaskCount, completedTaskCount, overdueTaskCount] = await Promise.all([
                prisma.task.count({
                    where: {
                        projectId,
                        createdAt: {
                            gte: start,
                            lte: end,
                        },
                    },
                }),
                prisma.task.count({
                    where: {
                        projectId,
                        createdAt: {
                            gte: start,
                            lte: end,
                        },
                        assigneeId: userId,
                    },
                }),
                prisma.task.count({
                    where: {
                        projectId,
                        createdAt: {
                            gte: start,
                            lte: end,
                        },
                        status: Status.DONE,
                    },
                }),
                prisma.task.count({
                    where: {
                        projectId,
                        createdAt: {
                            gte: start,
                            lte: end,
                        },
                        status: { not: Status.DONE },
                        dueDate: { lt: now },
                    },
                }),
            ]);

            const incompleteTaskCount = taskCount - completedTaskCount;

            return {
                taskCount,
                assignedTaskCount,
                completedTaskCount,
                incompleteTaskCount,
                overdueTaskCount,
            };
        };

        const thisMonth = await getTaskStats(thisMonthStart, thisMonthEnd);
        const lastMonth = await getTaskStats(lastMonthStart, lastMonthEnd);

        const response = {
            taskCount: thisMonth.taskCount,
            taskDifference: thisMonth.taskCount - lastMonth.taskCount,
            assignedTaskCount: thisMonth.assignedTaskCount,
            assignedTaskCountDifference: thisMonth.assignedTaskCount - lastMonth.assignedTaskCount,
            completedTaskCount: thisMonth.completedTaskCount,
            completedTaskCountDifference: thisMonth.completedTaskCount - lastMonth.completedTaskCount,
            incompleteTaskCount: thisMonth.incompleteTaskCount,
            incompleteTaskCountDifference: thisMonth.incompleteTaskCount - lastMonth.incompleteTaskCount,
            overdueTaskCount: thisMonth.overdueTaskCount,
            overdueTaskCountDifference: thisMonth.overdueTaskCount - lastMonth.overdueTaskCount,
        };

        return NextResponse.json(response);
    } catch (err) {
        console.error("Fetch error:", err);
        return NextResponse.json(
            { message: "Something went wrong", error: (err as Error)?.message || err },
            { status: 500 }
        );
    }
}
