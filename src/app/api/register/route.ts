import { registerUser } from "@/services/authService";
import { registerSchema } from "@/validations/register.validations";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest,res:NextResponse){
    try{
        const body = await req.json()
        const safeParse = registerSchema.safeParse(body)
        if(!safeParse.success) return null

        const user = await registerUser(body)
        return NextResponse.json({message:"User registered successfully",user},{status:201})

    }catch(err){
        console.error("Registration error:", err);
        return NextResponse.json(
            //@ts-ignore
          { message: "Something went wrong", error: err?.message || err },
          { status: 500 }
        );
      
    }
}