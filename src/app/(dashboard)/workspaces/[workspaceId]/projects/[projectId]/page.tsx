import { AuthOptions, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import Client from "./Client";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { isUserWorkspaceAdminOrCreatorOrProjectCreator } from "@/middleware/role";

type Props ={
  params:{
    workspaceId:string,
    projectId:string
  }
}

async function page({params}:Props) {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session) redirect("/sign-in");

  const permission = await isUserWorkspaceAdminOrCreatorOrProjectCreator(Number(params.workspaceId),session.user.id,Number(params.projectId))

  return (
    <>
      <Client permission={permission}/>
    </>
  );
}

export default page;
