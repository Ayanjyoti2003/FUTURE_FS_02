import { Schema, model, models } from "mongoose";

const UserProfileSchema = new Schema(
    {
        userUid: { type: String, unique: true, required: true },
        email: String,
        displayName: String,
        photoURL: String,
    },
    { timestamps: true }
);

export default models.UserProfile || model("UserProfile", UserProfileSchema);
