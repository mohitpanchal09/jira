"use client";

import { updateWorkspaceSchema } from "@/validations/workspace.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { ArrowLeftIcon, CopyIcon, ImageIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Workspace } from "@/types";
import { useConfirm } from "@/hooks/useConfirm";
import { resetWorkspaceInviteLink } from "@/services/workspaceService";

interface EditWorkspaceFormProps {
  hideCancel?: boolean;
  initialValues: Workspace;
  hasPermission:{
    permission:boolean,
    message:string
  };
}

export const EditWorkspaceForm = ({
  hideCancel,
  initialValues,
  hasPermission
}: EditWorkspaceFormProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Confirm to delete",
    "Once deleted, you will not be able to recover this workspace!",
    "delete"
  );
  const [ResetDialog, confirmReset] = useConfirm(
    "Confirm to reset",
    "This will invalidate the current link!",
    "delete"
  );
  const router = useRouter();
  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.image ?? undefined,
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (values: z.infer<typeof updateWorkspaceSchema>) => {
    if (!hasPermission.permission){
      toast.error("You do not have permission")
      return;
    } 
    try {
      const formData = new FormData();
      if (values.name) {
        formData.append("name", values.name);
      }
      if (values.image) {
        formData.append("image", values.image);
      }
      const res = await axiosInstance.patch(
        `/workspace/${initialValues.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Workspace updated successfully!");
      form.reset();
      const workspaceId = res.data.workspace.id;
      router.refresh()
      router.push(`/workspaces/${workspaceId}`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update workspace."
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const handleDelete = async () => {
     if (!hasPermission.permission){
      toast.error("You do not have permission")
      return;
    } 
    const ok = await confirm();
    if (ok) {
      setIsDeleting(true);
      try {
        await axiosInstance.delete(`/workspace/${initialValues.id}`);
        toast.success("Workspace deleted successfully!");
        router.refresh()
        router.push("/");
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to delete workspace."
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };
  const handleResetInviteLink = async () => {

     if (!hasPermission.permission){
      toast.error("You do not have permission")
      return;
    } 
    
    const ok = await confirmReset();
    if (ok) {
      setIsResetting(true);
      try {
        const res =await axiosInstance.post(`/workspace/${initialValues.id}`,initialValues.id);
        toast.success("Invite link has been reset!");
        router.refresh()
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to reset invite link."
        );
      } finally {
        setIsResetting(false);
      }
    }
  };

  const fullInviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/workspaces/${initialValues.id}/join/${initialValues.inviteCode}`;


  const handleCopyInviteLink=()=>{
    navigator.clipboard.writeText(fullInviteLink)
    .then(()=>{
      toast.success("Invite link copied")
    })
  }

  return (
    <div className="flex flex-col gap-y-4">
      <ConfirmDialog />
      <ResetDialog />

      <Card className="w-full h-full border-none">
        {!hasPermission.permission && <p className="text-center text-muted-foreground mt-4">You do not have permission to operate this workspace</p>}
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => router.push(`/workspaces/${initialValues.id}`)}
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <Separator />
        </div>
        <CardContent className="p-7">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter workspace name" disabled={!hasPermission.permission}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              alt="logo"
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              className="object-cover"
                              width={100}
                              height={100}
                              
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Workspace Icon</p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, SVG or JPEG, max 1mb
                          </p>
                          <input
                            type="file"
                            className="hidden"
                            accept=".jpg, .jpeg, .png, .svg"
                            ref={inputRef}
                            onChange={handleImageChange}
                          />
                          <Button
                            type="button"
                            variant={"teritary"}
                            size={"xs"}
                            className="w-fit mt-2"
                            onClick={() => inputRef.current?.click()}
                            disabled={!hasPermission.permission}
                          >
                            Upload Image
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <Separator className="my-7" />
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  size={"lg"}
                  variant={"secondary"}
                  className={cn(hideCancel && "invisible")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size={"lg"}
                  disabled={form.formState.isSubmitting || !hasPermission.permission}
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
     
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add the members to your workspace
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input disabled value={fullInviteLink}/>
                <Button
                onClick={handleCopyInviteLink}
                variant={'secondary'}
                className="size-12"
                >
                  <CopyIcon/>
                </Button>
              </div>
            </div>
            <Separator className="my-7"/>

            <Button
              className="mt-6 w-fit ml-auto bg-red-600"
              type="button"
              size={"sm"}
              onClick={handleResetInviteLink}
              variant={"delete"}
              disabled={isResetting || !hasPermission.permission}
            >
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reset in progress...
                </>
              ) : (
                "Reset invite code"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irreversible and will remove all
              associated data
            </p>
            <Separator className="my-7"/>
            <Button
              className="mt-6 w-fit ml-auto bg-red-600"
              type="button"
              size={"sm"}
              onClick={handleDelete}
              variant={"delete"}
              disabled={isDeleting || !hasPermission.permission}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Workspace"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};