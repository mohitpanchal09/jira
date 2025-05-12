"use client"

import { MenuIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import Sidebar from "./Sidebar"

type Props = {}

function MobileSidebar({}: Props) {
  return (
    <Sheet>
        <SheetTrigger asChild>
            <Button  variant={'secondary'} className="lg:hidden size-8">
                <MenuIcon className="size-4 text-neutral-500"/>
            </Button>
        </SheetTrigger>
        <SheetContent side={'left'} className="p-0">
            <Sidebar/>
        </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar