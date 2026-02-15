import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await dbConnect();

        const  body = await req.json();
        const { title, events } = body;

        if (!title || !events) {
            return NextResponse.json(
                { success: false, message: "Missing fields" },
                { status: 400 }
            );
        }

        const gallery = await Gallery.create({
            title,
            events
        });

        return NextResponse.json({
            success: true,
            galleryId: gallery._id,
            galleryLink: `gallery/${gallery._id}`
        });

    } catch (error) {
        return NextResponse.json(
            { success:false, error: error.message },
            { status: 500}
        );
    }
} 

export async function GET() {
  try {
    await dbConnect();

    const galleries = await Gallery.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      galleries
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}