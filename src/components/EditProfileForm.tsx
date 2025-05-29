"use client";

import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import Image from "next/image";
import { useRef } from "react";
import { ImageIcon } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { User } from "@/types";
import { updateProfileSchema } from "@/validations/user.validations";
import { useSession } from "next-auth/react";
import { passwordChangeSchema } from "@/validations/passwordChange.validations";
import { AuthProvider } from "@/generated/prisma";

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
type PasswordChangeSchema = z.infer<typeof passwordChangeSchema>;

interface EditProfileFormProps {
  user: User;
}

export const EditProfileForm = ({ user }: EditProfileFormProps) => {
  const { update: updateSession } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      email: user.email || "",
      username: user.username || "",
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      image: user.image || undefined,
    },
  });

  const passwordForm = useForm<PasswordChangeSchema>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handleProfileSubmit = async (values: UpdateProfileSchema) => {
    try {
      const formData = new FormData();
      if (values.username) formData.append("username", values.username);
      if (values.firstname) formData.append("firstname", values.firstname);
      if (values.lastname) formData.append("lastname", values.lastname);
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      const response = await axiosInstance.patch(
        `/profile/${user.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Profile updated successfully!");

      await updateSession({
        id: response.data.user.id,
        username: response.data.user.username,
        image: response.data.user.image,
        email: response.data.user.email,
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update profile."
      );
    }
  };

  const handlePasswordSubmit = async (values: PasswordChangeSchema) => {
    if (values.newPassword !== values.confirmNewPassword) {
      toast.error("New Password and Confirm Password do not match.");
      return;
    }

    try {
      const payload = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };

      await axiosInstance.patch(`/profile/${user.id}/change-password`, payload);
      toast.success("Password changed successfully!");
      passwordForm.reset();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to change password."
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      {/* Profile Form */}
      <Card className="w-full shadow-none">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="p-7">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(handleProfileSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-5">
                <FormField
                  control={form.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your first name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your last name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="flex items-center gap-x-5">
                    {field.value ? (
                      <div className="size-[72px] relative rounded-md overflow-hidden">
                        <Image
                          alt="Profile"
                          src={
                            field.value instanceof File
                              ? URL.createObjectURL(field.value)
                              : field.value
                          }
                          className="object-cover"
                          width={72}
                          height={72}
                        />
                      </div>
                    ) : (
                      <Avatar className="size-[72px]">
                        <AvatarFallback>
                          <ImageIcon className="size-[36px] text-neutral-400" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <p className="text-sm">Profile Picture</p>
                      <p className="text-sm text-muted-foreground">
                        JPG, PNG, SVG or JPEG, max 1MB
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
                        variant={"link"}
                        size="xs"
                        className="w-fit mt-2"
                        onClick={() => inputRef.current?.click()}
                      >
                        Upload Image
                      </Button>
                    </div>
                  </div>
                )}
              />
              <Separator className="my-6" />
              <div className="flex items-center justify-between">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      {/* Password Form */}
     {user.provider==AuthProvider.CREDENTIALS && <Card className="w-full shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Change Password</h3>
            <div className="mt-4">
              <FormProvider {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your current password"
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-5">
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter new password"
                              type="password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmNewPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Confirm new password"
                              type="password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Separator className="my-6" />
                  <div className="flex items-center justify-between">
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={passwordForm.formState.isSubmitting}
                    >
                      {passwordForm.formState.isSubmitting
                        ? "Saving..."
                        : "Change Password"}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </CardContent>
      </Card>}
    </div>
  );
};
