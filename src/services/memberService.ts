import { prisma } from "@/lib/db";
import { UserRole } from "@/types";

export async function updateMemberRole(memberId:number,role:UserRole){
    return await prisma.member.update({
        where:{
            id:memberId
        },
        data:{
            role
        }
    })
}
export async function deleteMember(memberId:number){
    return await prisma.member.delete({
        where:{
            id:memberId
        }
    })
}

export async function getMembers(workspaceId:number){
    return await prisma.member.findMany({
        where:{
            workspaceId
        },include:{
            user:true
        }
    })
} 