import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const { username, otp } = body

        if (!username) {
            return NextResponse.json({ message: "Enter the email" }, { status: 400 })
        }
        if (!otp) {
            return NextResponse.json({ message: "Enter the otp" }, { status: 400 })
        }
        const user = await prisma.user.findUnique({
            where: { username },
        });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })

        }

        if (!user.otp || !user.otpCreatedAt) {
            return NextResponse.json({ message: "Otp was not generated" }, { status: 400 })

        }

        const OTP_EXPIRY_MINUTES = 10;
        const now = new Date();

        const diff = (now.getTime() - user.otpCreatedAt.getTime()) / 1000 / 60;
        if (diff > OTP_EXPIRY_MINUTES) {
            return NextResponse.json({ error: "OTP expired" }, { status: 400 });
        }

        if (user.otp.toString() !== otp) {
            return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 });
        }
        await prisma.user.update({
            where: { username },
            data: {
                verified: true,
                otp: null,
                otpCreatedAt: null,
            },
        });

    return NextResponse.json({ message: "OTP verified successfully", success: true });

    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );

    }
}