import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { CreateWorkspaceForm } from '@/components/CreateWorkspaceForm'
import { AuthOptions, getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'


type Props = {}

async function page({}: Props) {
    const session = await getServerSession(authOptions as AuthOptions)
    if(!session) redirect('/sign-in')
  return (
    <div className='w-full lg:max-w-xl'>
        <CreateWorkspaceForm hideCancel={true}/>
    </div>
  )
}

export default page