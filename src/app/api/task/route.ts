import { AuthOptions, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions as AuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      workspaceId,
      projectId,
      assigneeId,
      name,
      description,
      dueDate,
      status = "TODO",
    } = body;
      console.log("🚀 ~ POST ~ dueDate:", dueDate)
      console.log("🚀 ~ POST ~ description:", description)
      console.log("🚀 ~ POST ~ name:", name)
      console.log("🚀 ~ POST ~ assigneeId:", assigneeId)
      console.log("🚀 ~ POST ~ projectId:", projectId)
      console.log("🚀 ~ POST ~ workspaceId:", workspaceId)

    if (
      !name ||
      !description ||
      !dueDate ||
      !workspaceId ||
      !projectId ||
      !assigneeId
    ) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: Number(workspaceId) },
    });

    if (!workspace) {
      return NextResponse.json({ message: "Workspace not found" }, { status: 404 });
    }

    const isAdmin = await prisma.member.findFirst({
      where: {
        workspaceId: Number(workspaceId),
        userId: session.user.id,
      },
    });

    if (!isAdmin) {
      return NextResponse.json({ message: "You are not a member" }, { status: 403 });
    }

    if (isAdmin.role !== "ADMIN") {
      return NextResponse.json({ message: "You are not an admin" }, { status: 403 });
    }

    const maxTask = await prisma.task.findFirst({
      where: { projectId: Number(projectId) },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const newPosition = maxTask ? maxTask.position + 1000 : 1000;

    const task = await prisma.task.create({
      data: {
        name,
        description,
        dueDate: new Date(dueDate),
        workspaceId: Number(workspaceId),
        projectId: Number(projectId),
        assigneeId: Number(assigneeId),
        status,
        position: newPosition,
      },
    });

    return NextResponse.json({ message: "Task created successfully", task }, { status: 201 });
  } catch (err) {
    console.error("Task creation error:", err);
    return NextResponse.json(
      //@ts-ignore
      { message: "Something went wrong", error: err?.message || err },
      { status: 500 }
    );
  }
}
