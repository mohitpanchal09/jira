import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { Navigation } from '@/components/Navigation'
import WorkspaceSwitcherWrapper from './WorkspaceSwitcherWrapper'
import Projects from './Projects'

type Props = {}

function Sidebar({}: Props) {
  return (
    <aside className='h-full bg-neutral-100 p-4 w-full'>
        <Link href={'/'}>
        <Image src={'/logo.svg'}alt='logo' width={164} height={48}/>
        </Link>
        <Separator className='my-4'/>
        <WorkspaceSwitcherWrapper/>
        <Separator className='my-4'/>
        <Navigation/>
        <Separator className='my-4'/>
        <Projects/>
    </aside>
  )
}

export default Sidebar