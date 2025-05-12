"use client"

import {  Loader } from "lucide-react"

const LoaderPage=()=>{

    return (
        <div className="h-screen flex flex-col gap-y-2 items-center justify-center">
                <Loader className="size-7 animate-spin text-muted-foreground"/>
        </div>
    )

}

export default LoaderPage