import { createWorkspace, getWorkspaces } from "@/services/workspaceService";
import { workspaceSchema } from "@/validations/workspace.validations";
import { AuthOptions, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { uploadToS3 } from "@/lib/s3";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const session = await getServerSession(authOptions as AuthOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const formData = await req.formData()
        const userId = session?.user?.id

        const name = formData.get("name")
        const image = formData.get("image")
        if (typeof name !== "string") {
            return NextResponse.json({ message: "Invalid name" }, { status: 400 });
        }
        let imageUrl = "";
        if (image && image instanceof File) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const fileName = `workspace-${Date.now()}-${image.name}`;

            // Upload to S3 (or other storage)
            imageUrl = await uploadToS3(buffer, fileName, image.type); // define this
        }

        const workspace = await createWorkspace(name, userId,imageUrl)
        return NextResponse.json({ message: "workspace created successfully", workspace }, { status: 201 })
    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions as AuthOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const userId = session?.user?.id
        const workspaces = await getWorkspaces(userId)
        return NextResponse.json({ workspaces }, { status: 200 });
    } catch (err) {
        console.error("workspace fetching error:", err);
        return NextResponse.json(
            //@ts-ignore
            { message: "Something went wrong", error: err?.message || err },
            { status: 500 }
        );
    }
}

