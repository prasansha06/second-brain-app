import mongoose, { model, Schema } from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/brainly";

mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((err) => {
        console.warn("MongoDB connection warning:", err.message);
        console.warn("Ensure MongoDB is running or specify MONGO_URI environment variable.");
    });

const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    tags: [{ type: String }],
    type: { type: String, required: true }, // "youtube" | "twitter" | "document" | "link"
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

const LinkSchema = new Schema({
    hash: { type: String, required: true, unique: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true }
});

export const LinkModel = model("Links", LinkSchema);
export const ContentModel = model("Content", ContentSchema);
