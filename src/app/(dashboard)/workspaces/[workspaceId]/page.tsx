import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { AuthOptions, getServerSession } from "next-auth"
import { redirect } from "next/navigation"

async function page({params}: {params : {workspaceId:string}}) {
  const session = await getServerSession(authOptions as AuthOptions)
  if(!session) redirect('/sign-in')
  const workspaceId = params.workspaceId
  return (
    <div>{workspaceId}</div>
  )
}

export default page