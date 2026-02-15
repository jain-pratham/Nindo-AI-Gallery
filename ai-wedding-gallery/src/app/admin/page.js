"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("/api/galleries")
      .then(res => res.json())
      .then(data => {
        if (data.success) setGalleries(data.galleries);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/login");
  };

  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Gallery link copied");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">
            Admin Dashboard
          </h1>

          <div className="flex gap-3">
            <Link
              href="/admin/create-gallery"
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Create Gallery
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading galleries...</p>
        ) : galleries.length === 0 ? (
          <p className="text-gray-600">No galleries created yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {galleries.map((gallery) => {
              const link = `${window.location.origin}/gallery/${gallery._id}`;

              return (
                <div
                  key={gallery._id}
                  className="bg-white rounded-xl shadow p-6 flex flex-col gap-4"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-black">
                      {gallery.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Created on {new Date(gallery.createdAt).toDateString()}
                    </p>
                  </div>

                  <div className="bg-gray-100 rounded p-3 text-sm break-all text-black">
                    {link}
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => copyLink(link)}
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Copy Link
                    </button>

                    <Link
                      href={`/admin/upload-photos?galleryId=${gallery._id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Upload Photos
                    </Link>

                    <Link
                      href={`/admin/galleries?galleryId=${gallery._id}`}
                      target="_blank"
                      className="bg-gray-800 text-white px-4 py-2 rounded"
                    >
                      View Gallery
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
