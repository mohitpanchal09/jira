import { AuthOptions, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Workspace } from "@/components/WorkspaceSwitcher";
import { getWorkspaces } from "@/services/workspaceService";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session){
   redirect("/home");
  }else{
    let workspaces: Workspace[] = [];
    workspaces = session?.user?.id ? await getWorkspaces(session?.user?.id) : [];
    if(workspaces.length===0){
      redirect('/workspaces/create')
    }else{
      redirect(`/workspaces/${workspaces[0].id}`)
    }
  } 
  
}
