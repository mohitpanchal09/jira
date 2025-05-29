import { AuthOptions, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadToS3 } from "@/lib/s3";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function PATCH(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions as AuthOptions);
    const userId = Number(params.userId);

    if (!session?.user?.id || session.user.id !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const formData = await req.formData();

    const username = formData.get("username");
    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const image = formData.get("image");

    if (typeof username !== "string") {
      return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
    }

    const userWithSameUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (userWithSameUsername && userWithSameUsername.id !== userId) {
      return NextResponse.json({ message: "Username already taken" }, { status: 409 });
    }

    let imageUrl: string | undefined = undefined;
    if (image && image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const fileName = `profile-${Date.now()}-${image.name}`;
      imageUrl = await uploadToS3(buffer, fileName, image.type);
    }

    // Prepare the update data object conditionally
    const updateData: any = {
      username,
      image: imageUrl || undefined,
      firstname:null,
      lastname:null
    };

    if (typeof firstname === "string" && firstname.trim() !== "") {
      updateData.firstname = firstname;
    }
    if (typeof lastname === "string" && lastname.trim() !== "") {
      updateData.lastname = lastname;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser }, { status: 200 });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      //@ts-ignore
      { message: "Something went wrong", error: err?.message || err },
      { status: 500 }
    );
  }
}
