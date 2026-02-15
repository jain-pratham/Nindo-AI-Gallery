"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function UploadSelfiePage() {
  const { galleryId } = useParams();
  const router = useRouter();

  const [selfie, setSelfie] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelfie(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ ADD THIS
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selfie) {
      alert("Please select a selfie");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("galleryId", galleryId);
      formData.append("selfie", selfie);

      const res = await fetch("/api/selfie", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        // ✅ redirect to results page
        router.push(
          `/gallery/${galleryId}/results?selfieId=${data.selfieId}`
        );
      } else {
        alert("Selfie upload failed");
      }
    } catch (error) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
        <h1 className="text-xl font-bold mb-2">
          Upload your Selfie
        </h1>

        <p className="text-sm text-gray-600 mb-4">
          We will find all photos where you appear
        </p>

        {/* ✅ onSubmit added */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full"
          />

          {preview && (
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Selfie Preview"
                className="w-40 h-40 rounded-full object-cover border"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            {loading ? "Uploading..." : "Find My Photos"}
          </button>
        </form>
      </div>
    </div>
  );
}
