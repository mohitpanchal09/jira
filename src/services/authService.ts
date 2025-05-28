import { AuthProvider } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";


export async function registerUser({ email, password, username }: { email: string, password: string, username: string }) {

    const existingUser = await prisma.user.findUnique({
        where: {
            username
        }
    })
    if (existingUser) throw new Error("User already exists")

    const hashedPassword = await bcrypt.hash(password,10)
    return await prisma.user.create({
        data:{
            username,email,password:hashedPassword,provider:AuthProvider.CREDENTIALS
        }
    })
}
