import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import { uploadToS3 } from "@/lib/s3";
import { createProject, getProjects } from "@/services/projectService";
import { UserRole } from "@/types";
import { AuthOptions, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest,  { params }: { params: { workspaceId: string } }) {
    try {
        const session = await getServerSession(authOptions as AuthOptions)
        
        const workspaceId = Number(params.workspaceId)
       
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const existingWorkspace = await prisma.workspace.findUnique({
            where:{
                id:workspaceId
            }
        })
        if(!existingWorkspace){
            return NextResponse.json({ message: "workspace not found" }, { status: 404 });
        }

      
        const projects =  await getProjects(workspaceId)
        
        return NextResponse.json({ message: "Projects fetched successfully", projects }, { status: 200 })
    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest, { params }: { params: { workspaceId: string } }) {
    try {
        const session = await getServerSession(authOptions as AuthOptions)
        const workspaceId = Number(params.workspaceId)

        const existingWorkspace = await prisma.workspace.findUnique({
            where:{
                id:workspaceId
            }
        })
        if(!existingWorkspace) return NextResponse.json({ message: "workspace not found" }, { status: 404 });

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        
        const userId = session?.user?.id
        const isAdmin = await prisma.member.findFirst({
            where:{
                workspaceId,
                userId
            }
        })
        if(!isAdmin) return NextResponse.json({ message: "You are not a member" }, { status: 404 });

        if(isAdmin.role!==UserRole.ADMIN) return NextResponse.json({ message: "You are not an admin" }, { status: 404 });

        const formData = await req.formData()

        const name = formData.get("name")
        const image = formData.get("image")
        if (typeof name !== "string") {
            return NextResponse.json({ message: "Invalid name" }, { status: 400 });
        }
        let imageUrl = "";
        if (image && image instanceof File) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const fileName = `workspace-${Date.now()}-${image.name}`;

            // Upload to S3 (or other storage)
            imageUrl = await uploadToS3(buffer, fileName, image.type); // define this
        }

        const project = await createProject(name, userId,imageUrl,workspaceId)
        return NextResponse.json({ message: "project created successfully", project }, { status: 201 })
    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}