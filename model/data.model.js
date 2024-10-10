import mongoose, { Schema } from "mongoose";

// DataEntry Schema
const DataEntrySchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Store the date the entry was created
    }
});

// Export DataEntry model
export const DataEntry = mongoose.model("DataEntry", DataEntrySchema);
