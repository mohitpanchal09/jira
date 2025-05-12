import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { EditProjectForm } from '@/components/EditProjectForm'
import { getProjectById } from '@/services/projectService'
import { AuthOptions, getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params:{
    projectId:string
  }
}

export default async function page({params}: Props) {
  const session = getServerSession(authOptions as AuthOptions)
  if(!session) redirect('/login')
    const initialValues = await getProjectById(Number(params.projectId))
  if(!initialValues){
    return <div className='w-full lg:max-w-xl flex items-center justify-center'>
      Data not found
    </div>
  }
  return (
    <div className='w-full lg:max-w-xl'>
      <EditProjectForm initialValues={initialValues}/>
    </div>
  )
}