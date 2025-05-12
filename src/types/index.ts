export enum UserRole{
    ADMIN = "ADMIN" ,
    MEMBER ="MEMBER"
}

export type Workspace = {
    name:string,
    image?: any,
    userId:number,
    id:number,
    inviteCode?:string | null
}
export type Project = {
    name:string,
    image?: any,
    userId:number,
    workspaceId:number,
    id:number,
}

export enum Status {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_REVIEW = "IN_REVIEW",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE"
}