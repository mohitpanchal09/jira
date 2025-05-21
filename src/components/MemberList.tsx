"use client";
import React, { Fragment, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeftIcon, Loader2, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { Separator } from "./ui/separator";
import MemberAvatar from "./MemberAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/useConfirm";
import { axiosInstance } from "@/lib/axios";
import { UserRole } from "@/types";
import { toast } from "sonner";

type Props = {
  workspaceId: string;
  members: any;
  hasPermission: {
    permission: boolean;
    message: string;
  };
};
type MemberUser = {
  id: number;
  email: string;
  username: string;
  firstname?: string;
  lastname?: string;
};

type Member = {
  id: number;
  role: "ADMIN" | "MEMBER";
  userId: number;
  workspaceId: number;
  user: MemberUser;
};

function MemberList({ workspaceId, members, hasPermission }: Props) {
  const [loading, setLoading] = useState(false);
  const [loadingMemberId, setLoadingMemberId] = useState<number | null>(null); // Track the member being processed
  const [ConfirmDialog, confirm] = useConfirm(
    "Confirm to delete",
    "Once deleted, you will not be able to recover this member!",
    "delete"
  );
  const [ChangeRoleDialog, confirmChangeRole] = useConfirm(
    "Confirm to change role",
    "Are you sure you want to change the role of this member?",
    "teritary"
  );

  const router = useRouter();

  const handleChangeRole = async (member: Member, role: UserRole) => {
    if (!hasPermission.permission) {
      toast.error("You do not have permission");
      return;
    }
    const ok = await confirmChangeRole();
    if (ok) {
      try {
        setLoading(true);
        setLoadingMemberId(member.id); // Set the member as being processed
        const res = await axiosInstance.patch(`/member/${member.id}`, { role });
        toast.success("Workspace updated successfully!");
        router.refresh?.();
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || "Failed to update workspace."
        );
      } finally {
        setLoading(false);
        setLoadingMemberId(null); // Reset the loading state
      }
    }
  };

  const handleRemove = async (member: Member) => {
    if (!hasPermission.permission) {
      toast.error("You do not have permission");
      return;
    }
    const ok = await confirm();
    if (ok) {
      try {
        setLoading(true);
        setLoadingMemberId(member.id); // Set the member as being processed
        const res = await axiosInstance.delete(`/member/${member.id}`);
        toast.success("Workspace updated successfully!");
        router.refresh?.();
      } catch (err: any) {
        toast.error(
          err?.response?.data?.message || "Failed to update workspace."
        );
      } finally {
        setLoading(false);
        setLoadingMemberId(null); // Reset the loading state
      }
    }
  };

  return (
    <>
      <ConfirmDialog />
      <ChangeRoleDialog />
      <Card className="w-full h-full border-none shadow-none">
         {!hasPermission.permission && <p className="text-center text-muted-foreground pt-4">You do not have permission to operate this workspace</p>}
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            variant={"secondary"}
            size={"sm"}
            onClick={() => {
              router.push(`/workspaces/${workspaceId}`);
            }}
          >
            <ArrowLeftIcon className="size-4 mr-2" /> Back
          </Button>
          <CardTitle className="text-xl font-bold">Members list</CardTitle>
        </CardHeader>
        <div className="px-7">
          <Separator />
        </div>
        <CardContent className="p-7">
          {members.length > 0 &&
            members.map((member: any, index: number) => (
              <Fragment key={index}>
                <div className="flex items-center gap-2">
                  <MemberAvatar
                    name={member.user.username}
                    className="size-10"
                    fallbackClassName="text-lg"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {member.user.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>
                  {loading && loadingMemberId === member.id ? (
                    <Loader2 className="animate-spin ml-auto" />
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className="ml-auto"
                          variant={"secondary"}
                          size={"icon"}
                        >
                          <MoreVerticalIcon className="text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="bottom" align="end">
                        <DropdownMenuItem
                          className="font-medium cursor-pointer"
                          onClick={() =>
                            handleChangeRole(member, UserRole.ADMIN)
                          }
                          disabled={!hasPermission.permission}
                        >
                          Set as administrator
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="font-medium cursor-pointer"
                          onClick={() =>
                            handleChangeRole(member, UserRole.MEMBER)
                          }
                          disabled={!hasPermission.permission}

                        >
                          Set as member
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="font-medium cursor-pointer text-red-500"
                          onClick={() => handleRemove(member)}
                          disabled={!hasPermission.permission}

                        >
                          Remove {member.user.name}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                {index < members.length - 1 && <Separator className="my-2.5" />}
              </Fragment>
            ))}
        </CardContent>
      </Card>
    </>
  );
}

export default MemberList;
