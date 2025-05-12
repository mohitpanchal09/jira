"use client";
import { workspaceSchema } from "@/validations/workspace.validations";
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
import { useRef } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useModalStore } from "@/store/modalStore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CreateWorkspaceFormProps {
  hideCancel?:boolean
}

export const CreateWorkspaceForm = ({ hideCancel }: CreateWorkspaceFormProps) => {
  const {closeCreateWorkspaceModal} = useModalStore()
  const router = useRouter()
  const form = useForm<z.infer<typeof workspaceSchema>>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      image:""
    },
  });
  const inputRef = useRef<HTMLInputElement>(null)
  const onSubmit = async (values: z.infer<typeof workspaceSchema>) => {
    try {
      const formData = new FormData()
      formData.append("name",values.name)
      if(values.image){
        formData.append("image",values.image)
      }
      const res = await axiosInstance.post("/workspace", formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      });
      console.log("🚀 ~ onSubmit ~ res:", res)
      toast.success("Workspace created successfully!");
      form.reset();
      closeCreateWorkspaceModal()
      const workspaceId = res.data.workspace.id
      router.refresh()
      router.push(`/workspaces/${workspaceId}`)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create workspace.");
    }
  };

  const handleImageChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0]
    if(file){
      form.setValue("image",file)
    }
  }

  return (
    <Card className="w-full h-full  border-none ">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new workspace
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
                    <Input {...field} placeholder="Enter workspace name" />
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
                          field.value instanceof File ? URL.createObjectURL(field.value)
                          :field.value
                        }
                        className="object-cover"
                        width={100}
                        height={100}
                        />
                      </div>
                    ):<Avatar className="size-[72px]">
                        <AvatarFallback>
                          <ImageIcon className="size-[36px] text-neutral-400"/>
                        </AvatarFallback>
                      </Avatar>}
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
                        // disabled={isPending}
                        />
                        <Button 
                        type="button"
                        // disabled={isPending}
                        variant={'teritary'}
                        size={'xs'}
                        className="w-fit mt-2"
                        onClick={()=>inputRef.current?.click()}
                        >
                          Upload Image
                        </Button>

                      </div>
                  </div>
                </div>
              )}
            />
          </div>
          <Separator className="my-7"/>
          <div  className="flex items-center justify-between">
              <Button type="button" size={'lg'} variant={'secondary'} onClick={closeCreateWorkspaceModal} className={cn(hideCancel && "invisible")}>
                Cancel
              </Button>
              <Button type="submit" size={'lg'} disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "creating" : "Create Workspace"}
              </Button>
          </div>
        </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
