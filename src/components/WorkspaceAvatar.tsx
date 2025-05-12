import Image from "next/image"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "./ui/avatar"
type Props = {
    image?:string,
    name:string,
    className?:string
}

function WorkspaceAvatar({image,name,className}: Props) {
    if(image){
        return(
            <div className={
                cn("size-10 relative rounded-md overflow-hidden")
            }>
                <Image src={image} alt={name} className="object-cover" height={100} width={100}/>
            </div>
        )
    }
  return (
    <Avatar className={cn("size-10 rounded-md",className)}>
        <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase rounded-md">
            {name[0]}
        </AvatarFallback>
    </Avatar>
  )
}

export default WorkspaceAvatar