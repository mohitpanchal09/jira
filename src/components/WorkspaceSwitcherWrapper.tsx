// app/components/WorkspaceSwitcherWrapper.tsx
import { AuthOptions, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { getWorkspaces } from "@/services/workspaceService";
import WorkspaceSwitcher, { Workspace } from "./WorkspaceSwitcher";

export default async function WorkspaceSwitcherWrapper() {
  const session = await getServerSession(authOptions as AuthOptions);
  let workspaces:Workspace[] =[]
    workspaces = session?.user?.id
    ? await getWorkspaces(session.user.id)
    : [];

  return <WorkspaceSwitcher workspaces={workspaces} />;
}
