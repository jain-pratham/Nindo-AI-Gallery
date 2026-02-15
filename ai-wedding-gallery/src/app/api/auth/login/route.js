import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(req){
    try {
        await dbConnect()

        const { email, password } = await req.json();
        
        if(!email || !password) {
            return NextResponse.json(
                { success: false, message: "Missing fields" },
                { status: 400 }
            );
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            )
        }

        const isMath = await bcrypt.compare(password, admin.password);
        if(!isMath) {
           return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            )  
        }

        const token = jwt.sign(
            { adminId: admin._id},
            process.env.JWT_SECRET,
            { expiresIn: "1d"}
        )

        return NextResponse.json(
            {success:true, token}
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
    );
    }
}