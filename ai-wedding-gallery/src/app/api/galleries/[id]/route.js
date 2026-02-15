import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const {id} = await params;
        console.log(id)
        if (!id){
            return NextResponse.json(
                { success: false, message: "Gallery ID is required"},
                {status: 400}
            );
        }

        const gallery = await Gallery.findById(id);

        if(!gallery) {
            return NextResponse.json(
                {success: false, message: "Gallery not found"},
                {status: 404}
            );
        } 

        return NextResponse.json({
            success: true,
            gallery
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { success: 500}
        );
    }
}



