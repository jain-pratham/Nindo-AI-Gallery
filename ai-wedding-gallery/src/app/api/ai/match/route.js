export const runtime = "nodejs";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Selfie from "@/models/Selfie";
import Gallery from "@/models/Gallery";

export async function POST(req) {
  try {
    await dbConnect();

    const { galleryId, selfieId } = await req.json();

    if (!galleryId || !selfieId) {
      return NextResponse.json(
        { success: false, message: "Missing galleryId or selfieId" },
        { status: 400 }
      );
    }

    // --------------------------------
    // 1️⃣ Get selfie + gallery
    // --------------------------------
    const selfie = await Selfie.findById(selfieId);
    const gallery = await Gallery.findById(galleryId);

    if (!selfie || !gallery) {
      return NextResponse.json(
        { success: false, message: "Selfie or gallery not found" },
        { status: 404 }
      );
    }

    // --------------------------------
    // 2️⃣ Extract gallery images
    // --------------------------------
    let galleryImages = [];

    if (Array.isArray(gallery.events)) {
      gallery.events.forEach(event => {
        if (Array.isArray(event.photos)) {
          event.photos.forEach(photo => {
            if (typeof photo === "string") {
              galleryImages.push(photo);
            }
          });
        }
      });
    }

    if (!galleryImages.length) {
      return NextResponse.json(
        { success: false, message: "No gallery images found" },
        { status: 400 }
      );
    }

    // --------------------------------
    // 3️⃣ Generate Selfie Embedding
    // --------------------------------
    const selfieEmbedRes = await fetch("http://127.0.0.1:8000/generate-embedding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        imageUrl: selfie.imagePath
      })
    });

    if (!selfieEmbedRes.ok) {
      throw new Error("Failed to generate selfie embedding");
    }

    const selfieEmbedData = await selfieEmbedRes.json();

    if (!selfieEmbedData.embedding) {
      throw new Error("Invalid selfie embedding");
    }

    // --------------------------------
    // 4️⃣ Generate Gallery Embeddings
    // --------------------------------
    let galleryEmbeddings = [];

    for (const img of galleryImages) {

      const res = await fetch("http://127.0.0.1:8000/generate-embedding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          imageUrl: img
        })
      });

      if (!res.ok) continue;

      const data = await res.json();

      if (data.embedding) {
        galleryEmbeddings.push({
          imageUrl: img,
          embedding: data.embedding
        });
      }
    }

    if (!galleryEmbeddings.length) {
      return NextResponse.json(
        { success: false, message: "Failed to generate gallery embeddings" },
        { status: 500 }
      );
    }

    // --------------------------------
    // 5️⃣ Match using vectors
    // --------------------------------
    const matchRes = await fetch("http://127.0.0.1:8000/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        selfieEmbedding: selfieEmbedData.embedding,
        galleryEmbeddings
      })
    });

    if (!matchRes.ok) {
      throw new Error("Matching failed");
    }

    const matchData = await matchRes.json();

    // --------------------------------
    // 6️⃣ Save results
    // --------------------------------
    await Selfie.findByIdAndUpdate(selfieId, {
      matchedPhotos: matchData.matchedPhotos || [],
      status: "done"
    });

    return NextResponse.json({
      success: true,
      matchedPhotos: matchData.matchedPhotos
    });

  } catch (error) {
    console.error("AI MATCH ERROR:", error);

    return NextResponse.json(
      { success: false, message: "AI matching failed" },
      { status: 500 }
    );
  }
}
