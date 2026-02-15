import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    date: String,
    name: String,
    photos: [String]
})

const GallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        events: [EventSchema]
    },
    { timestamps: true }
);

export default mongoose.models.Gallery || 
    mongoose.model("Gallery", GallerySchema);