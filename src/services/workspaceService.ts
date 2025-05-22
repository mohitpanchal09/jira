import { prisma } from "@/lib/db";
import { generateInviteCode } from "@/lib/utils";
import { UserRole } from "@/types";


export async function createWorkspace(name: string, userId: number, image: string) {
    const inviteCode = generateInviteCode(6)
    const res = await prisma.workspace.create({
        data: {
            name,
            userId,
            image,
            inviteCode
        }
    })

    await prisma.member.create({
        data: {
            workspaceId: res.id,
            userId: userId,
            role: UserRole.ADMIN
        }
    })
    return res
}

export async function getWorkspaces(userId: number) {
  return await prisma.workspace.findMany({
    where: {
      member: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      member: {
        where: {
          userId: userId,
        },
        select: {
          role: true,
        },
      },
    },
  });
}


export async function updateWorkspace(name: string, userId: number, workspaceId: number, image?: string) {
    const updatedWorkspace = await prisma.workspace.update({
        where: {
            id: workspaceId,
            userId: userId,
        },
        data: {
            name,
            ...(image && { image }), // Only update image if provided
        },
    });

    return updatedWorkspace;
}

export async function getWorkspaceById(workspaceId:number) {
    const workspace = await prisma.workspace.findUnique({
        where: {
            id:workspaceId
        }
    });

    return workspace;
}

export async function deleteWorkspace(workspaceId:number) {
    const workspace = await prisma.workspace.delete({
        where:{
            id:workspaceId
        }
    })

    return workspace;
}

export async function resetWorkspaceInviteLink(workspaceId:number) {
    const workspace = await prisma.workspace.update({
        where:{
            id:workspaceId
        },
        data:{
            inviteCode:generateInviteCode(6)
        }
    })

    return workspace;
}

export async function joinWorkspace(workspaceId:number,userId:number,role?:UserRole) {
    const member = await prisma.member.create({
        data:{
            userId,
            workspaceId,
            role
        }
    })

    return member;
}