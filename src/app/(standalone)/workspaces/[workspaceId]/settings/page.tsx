import { EditWorkspaceForm } from "@/components/EditWorkspaceForm";
import { getWorkspaceById } from "@/services/workspaceService";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
  params: {
    workspaceId: string;
  };
};

async function page({ params }: Props) {
  const workspaceId = Number(params.workspaceId);
  const session = await getServerSession();
  if (!session) redirect("/sign-in");
  const workspace = await getWorkspaceById(workspaceId);
  if(!workspace) return <div className="flex items-center justify-center">Workspace not found</div>

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={workspace} hideCancel={true}/>
    </div>
  );
}

export default page;
