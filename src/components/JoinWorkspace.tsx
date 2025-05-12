"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";

type Props = {
  initialValues: {
    name: string;
    workspaceId: number;
  };
  inviteCode: string;
};

function JoinWorkspace({ initialValues, inviteCode }: Props) {
const [disabled,setDisabled] = useState(false)
  const router = useRouter();

  const onSubmit = async () => {
    try {
        setDisabled(true)

      const res = await axiosInstance.post(
        `workspace/${initialValues.workspaceId}/join`,
        { inviteCode }
      );
      toast.success(res.data.message || "Successfully joined workspace!");
      router.push(`/workspaces/${initialValues.workspaceId}`);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to join workspace."
      );
    }finally{
        setDisabled(false)
    }
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle>Join Workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join{" "}
          <strong>{initialValues.name}</strong>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-y-2 gap-x-2">
          <Button
            className="w-full lg:w-fit"
            variant={"secondary"}
            type="button"
            asChild
            size={"lg"}
          >
            <Link href={"/"}>Cancel</Link>
          </Button>
          <Button
            className="w-full lg:w-fit"
            size={"lg"}
            type="button"
            onClick={onSubmit}
            disabled={disabled}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default JoinWorkspace;
