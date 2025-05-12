"use client"

import { RiAddCircleFill } from 'react-icons/ri'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import WorkspaceAvatar from './WorkspaceAvatar'
import {  useRouter } from 'next/navigation'
import { useModalStore } from '@/store/modalStore'
import useParamsHook from '@/hooks/useParams'

export type Workspace = {
  id: number
  name: string
  image: string | null
}

type Props = {
  workspaces: Workspace[]
}

function WorkspaceSwitcher({ workspaces }: Props) {
  const {openCreateWorkspaceModal} = useModalStore()
  const params = useParamsHook()
  const router = useRouter()


  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`)
  }

  return (
    <div className='flex flex-col gap-y-2'>
      <div className='flex items-center justify-between'>
        <p>Workspaces</p>
        <RiAddCircleFill className='size-5 cursor-pointer' onClick={openCreateWorkspaceModal}/>
      </div>
      <Select onValueChange={onSelect} value={String(params.workspaceId)}>
        <SelectTrigger className='w-full bg-neutral-200 font-medium p-1'>
          <SelectValue placeholder="Select a workspace" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.map((item) => (
            <SelectItem key={item.id} value={String(item.id)}>
              <div className='flex justify-start items-center gap-3 font-medium'>
                <WorkspaceAvatar name={item.name} image={item.image || ''} />
                <span className='truncate'>{item.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default WorkspaceSwitcher
