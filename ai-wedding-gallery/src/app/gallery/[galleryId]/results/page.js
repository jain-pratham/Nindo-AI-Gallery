"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function ResultPage() {
  const { galleryId } = useParams();
  const searchParams = useSearchParams();
  const selfieId = searchParams.get("selfieId");

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/ai/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            galleryId,
            selfieId
          })
        });

        const data = await res.json();

        if (data.success && data.matchedPhotos?.length > 0) {
          setPhotos(data.matchedPhotos);
        } else {
          setPhotos([]);
        }
      } catch (err) {
        console.error("Match error:", err);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    if (galleryId && selfieId) {
      fetchResults();
    }
  }, [galleryId, selfieId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        🔍 Finding your photos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">
          🎉 Your Photos
        </h1>

        {photos.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No photos found where you appear
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <img
                  src={photo.imageUrl}
                  alt="Matched"
                  className="w-full h-48 object-cover"
                />

                <div className="p-3 text-center">
                  <p className="text-xs text-gray-500 mb-2">
                    Match Score: {photo.score.toFixed(2)}
                  </p>

                  <a
                    href={photo.imageUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
