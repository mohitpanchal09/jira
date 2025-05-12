import {z} from 'zod'

export const registerSchema = z.object({
    username: z.string().trim().min(1, "Required"),
    email: z.string().trim().min(1, "Required").email(),
    password: z.string().min(8, "Minimum 8 characters"),
});
