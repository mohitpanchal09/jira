import { NextRequest, NextResponse } from "next/server";
import { AuthOptions, getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions as AuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      workspaceId,
      projectId,
      assigneeId,
      name,
      description,
      dueDate,
      status = "TODO",
    } = body;

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

    const member = await prisma.member.findFirst({
      where: {
        workspaceId: Number(workspaceId),
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json({ message: "You are not a member" }, { status: 403 });
    }

    if (member.role !== "ADMIN") {
      return NextResponse.json({ message: "You are not an admin" }, { status: 403 });
    }

    if (id) {
      // Update logic
      const existingTask = await prisma.task.findUnique({
        where: { id: Number(id) },
      });

      if (!existingTask) {
        return NextResponse.json({ message: "Task not found" }, { status: 404 });
      }

      const updatedTask = await prisma.task.update({
        where: { id: Number(id) },
        data: {
          name,
          description,
          dueDate: new Date(dueDate),
          assigneeId: Number(assigneeId),
          status,
          projectId: Number(projectId),
        },
      });

      return NextResponse.json({ message: "Task updated successfully", task: updatedTask }, { status: 200 });
    } else {
      // Create logic
      const maxTask = await prisma.task.findFirst({
        where: { projectId: Number(projectId) },
        orderBy: { position: "desc" },
        select: { position: true },
      });

      const newPosition = maxTask ? maxTask.position + 1000 : 1000;

      const newTask = await prisma.task.create({
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

      return NextResponse.json({ message: "Task created successfully", task: newTask }, { status: 201 });
    }
  } catch (err) {
    console.error("Task handler error:", err);
    return NextResponse.json(
      //@ts-ignore
      { message: "Something went wrong", error: err?.message || err },
      { status: 500 }
    );
  }
}
