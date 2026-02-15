"use client";

import { useState } from "react";
import useAdminAuth from "@/hooks/useAdminAuth";

export default function CreateGalleryPage() {
  useAdminAuth();
  const [title, setTitle] = useState("");
  const [events, setEvents] = useState([{ date: "", name: "" }]);
  const [loading, setLoading] = useState(false);
  const [galleryLink, setGalleryLink] = useState("");

  const addEvent = () => {
    setEvents([...events, { date: "", name: "" }]);
  };

  const updateEvent = (index, field, value) => {
    const updated = [...events];
    updated[index][field] = value;
    setEvents(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/galleries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, events })
      });

      const data = await res.json();

      if (data.success) {
        setGalleryLink(data.galleryLink);
        setTitle("");
        setEvents([{ date: "", name: "" }]);
      } else {
        alert(data.message || "Failed to create gallery");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow">
        
        <h1 className="text-2xl font-bold mb-6 text-black">
          Create Wedding Gallery
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Gallery Title */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">
              Gallery Title
            </label>
            <input
              type="text"
              placeholder="Jeetendra & Pooja Wedding"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 
              text-black bg-white
              focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Events */}
          <div>
            <h3 className="font-semibold mb-2 text-black">
              Events / Dates
            </h3>

            <div className="space-y-3">
              {events.map((event, index) => (
                <div key={index} className="flex gap-3">
                  
                  <input
                    type="date"
                    value={event.date}
                    onChange={(e) =>
                      updateEvent(index, "date", e.target.value)
                    }
                    required
                    className="border rounded-lg px-3 py-2 w-1/3 
                    text-black bg-white"
                  />

                  <input
                    type="text"
                    placeholder="Haldi / Wedding / Reception"
                    value={event.name}
                    onChange={(e) =>
                      updateEvent(index, "name", e.target.value)
                    }
                    required
                    className="border rounded-lg px-3 py-2 flex-1 
                    text-black bg-white"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addEvent}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              + Add Event
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg 
            hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Gallery"}
          </button>
        </form>

        {/* Result */}
        {galleryLink && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
            <p className="font-medium text-black">Gallery Link:</p>
            <a
              href={galleryLink}
              target="_blank"
              className="text-green-700 underline break-all"
            >
              {galleryLink}
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
