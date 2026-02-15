"use client";

import useAdminAuth from "@/hooks/useAdminAuth";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AdminGalleryPage() {
    useAdminAuth();

    const searchParams = useSearchParams();
    const galleryId = searchParams.get("galleryId");
    console.log(galleryId)

    const [gallery, setGallery] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [eventDate, setEventDate] = useState("");
    const [eventName, setEventName] = useState("");

    useEffect(() => {
        if (!galleryId) return;

        fetch(`/api/galleries/${galleryId}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setGallery(data.gallery);
                setLoading(false);
            });
    }, [galleryId]);

    const addEvent = async () => {
        if (!eventDate || !eventName) return alert("Fill all fields");

        const res = await fetch(`/api/galleries/${galleryId}/event`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: eventDate, name: eventName }),
        });

        const data = await res.json();
        if (data.success) {
            setShowModal(false);
            setEventDate("");
            setEventName("");
            location.reload();
        }
    };

    const handleDeletePhoto = async (photoUrl, eventDate) => {
        if (!confirm("Delete this photo?")) return;

        const res = await fetch(
            `/api/galleries/${galleryId}/delete-photo`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    eventDate,
                    photoUrl,
                })
            }
        );

        const data = await res.json();

        if (data.success) {
            alert("Photo deleted");
            location.reload();
        } else {
            alert(data.message || "Delete failed");
        }
    };


    if (loading) return <div className="p-6">Loading...</div>;
    if (!gallery) return <div className="p-6">Gallery not found</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-6 rounded shadow mb-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{gallery.title}</h1>

                    <div className="flex gap-4 text-sm">
                        <button
                            onClick={() => setShowModal(true)}
                            className="text-blue-600 underline"
                        >
                            + Add Event
                        </button>

                        <Link
                            href={`/gallery/${gallery._id}`}
                            target="_blank"
                            className="text-green-600 underline"
                        >
                            Open Gallery
                        </Link>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {gallery.events.map(event => (
                    <div key={event.date} className="bg-white p-4 rounded shadow">
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <h2 className="font-semibold">{event.name}</h2>
                                <p className="text-sm text-gray-500">{event.date}</p>
                            </div>

                            <Link
                                href={`/admin/upload-photos?galleryId=${gallery._id}&date=${event.date}`}
                                className="text-blue-600 underline text-sm"
                            >
                                Upload Photos
                            </Link>
                        </div>

                        {event.photos.length === 0 ? (
                            <p className="text-sm text-gray-500">No photos</p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {event.photos.map(photo => (
                                    <div key={photo} className="relative group">
                                        <img
                                            src={photo}
                                            className="w-full h-32 object-cover rounded"
                                        />
                                        <button
                                            onClick={() => handleDeletePhoto(photo, event.date)}
                                            className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                                        >
                                            Delete
                                        </button>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-full max-w-sm">
                        <h2 className="font-semibold mb-4">Add Event</h2>

                        <input
                            type="date"
                            value={eventDate}
                            onChange={e => setEventDate(e.target.value)}
                            className="w-full border px-3 py-2 rounded mb-3"
                        />

                        <input
                            type="text"
                            placeholder="Event name"
                            value={eventName}
                            onChange={e => setEventName(e.target.value)}
                            className="w-full border px-3 py-2 rounded mb-4"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="border px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addEvent}
                                className="bg-black text-white px-4 py-2 rounded"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
