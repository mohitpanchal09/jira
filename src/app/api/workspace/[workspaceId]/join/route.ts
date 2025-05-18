import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/db";
import { joinWorkspace } from "@/services/workspaceService";
import { AuthOptions, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
        const {inviteCode} = await req.json()
        if(existingWorkspace.inviteCode!==inviteCode)  return NextResponse.json({ message: "Invite is not valid" }, { status: 400 });

        const isExistingMember = await prisma.member.findFirst({
            where:{
                userId:userId,
                workspaceId
            }
        })
        if(isExistingMember) return NextResponse.json({ message: "You are already a member" }, { status: 409 });

         await joinWorkspace(workspaceId,userId)
        
        return NextResponse.json({ message: "Workspace joined successfully" }, { status: 200 })
    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}
