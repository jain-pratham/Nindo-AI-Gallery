"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function GuestGalleryPage() {
  const { galleryId } = useParams();

  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!galleryId) return;

    const fetchGallery = async () => {
      try {
        const res = await fetch(`/api/galleries/${galleryId}`);
        const data = await res.json();

        if (data.success) {
          setGallery(data.gallery);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [galleryId]);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xl font-semibold text-black">
          Loading gallery...
        </p>
      </div>
    );
  }

  /* ---------- NOT FOUND ---------- */
  if (!gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-xl font-semibold text-red-600">
          Gallery not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-black text-center mb-10">
          {gallery.title}
        </h1>

        {/* UPLOAD BUTTON */}
        <div className="text-center mb-12">
          <Link
            href={`/gallery/${galleryId}/upload-selfie`}
            className="inline-block bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800"
          >
            Upload Your Selfie
          </Link>
        </div>

        {/* EVENTS */}
        <div className="space-y-14">
          {gallery.events.map((event, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-6 bg-gray-50"
            >
              <h2 className="text-2xl font-semibold text-black mb-1">
                {event.name}
              </h2>

              <p className="text-gray-700 mb-4">
                Event Date: {event.date}
              </p>

              {event.photos.length === 0 ? (
                <p className="text-gray-600">
                  No photos uploaded for this event.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {event.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt="Wedding"
                      className="w-full h-40 object-cover rounded-lg shadow"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
