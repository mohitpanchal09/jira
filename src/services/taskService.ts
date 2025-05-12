import { prisma } from "@/lib/db";
import { Status } from "@/types";

export async function getTasks(
    projectId: number,
    filters: {
        status?: string;
        assigneeId?: number;
        dueDate?: Date;
    }
) {
    return await prisma.task.findMany({
        where: {
            projectId,
            ...(filters.status && { status: filters.status as Status }),
            ...(filters.assigneeId && { assigneeId: filters.assigneeId }),
            ...(filters.dueDate && {
                dueDate: {
                    equals: filters.dueDate,
                },
            }),
        },
        include: {
            project: true,
            assignee: true, // Ensure `assignee` relation exists in your Prisma schema
        },
    });
}
