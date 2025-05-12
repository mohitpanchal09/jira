import { uploadToS3 } from "@/lib/s3";
import { deleteWorkspace, resetWorkspaceInviteLink, updateWorkspace } from "@/services/workspaceService";
import { AuthOptions, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest,  { params }: { params: { workspaceId: string } }) {
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

        const userId = session?.user?.id
        if(existingWorkspace.userId!==userId){
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
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

        const workspace = await updateWorkspace(name, userId,workspaceId,imageUrl,)
        return NextResponse.json({ message: "workspace updated successfully", workspace }, { status: 201 })
    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}


export async function DELETE(req: NextRequest,  { params }: { params: { workspaceId: string } }) {
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

        const userId = session?.user?.id
        

        if(existingWorkspace.userId!==userId){
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const workspace = await deleteWorkspace(workspaceId)
        return NextResponse.json({ message: "workspace updated successfully", workspace }, { status: 201 })
    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}


export async function POST(req: NextRequest,  { params }: { params: { workspaceId: string } }) {
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

        const userId = session?.user?.id
        

        if(existingWorkspace.userId!==userId){
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const workspace = await resetWorkspaceInviteLink(workspaceId)
        return NextResponse.json({ message: "Invite code has been reset", workspace }, { status: 200 })
    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}
