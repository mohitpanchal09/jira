import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/db";
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

        const existingProject = await prisma.project.findUnique({
            where: {
                id: projectId,
            },
        });

        if (!existingProject) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        const member = await prisma.member.findFirst({
            where: {
                userId: Number(session.user.id),
                workspaceId: existingProject.workspaceId,
            },
        });

        if (!member) {
            return NextResponse.json({ message: "You are not a member of this workspace" }, { status: 403 });
        }

        const now = new Date()
        const thisMonthStart = startOfMonth(now)
        const thisMonthEnd = endOfMonth(now)
        const lastMonthStart = startOfMonth(subMonths(now,1))
        const lastMonthEnd = endOfMonth(subMonths(now,1))


        

    } catch (err) {
        console.error("Fetch error:", err);
        return NextResponse.json(
            // @ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}
