import { AuthOptions, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import Client from "./Client";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";


async function page() {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session) redirect("/sign-in");
  

  return (
    <>
      <Client/>
    </>
  );
}

export default page;
