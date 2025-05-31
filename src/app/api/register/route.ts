import RegistrationMailTemplate from "@/components/RegistrationMailTemplate";
import { registerUser } from "@/services/authService";
import { registerSchema } from "@/validations/register.validations";
import { Resend } from 'resend';
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json()
        const safeParse = registerSchema.safeParse(body)
        if (!safeParse.success) {
            return NextResponse.json(
                { message: "Invalid input", error: safeParse.error.format() },
                { status: 400 }
            );
        }

        const user = await registerUser(body)

        const otp = String(user.otp)

        if (otp && user.email) {
            const expiryMinutes = 10;
            const resend = new Resend(process.env.RESEND_API_KEY);
            const { data, error } = await resend.emails.send({
                from: "send@trekflow.space",
                to: [user.email],
                subject: "OTP For TrekFlow Registration",
                react: RegistrationMailTemplate({
                    recipientName: user.username || "User", 
                    otp,
                    expiryMinutes,
                    appName: "Treflow",
                }),
            });

            if (error) {
                console.error("Email sending error:", error);
                return NextResponse.json(
                    { message: "User registered, but failed to send OTP", error },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json(
            { message: "User registered and OTP sent to email", user },
            { status: 201 }
        );

    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );

    }
}