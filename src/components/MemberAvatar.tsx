import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";
type Props = {
  name: string | null;
  className?: string;
  fallbackClassName?: string;
};

function MemberAvatar({ name, className, fallbackClassName }: Props) {
  return (
    <Avatar
      className={cn(
        "size-5  border border-neutral-300 rounded-full",
        className
      )}
    >
      <AvatarFallback
        className={cn(
          "bg-neutral-200 font-md text-neutral-500 flex items-center justify-center",
          fallbackClassName
        )}
      >
        { name ? name.charAt(0).toUpperCase() :""}
      </AvatarFallback>
    </Avatar>
  );
}

export default MemberAvatar;
