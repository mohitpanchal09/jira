import { z } from "zod";

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters."),
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmNewPassword: z.string().min(6, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  });