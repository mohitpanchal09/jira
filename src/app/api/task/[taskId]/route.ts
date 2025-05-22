import { NextRequest, NextResponse } from "next/server";
import { AuthOptions, getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { UserRole } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions as AuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const taskId = Number(params.taskId);
    if (isNaN(taskId)) {
      return NextResponse.json({ message: "Invalid task ID" }, { status: 400 });
    }

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      include:{
        project:true,
        assignee:true
      }
    });

    if (!existingTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const userId = Number(session.user.id);
    const workspaceId = existingTask.workspaceId;

    const isMember = await prisma.member.findFirst({
      where: {
        userId,
        workspaceId,
      },
    });

    if (!isMember) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ task: existingTask }, { status: 200 });
  } catch (err: any) {
    console.error("Task fetch error:", err);
    return NextResponse.json(
      { message: "Something went wrong", error: err?.message || err },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions as AuthOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const taskId = Number(params.taskId);
    if (isNaN(taskId)) {
      return NextResponse.json({ message: "Invalid task ID" }, { status: 400 });
    }

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const userId = Number(session.user.id);
    const workspaceId = existingTask.workspaceId;

    const isMember = await prisma.member.findFirst({
      where: {
        userId,
        workspaceId,
      },
    });

    if (!isMember || isMember.role!==UserRole.ADMIN) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const deletedTask = await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json(
      { message: "Task deleted successfully", task: deletedTask },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Task deletion error:", err);
    return NextResponse.json(
      { message: "Something went wrong", error: err?.message || err },
      { status: 500 }
    );
  }
}

