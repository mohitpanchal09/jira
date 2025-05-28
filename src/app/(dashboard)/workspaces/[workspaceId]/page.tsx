import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Analytics from "@/components/Analytics";
import { ProjectList } from "@/components/ProjectList";
import { TaskList } from "@/components/TaskList";
import { prisma } from "@/lib/db";
import { isUserWorkspaceAdmin } from "@/middleware/role";
import { AuthOptions, getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function page({ params }: { params: { workspaceId: string } }) {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session) redirect("/sign-in");
  const workspaceId = params.workspaceId;
  const tasks = await prisma.task.findMany({
    where:{
      workspaceId:Number(workspaceId)
    },
    include:{
      assignee:true,
      project:true
    },
     take: 5
  })
  const projects = await prisma.project.findMany({
    where:{
      workspaceId:Number(workspaceId)
    }
  })
  const permission = await isUserWorkspaceAdmin(Number(workspaceId),Number(session.user.id))
  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList tasks={tasks} total={tasks.length} permission={permission}/>
        <ProjectList projects={projects} total={projects.length} permission={permission}/>
      </div>
    </div>
  );
}

export default page;

