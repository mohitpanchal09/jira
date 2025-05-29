import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { EditProfileForm } from "@/components/EditProfileForm";
import { prisma } from "@/lib/db";
import { AuthOptions, getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {};

async function page({}: Props) {
  const session = await getServerSession(authOptions as AuthOptions);
  if (!session) redirect("/sign-in");
  const user = await prisma.user.findUnique({
    where: {
      username: session?.user.username,
    },
    select: {
      id: true,
      email: true,
      username: true,
      firstname: true,
      lastname: true,
      provider: true,
      createdAt: true,
      image:true
    },
  });
  if(!user) return <div>User not found</div>


  return (
    <div className="w-full lg:max-w-xl">
      <EditProfileForm user={user} />
    </div>
  );
}

export default page;
