import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { EditWorkspaceForm } from "@/components/EditWorkspaceForm";
import { isUserWorkspaceAdmin } from "@/middleware/role";
import { getWorkspaceById } from "@/services/workspaceService";
import { AuthOptions, getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
  params: {
    workspaceId: string;
  };
};

async function page({ params }: Props) {
  const workspaceId = Number(params.workspaceId);
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session) redirect("/sign-in");

  const workspace = await getWorkspaceById(workspaceId);
  if(!workspace) return <div className="flex items-center justify-center">Workspace not found</div>
  const hasPermission = await isUserWorkspaceAdmin(workspaceId,session.user.id)
  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={workspace} hideCancel={true} hasPermission={hasPermission}/>
    </div>
  );
}

export default page;
