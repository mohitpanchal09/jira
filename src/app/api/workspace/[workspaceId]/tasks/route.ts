import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/db";
import { getWorkspaceTasks } from "@/services/taskService";
import { AuthOptions, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { workspaceId: string } }) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);
        const workspaceId = Number(params.workspaceId);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const existingWorkspace = await prisma.workspace.findUnique({
            where: {
                id: workspaceId,
            },
        });

        if (!existingWorkspace) {
            return NextResponse.json({ message: "Workspace not found" }, { status: 404 });
        }

        // Extract query parameters
        const searchParams = req.nextUrl.searchParams;
        const status = searchParams.get("status") || undefined;
        const assigneeId = searchParams.get("assigneeId") || undefined;
        const dueDate = searchParams.get("dueDate") || undefined; 
        const projectId = searchParams.get("projectId") || undefined; 

        const filters = {
            status,
            assigneeId: assigneeId ? Number(assigneeId) : undefined,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            projectId:projectId ? Number(projectId):undefined
        };
            console.log("🚀 ~ GET ~ filters:", filters)

        const tasks = await getWorkspaceTasks(workspaceId, filters);

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
