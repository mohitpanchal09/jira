import { prisma } from "@/lib/db";

export async function getProjects(workspaceId: number) {

    return await prisma.project.findMany({
        where: {
            workspaceId
        }
    })
}

export async function createProject(name: string, userId: number, image: string,workspaceId:number) {
    return await prisma.project.create({
        data: {
            name,
            userId,
            image,
            workspaceId
        }
    })

}
export async function getProjectById(projectId: number) {
    return await prisma.project.findUnique({
        where: {
            id: projectId
        }
    });
}

export async function deleteProject(projectId: number) {
    return await prisma.project.delete({
        where: {
            id: projectId
        }
    });
}
export async function updateProject(projectId: number, name?: string, image?: string, workspaceId?: number) {
    console.log("🚀 ~ updateProject ~ image:", image)
    return await prisma.project.update({
        where: {
            id: projectId
        },
        data: {
            name,
            image,
            workspaceId
        }
    });
}
