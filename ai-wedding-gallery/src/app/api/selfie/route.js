import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Selfie from "@/models/Selfie";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const galleryId = formData.get("galleryId");
    const file = formData.get("selfie");

    if (!galleryId || !file) {
      return NextResponse.json(
        { success: false, message: "galleryId or selfie missing" },
        { status: 400 }
      );
    }

    // file → buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // upload to cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "selfies",
            resource_type: "image"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    // save in mongodb
    const selfie = await Selfie.create({
      galleryId,
      imagePath: result.secure_url
    });

    return NextResponse.json({
      success: true,
      selfieId: selfie._id,
      imagePath: selfie.imagePath
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
