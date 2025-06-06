import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import MemberList from "@/components/MemberList";
import { isUserWorkspaceAdmin } from "@/middleware/role";
import { getMembers } from "@/services/memberService";
import { AuthOptions, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    workspaceId: string;
  };
};

async function page({ params }: Props) {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session) redirect("/sign-in");
  const workspaceId = Number(params.workspaceId);
  const members = await getMembers(workspaceId);
  if (members.length == 0)
    return (
      <div className="flex items-center justify-center">No members found</div>
    );
  const hasPermission = await isUserWorkspaceAdmin(
    workspaceId,
    session.user.id
  );
  return (
    <div className="w-full lg:max-w-xl">
      <MemberList
        workspaceId={params.workspaceId}
        members={members}
        hasPermission={hasPermission}
      />
    </div>
  );
}

export default page;
