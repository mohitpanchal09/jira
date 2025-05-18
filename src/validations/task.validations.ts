import { Status } from '@/types'
import {z} from 'zod'

export const taskSchema = z.object({
    name:z.string().min(1,'Required'),
    status:z.nativeEnum(Status,{required_error:"required"}),
    workspaceId:z.string().min(1,"Required"),
    projectId:z.string().min(1,"Required"),
    dueDate:z.coerce.date(),
    assigneeId:z.string().trim().min(1,'Required'),
    description:z.string().optional()
})

export const updateTaskSchema = z.object({
    id:z.string().min(1,'Required'),
    name:z.string().min(1,'Required'),
    status:z.nativeEnum(Status,{required_error:"required"}),
    workspaceId:z.string().min(1,"Required"),
    projectId:z.string().min(1,"Required"),
    dueDate:z.coerce.date(),
    assigneeId:z.string().trim().min(1,'Required'),
    description:z.string().optional()
})