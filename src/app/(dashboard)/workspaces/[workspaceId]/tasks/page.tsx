import TaskViewSwitcher from '@/components/TaskViewSwitcher'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params:{
    workspaceId:string
  }
}

async function page({params}: Props) {
    const session = await getServerSession()
    if(!session) redirect('/sign-in')
      // const permission = await 
  return (
    <div className='h-full flex flex-col'>
        <TaskViewSwitcher hideAssigneeFilter/>
    </div>
  )
}

export default page