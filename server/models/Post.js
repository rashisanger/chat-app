import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    image: { type: String }, // Optional image in comment
}, { timestamps: true });

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    image: { type: String }, // Single image for simplicity (can be extended to array)
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
    privacy: { type: String, enum: ["public", "friends", "private"], default: "public" },
}, { timestamps: true });

// Add indexes for better query performance
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ privacy: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;