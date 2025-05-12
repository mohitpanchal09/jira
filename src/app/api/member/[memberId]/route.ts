import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { AuthOptions, getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { UserRole } from "@/types";
import { deleteMember, updateMemberRole } from "@/services/memberService";

export async function PATCH(req: NextRequest, { params }: { params: { memberId: string } }) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);
        const memberId = Number(params.memberId);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Get the role of the currently logged-in user
        const requestingMember = await prisma.member.findFirst({
            where: {
                userId,
            },
        });

        if (!requestingMember || requestingMember.role !== UserRole.ADMIN) {
            return NextResponse.json({ message: "You are not authorized to perform this operation" }, { status: 403 });
        }

        const existingMember = await prisma.member.findUnique({
            where: { id: memberId },
        });

        if (!existingMember) {
            return NextResponse.json({ message: "Member not found" }, { status: 404 });
        }

        const { role } = await req.json();

        await updateMemberRole(memberId, role);
        return NextResponse.json({ message: "Role updated successfully" }, { status: 201 });
    } catch (err) {
        console.error("PATCH error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}


export async function DELETE(req: NextRequest, { params }: { params: { memberId: string } }) {
    try {
        const session = await getServerSession(authOptions as AuthOptions);
        const memberId = Number(params.memberId);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Check if the logged-in user is an ADMIN
        const requestingMember = await prisma.member.findFirst({
            where: {
                userId,
            },
        });

        if (!requestingMember || requestingMember.role !== UserRole.ADMIN) {
            return NextResponse.json({ message: "You are not authorized to delete this member" }, { status: 403 });
        }

        const existingMember = await prisma.member.findUnique({
            where: { id: memberId },
        });

        if (!existingMember) {
            return NextResponse.json({ message: "Member not found" }, { status: 404 });
        }

        await deleteMember(memberId);

        return NextResponse.json({ message: "Member deleted successfully" }, { status: 200 });
    } catch (err) {
        console.error("Delete error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}



