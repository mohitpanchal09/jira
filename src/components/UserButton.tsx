"use client";

import { useEffect } from "react";
import { Loader, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";



function UserButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  // Show loader while session is loading
  if (status === "loading") {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-300 border-neutral-200">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const username = session?.user?.username  || "User";
  const email = session?.user?.email;
  const avatarFallback = username.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 transition-75 border border-neutral-300">
          <AvatarFallback className="hover:bg-neutral-300 bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        className="w-60"
        sideOffset={10}
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-4">
          <Avatar className="size-10 transition-75 border border-neutral-300">
            <AvatarFallback className="hover:bg-neutral-300 bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-neutral-900">
              {username}
            </p>
            <p className="text-xs text-neutral-500">{email}</p>
          </div>
        </div>
        <Separator />
        <DropdownMenuItem
          className="h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
