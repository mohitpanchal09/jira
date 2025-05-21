"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/store/modalStore";
import useParamsHook from "@/hooks/useParams";
import { taskSchema } from "@/validations/task.validations";
import { axiosInstance } from "@/lib/axios";
import DatePicker from "./DatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import MemberAvatar from "./MemberAvatar";
import { Status } from "@/types";
import ProjectAvatar from "./ProjectAvatar";
import { Label } from "./ui/label";

interface CreateTaskFormProps {
  hideCancel?: boolean;
  projectOptions: { id: string; name: string; image: string }[];
  memberOptions: { id: string; name: string }[];
}

export const CreateTaskForm = ({
  hideCancel,
  projectOptions,
  memberOptions,
}: CreateTaskFormProps) => {
  console.log("🚀 ~ projectOptions:", projectOptions);
  console.log("🚀 ~ memberOptions:", memberOptions);
  const params = useParamsHook();
  const workspaceId = String(params.workspaceId);
  const router = useRouter();
  const { closeTasktModal } = useModalStore();
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema.omit({ workspaceId: true })),
    defaultValues: {
      workspaceId,
    },
  });

  const onSubmit = async (values: z.infer<typeof taskSchema>) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        dueDate: values.dueDate,
        assigneeId: values.assigneeId,
        status: values.status,
        workspaceId: params.workspaceId,
        projectId: params.projectId,
      };

      const res = await axiosInstance.post("/task", payload);

      toast.success("Task created successfully!");
      form.reset();
      closeTasktModal();
      router.refresh();
    } catch (error: any) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      toast.error(error?.response?.data?.message || "Failed to create task.");
    }
  };

  return (
    <Card className="w-full h-full border-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new Task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <Separator />
      </div>
      <CardContent className="p-7">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the task" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    {/* TODO: Date picker */}
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {memberOptions && (
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <Label className="mr-auto text-muted-foreground">{(memberOptions.find((item)=>item.id==field.value))?.name || "Select Assignee"}</Label>
                        </SelectTrigger>
                        <SelectContent>
                          {memberOptions.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {" "}
                              {/* Use member.id as value */}
                              <div className="flex items-center gap-x-2">
                                <MemberAvatar
                                  className="size-6"
                                  name={member.name}
                                />
                                {member.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Status.BACKLOG}>Backlog</SelectItem>
                        <SelectItem value={Status.TODO}>Todo</SelectItem>{" "}
                        <SelectItem value={Status.IN_PROGRESS}>
                          In Progress
                        </SelectItem>
                        <SelectItem value={Status.IN_REVIEW}>
                          In Review
                        </SelectItem>{" "}
                        <SelectItem value={Status.DONE}>Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {projectOptions && (
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectOptions.map((project) => (
                            <SelectItem key={project.id} value={project.name}>
                              <div className="flex items-center gap-x-2">
                                <ProjectAvatar
                                  className="size-6"
                                  name={project.name}
                                />
                                {project.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Separator />
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="secondary"
                onClick={closeTasktModal}
                className={hideCancel ? "invisible" : ""}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};
