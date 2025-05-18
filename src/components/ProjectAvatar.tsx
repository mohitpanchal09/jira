import Image from "next/image"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "./ui/avatar"
type Props = {
    image?:string | null,
    name:string,
    className?:string
    fallbackClassname?:string
}

function ProjectAvatar({image,name,className,fallbackClassname}: Props) {
    if(image){
        return(
            <div className={
                cn("size-5 relative rounded-md overflow-hidden")
            }>
                <Image src={image} alt={name} className="object-cover" height={100} width={100}/>
            </div>
        )
    }
  return (
    <Avatar className={cn("size-5 rounded-md",className)}>
        <AvatarFallback className={cn("text-white bg-blue-600 font-semibold text-sm uppercase rounded-md",fallbackClassname)}>
            {name[0]}
        </AvatarFallback>
    </Avatar>
  )
}

export default ProjectAvatar