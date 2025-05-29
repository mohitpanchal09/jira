import { AuthOptions, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);
        const userId = Number(params.userId);

        if (!session?.user?.id || session.user.id !== userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: "Both current and new passwords are required." }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser || !existingUser.password) {
            return NextResponse.json({ message: "User not found or password not set." }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Current password is incorrect." }, { status: 400 });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedNewPassword,
            },
        });

        return NextResponse.json({ message: "Password changed successfully." }, { status: 200 });
    } catch (err) {
        console.error("Password change error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}
