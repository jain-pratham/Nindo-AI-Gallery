import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Gallery from "@/models/Gallery";

export async function DELETE(req, context) {
  try {
    await dbConnect();

    const { id } = await context.params;
    const body = await req.json();

    const eventDate = body.eventDate?.trim();
    const photoUrl = body.photoUrl?.trim();

    console.log("DELETE:", id, eventDate, photoUrl);

    if (!id || !eventDate || !photoUrl) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return NextResponse.json(
        { success: false, message: "Gallery not found" },
        { status: 404 }
      );
    }

    const event = gallery.events.find(
      e => String(e.date).trim() === eventDate
    );

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    event.photos = event.photos.filter(p => p !== photoUrl);

    await gallery.save();

    return NextResponse.json({
      success: true,
      message: "Photo deleted successfully"
    });

  } catch (error) {
    console.error("DELETE PHOTO ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
