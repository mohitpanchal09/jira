import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import ProjectAvatar from '@/components/ProjectAvatar'
import TaskViewSwitcher from '@/components/TaskViewSwitcher'
import { Button } from '@/components/ui/button'
import { getProjectById } from '@/services/projectService'
import { PencilIcon } from 'lucide-react'
import { AuthOptions, getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {params:{
    projectId:string,
    workspaceId:string
}}

async function page({params}: Props) {
    const session = await getServerSession(authOptions as AuthOptions)
    if (!session) redirect("/sign-in");

    const data = await getProjectById(Number(params.projectId))
    if(!data){
      throw new Error("Project not found")
    }
    const initialValues = {
      name:data.name,
      id:data.id,
      image:data.image
    }
    
  return (
    <div className='flex flex-col gap-y-2'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-x-2'>
          <ProjectAvatar name={initialValues.name} className='size-8' image={initialValues.image || undefined}/>
          <p className='text-lg font-semibold'> {initialValues.name}</p>
        </div>
        <div>
          <Button variant={'secondary'} size={'sm'} asChild >
            <Link href={`/workspaces/${params.workspaceId}/projects/${params.projectId}/settings`}>
            <PencilIcon/> 
            Edit Project
            </Link>
           
            </Button>
        </div>
      </div>
      <TaskViewSwitcher/>
    </div>
  )
}

export default page