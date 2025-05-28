import { Status } from "@/generated/prisma"

export enum UserRole{
    ADMIN = "ADMIN" ,
    MEMBER ="MEMBER"
}

export type Workspace = {
    name:string,
    image?: string | null,
    userId:number,
    id:number,
    inviteCode?:string | null
}
export type Project = {
    name:string,
    image?: string | null,
    userId:number,
    workspaceId:number,
    id:number,
}

export type User = {
    id:number,
    email:string | null,
    username:string | null,
    firstname?:string | null,
    lastname?:string | null,
    createdAt:Date,
    password?:string | null
}

export type Task = {
    name:string,
    assigneeId:number,
    workspaceId:number,
    id:number,
    description:string,
    projectId:number,
    assignee:User,
    project:Project,
    position:number,
    dueDate:Date
    status:Status
    userRoles?:string[]
}

export { Status };