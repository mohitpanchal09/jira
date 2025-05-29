import { z } from "zod";

export const updateProfileSchema = z.object({
  email:z.string(),
  username: z.string().min(1, "Username is required"),
  firstname: z.string().optional(),
  lastname:z.string().optional(),
  image:z.union([
          z.instanceof(File),z.string().transform((value)=>value==""?undefined:value)
      ]).optional()
});
