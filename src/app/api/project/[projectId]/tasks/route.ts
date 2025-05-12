import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { getTasks } from "@/services/taskService";
import { AuthOptions, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);
        const projectId = Number(params.projectId);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const existingProject = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
        });

        if (!existingProject) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        // Extract query parameters
        const searchParams = req.nextUrl.searchParams;
        const status = searchParams.get("status") || undefined;
        const assigneeId = searchParams.get("assigneeId") || undefined;
        const dueDate = searchParams.get("dueDate") || undefined; // Format: YYYY-MM-DD

        const filters = {
            status,
            assigneeId: assigneeId ? Number(assigneeId) : undefined,
            dueDate: dueDate ? new Date(dueDate) : undefined,
        };

        const tasks = await getTasks(projectId, filters);

        return NextResponse.json({ message: "Tasks fetched successfully", tasks }, { status: 200 });
    } catch (err) {
        console.error("Fetch error:", err);
        return NextResponse.json(
            // @ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}
