"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useAdminAuth from "@/hooks/useAdminAuth";

export default function UploadPhotosPage() {
  useAdminAuth();

  const searchParams = useSearchParams();
  const galleryId = searchParams.get("galleryId");

  const [gallery, setGallery] = useState(null);
  const [eventDate, setEventDate] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!galleryId) return;

    fetch(`/api/galleries/${galleryId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGallery(data.gallery);
        }
        setLoading(false);
      });
  }, [galleryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventDate || photos.length === 0) {
      alert("Select event and photos");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("galleryId", galleryId);
    formData.append("eventDate", eventDate);

    for (let file of photos) {
      formData.append("photos", file);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert(`Uploaded ${data.uploaded} photos`);
        setPhotos([]);
      } else {
        alert(data.message || "Upload failed");
      }
    } catch {
      alert("Server error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-black">
        Loading Gallery...
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-black">
        Gallery not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-extrabold text-black mb-6 text-center">
          Upload Event Photos
        </h1>

        {/* Gallery Info */}
        <div className="border rounded-xl p-5 bg-gray-50 mb-8">
          <div className="text-xl font-bold text-black">
            {gallery.title}
          </div>
          <div className="text-sm text-black mt-1 break-all">
            Gallery ID: {gallery._id}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Event Dropdown */}
          <div>
            <label className="block text-lg font-bold text-black mb-2">
              Select Event / Date
            </label>
            <select
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
              className="w-full border-2 border-gray-300 rounded-xl 
                         px-4 py-3 text-black text-lg 
                         focus:outline-none focus:border-black"
            >
              <option value="">Choose Event</option>
              {gallery.events.map((event, i) => (
                <option key={i} value={event.date}>
                  {event.name} — {event.date}
                </option>
              ))}
            </select>
          </div>

          {/* File Input */}
          <div>
            <label className="block text-lg font-bold text-black mb-2">
              Select Photos
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setPhotos(e.target.files)}
              className="w-full text-black"
            />
            <p className="mt-2 text-black font-semibold">
              Selected Images: {photos.length}
            </p>
          </div>

          {/* Upload Button */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-black text-white py-4 rounded-xl 
                       text-xl font-bold hover:bg-gray-800 
                       transition disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Photos"}
          </button>

        </form>
      </div>
    </div>
  );
}
