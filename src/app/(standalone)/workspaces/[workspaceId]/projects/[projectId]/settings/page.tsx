import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import { EditProjectForm } from '@/components/EditProjectForm'
import { isUserWorkspaceAdmin } from '@/middleware/role'
import { getProjectById } from '@/services/projectService'
import { AuthOptions, getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params:{
    projectId:string
    workspaceId:string
  }
}

export default async function page({params}: Props) {
  const session = await getServerSession(authOptions as AuthOptions)
  if(!session) redirect('/login')
    const initialValues = await getProjectById(Number(params.projectId))
  if(!initialValues){
    return <div className='w-full lg:max-w-xl flex items-center justify-center'>
      Data not found
    </div>
  }
  const permission = await isUserWorkspaceAdmin(Number(params.workspaceId),session?.user.id)
  return (
    <div className='w-full lg:max-w-xl'>
      <EditProjectForm initialValues={initialValues} permission={permission}/>
    </div>
  )
}