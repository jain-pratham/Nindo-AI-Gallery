export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const galleryId = formData.get("galleryId");
    const eventDate = formData.get("eventDate");
    const files = formData.getAll("photos");

    if (!galleryId || !eventDate || files.length === 0) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const gallery = await Gallery.findById(galleryId);
    if (!gallery) {
      return NextResponse.json({ success: false, message: "Gallery not found" }, { status: 404 });
    }

    let event = gallery.events.find(
      e => String(e.date) === String(eventDate)
    );

    if (!event) {
      event = { date: eventDate, name: "Event", photos: [] };
      gallery.events.push(event);
    }

    const uploadedPhotoUrls = [];
    let uploaded = 0;

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: `galleries/${galleryId}/${eventDate}`,
            resource_type: "image"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      event.photos.push(uploadResult.secure_url);
      uploadedPhotoUrls.push(uploadResult.secure_url);
      uploaded++;
    }

    await gallery.save();

    // Send to FastAPI for processing
    await fetch("http://127.0.0.1:8000/process-gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        galleryId: gallery._id.toString(),
        photoUrls: uploadedPhotoUrls
      })
    });

    return NextResponse.json({ success: true, uploaded });

  } catch (error) {
    console.error("FINAL UPLOAD ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
