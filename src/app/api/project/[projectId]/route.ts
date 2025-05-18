import { AuthOptions, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadToS3 } from "@/lib/s3";
import { deleteProject, updateProject } from "@/services/projectService";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function GET(req: NextRequest, { params }: { params: { projectId: string } }) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const projectId = Number(params.projectId);
        if (isNaN(projectId)) {
            return NextResponse.json({ message: "Invalid project ID" }, { status: 400 });
        }

        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            }
        });

        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        if (project.userId !== session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ project }, { status: 200 });
    } catch (err) {
        console.error("Fetch project error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}


export async function PATCH(req: NextRequest, { params }: { params: { projectId: string } }) {
    try {
        const session = await getServerSession(authOptions as AuthOptions)

        const projectId = Number(params.projectId)

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const existingProject = await prisma.project.findUnique({
            where: {
                id: projectId
            }
        })
        if (!existingProject) {
            return NextResponse.json({ message: "project not found" }, { status: 404 });
        }

        const userId = session?.user?.id
        if (existingProject.userId !== userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const formData = await req.formData()

        const name = formData.get("name")
        const image = formData.get("image")
        if (typeof name !== "string") {
            return NextResponse.json({ message: "Invalid name" }, { status: 400 });
        }
        let imageUrl: string | undefined = undefined;
        if (image && image instanceof File) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const fileName = `project-${Date.now()}-${image.name}`;
            imageUrl = await uploadToS3(buffer, fileName, image.type);
        } else {
            imageUrl = undefined; // don't send an empty string
        }
        const workspaceId = existingProject.workspaceId

        const project = await updateProject(projectId, name, imageUrl || undefined, workspaceId)

        return NextResponse.json({ message: "project updated successfully", project }, { status: 201 })
    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}


export async function DELETE(req: NextRequest, { params }: { params: { projectId: string } }) {
    try {
        const session = await getServerSession(authOptions as AuthOptions)

        const projectId = Number(params.projectId)

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const existingProject = await prisma.project.findUnique({
            where: {
                id: projectId
            }
        })
        if (!existingProject) {
            return NextResponse.json({ message: "project not found" }, { status: 404 });
        }

        const userId = session?.user?.id


        if (existingProject.userId !== userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const workspace = await deleteProject(projectId)
        return NextResponse.json({ message: "project updated successfully", workspace }, { status: 201 })
    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}