import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
    createPost,
    getFeedPosts,
    getUserPosts,
    getPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    updateComment,
    deleteComment,
    likeComment
} from "../controllers/postController.js";

const router = express.Router();

// All post routes are protected
router.use(protectRoute);

// Post CRUD
router.post("/", createPost);
router.get("/feed", getFeedPosts);
router.get("/user/:userId", getUserPosts);
router.get("/:postId", getPost);
router.put("/:postId", updatePost);
router.delete("/:postId", deletePost);

// Like/Unlike
router.post("/:postId/like", likePost);
router.delete("/:postId/like", unlikePost);

// Comments
router.post("/:postId/comments", addComment);
router.put("/comments/:commentId", updateComment);
router.delete("/comments/:commentId", deleteComment);
router.post("/comments/:commentId/like", likeComment);

export default router;