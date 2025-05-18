import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import JoinWorkspace from "@/components/JoinWorkspace";
import { getWorkspaceById } from "@/services/workspaceService";
import { AuthOptions, getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
  params: {
    workspaceId: string;
    inviteCode:string
  };
};

export default async function page({ params }: Props) {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session) redirect("/sign-in");
  const workspaceInfo = await getWorkspaceById(Number(params.workspaceId));
  if (!workspaceInfo)
    return (
      <div className="flex items-center justify-center">
        Workspace not found
      </div>
    );
  const initialValue =  {
    workspaceId:workspaceInfo.id,
    name:workspaceInfo.name,
    
  }
  return (
    <div>
      <JoinWorkspace initialValues={initialValue} inviteCode={params.inviteCode}/>
    </div>
  );
}
