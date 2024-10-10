import mongoose, { Schema } from "mongoose";

// User Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    csvUploader: {
        fileName: { type: String },
        filePath: { type: String },
        uploadDate: { type: Date, default: Date.now },
    },
    dataEntries: [{ type: Schema.Types.ObjectId, ref: 'DataEntry' }]
});

// Export User model
export const User = mongoose.model("User", UserSchema);
