import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/db";
import { getMembers } from "@/services/memberService";
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

      
        const members =  await getMembers(workspaceId)
        
        return NextResponse.json({ message: "Members fetched successfully", members }, { status: 200 })
    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}
