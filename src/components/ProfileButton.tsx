"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {};

function ProfileButton({}: Props) {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      console.log("🚀 ~ ProfileButton ~ session:", session);
      setSession(session);
    };

    fetchSession();
  }, []);

  if (!session) return null;

  return (
    <div className="mt-4">
      <Separator className="mb-2" />
      <Link
        href="/my-profile"
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-200 transition"
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden border border-neutral-400">
          <Avatar className="size-10 transition-75 border border-neutral-300">
            {session.user.image ? (
              <AvatarImage
                src={session.user.image}
                alt={session.user.username}
                className="object-cover m-auto"
              />
            ) : (
              <AvatarFallback className="hover:bg-neutral-300 bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                {session.user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        <div className="text-sm font-medium text-neutral-800 truncate">
          {session.user?.username}
        </div>
      </Link>
    </div>
  );
}

export default ProfileButton;
