"use client"
import React from 'react'
import UserButton from './UserButton'
import MobileSidebar from './MobileSidebar'
import { usePathname } from 'next/navigation'

type Props = {}

const pathnameMap={
  "tasks":{
    title:"My Tasks",
    description:"View all of your tasks"
  },
  "project":{
    title:"My Project",
    description:"View tasks of your project"
  }
}

const defaultMap = {
  title:"Home",
  description:"Monitor all your projects and tasks here"
}

function Navbar({}: Props) {
  const pathname = usePathname()
  const pathnameParts = pathname.split('/')
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap
  const {title,description} = pathnameMap[pathnameKey] || defaultMap
  return (
    <nav className='pt-4 px-6 flex items-center justify-between'>
        <div className='flex-col hidden lg:flex'>
            <h1 className='text-2xl font-semibold'>{title}</h1>
            <p className='text-muted-foreground'>{description}</p>

        </div>
        <MobileSidebar/>
        <UserButton/>
    </nav>
  )
}

export default Navbar