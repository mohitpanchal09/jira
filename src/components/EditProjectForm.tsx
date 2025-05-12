"use client";

import { updateProjectSchema } from "@/validations/project.validations";
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
import { Project } from "@/types";
import { useConfirm } from "@/hooks/useConfirm";

interface EditProjectFormProps {
  hideCancel?: ()=>void;
  initialValues: Project;
}

export const EditProjectForm = ({
  hideCancel,          
  initialValues,
}: EditProjectFormProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Confirm to delete",
    "Once deleted, you will not be able to recover this project!",
    "delete"
  );
  const router = useRouter();
  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.image ?? undefined,
    },
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (values: z.infer<typeof updateProjectSchema>) => {
    try {
      const formData = new FormData();
      if (values.name) {
        formData.append("name", values.name);
      }
      if (values.image) {
        formData.append("image", values.image);
      }
      const res = await axiosInstance.patch(
        `/project/${initialValues.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Project updated successfully!");
      form.reset();
      const projectId = res.data.project.id;
      const workspaceId = res.data.project.workspaceId
      router.refresh()
      router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update project."
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
    const ok = await confirm();
    if (ok) {
      setIsDeleting(true);
      try {
        await axiosInstance.delete(`/project/${initialValues.id}`);
        toast.success("Project deleted successfully!");
        router.refresh()
        router.push("/");
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to delete project."
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };



  return (
    <div className="flex flex-col gap-y-4">
      <ConfirmDialog />

      <Card className="w-full h-full border-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.id}`)}
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
                      <FormLabel>Project name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter project name" />
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
                          <p className="text-sm">Project Icon</p>
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
                  disabled={form.formState.isSubmitting}
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
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a project is irreversible and will remove all
              associated data
            </p>
            <Separator className="my-7"/>
            <Button
              className="mt-6 w-fit ml-auto bg-red-600"
              type="button"
              size={"sm"}
              onClick={handleDelete}
              variant={"delete"}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Project"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};