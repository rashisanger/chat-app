import Post from "../models/Post.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// @desc    Create a new post
// @route   POST /api/posts
export const createPost = async (req, res) => {
    try {
        const { text, image, privacy } = req.body;
        const userId = req.user._id;

        if (!text) {
            return res.json({ success: false, message: "Post text is required" });
        }

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newPost = await Post.create({
            userId,
            text,
            image: imageUrl,
            privacy: privacy || "public",
            likes: [],
            comments: []
        });

        // Populate user details for response
        const populatedPost = await Post.findById(newPost._id).populate("userId", "fullName profilePic");

        // Emit to all online users for real-time feed
        io.emit("newPost", populatedPost);

        res.json({ success: true, post: populatedPost });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Get feed posts
// @route   GET /api/posts/feed
export const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get public posts and user's own posts
        const posts = await Post.find({
            $or: [
                { privacy: "public" },
                { userId: userId }
            ]
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("userId", "fullName profilePic")
            .populate("comments.userId", "fullName profilePic");

        const totalPosts = await Post.countDocuments({
            $or: [
                { privacy: "public" },
                { userId: userId }
            ]
        });

        // Check if current user liked each post
        const postsWithLikeStatus = posts.map(post => {
            const postObj = post.toObject();
            postObj.isLiked = post.likes.includes(userId);
            postObj.likesCount = post.likes.length;
            postObj.commentsCount = post.comments.length;

            // Check if user liked each comment
            postObj.comments = post.comments.map(comment => {
                const commentObj = comment.toObject();
                commentObj.isLiked = comment.likes.includes(userId);
                commentObj.likesCount = comment.likes.length;
                return commentObj;
            });

            return postObj;
        });

        res.json({
            success: true,
            posts: postsWithLikeStatus,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            hasMore: page < Math.ceil(totalPosts / limit)
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Get posts by specific user
// @route   GET /api/posts/user/:userId
export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("userId", "fullName profilePic")
            .populate("comments.userId", "fullName profilePic");

        const totalPosts = await Post.countDocuments({ userId });

        const postsWithLikeStatus = posts.map(post => {
            const postObj = post.toObject();
            postObj.isLiked = post.likes.includes(currentUserId);
            postObj.likesCount = post.likes.length;
            postObj.commentsCount = post.comments.length;
            return postObj;
        });

        res.json({
            success: true,
            posts: postsWithLikeStatus,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            hasMore: page < Math.ceil(totalPosts / limit)
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:postId
export const getPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId)
            .populate("userId", "fullName profilePic")
            .populate("comments.userId", "fullName profilePic");

        if (!post) {
            return res.json({ success: false, message: "Post not found" });
        }

        const postObj = post.toObject();
        postObj.isLiked = post.likes.includes(userId);
        postObj.likesCount = post.likes.length;
        postObj.commentsCount = post.comments.length;

        // Check likes on comments
        postObj.comments = post.comments.map(comment => {
            const commentObj = comment.toObject();
            commentObj.isLiked = comment.likes.includes(userId);
            commentObj.likesCount = comment.likes.length;
            return commentObj;
        });

        res.json({ success: true, post: postObj });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:postId
export const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;
        const { text, image, privacy } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.json({ success: false, message: "Post not found" });
        }

        // Check if user owns the post
        if (post.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Unauthorized to update this post" });
        }

        let imageUrl = post.image;
        if (image && image !== post.image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        post.text = text || post.text;
        post.image = imageUrl;
        post.privacy = privacy || post.privacy;
        await post.save();

        const updatedPost = await Post.findById(postId)
            .populate("userId", "fullName profilePic")
            .populate("comments.userId", "fullName profilePic");

        // Emit update event
        io.emit("postUpdated", updatedPost);

        res.json({ success: true, post: updatedPost });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:postId
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.json({ success: false, message: "Post not found" });
        }

        // Check if user owns the post
        if (post.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Unauthorized to delete this post" });
        }

        await Post.findByIdAndDelete(postId);

        // Emit delete event
        io.emit("postDeleted", { postId });

        res.json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Like a post
// @route   POST /api/posts/:postId/like
export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.json({ success: false, message: "Post not found" });
        }

        // Check if already liked
        if (post.likes.includes(userId)) {
            return res.json({ success: false, message: "Post already liked" });
        }

        post.likes.push(userId);
        await post.save();

        // Emit like event to the post room
        io.to(`post:${postId}`).emit("postUpdate", {
            postId,
            action: "like",
            userId: req.user._id,
            data: {
                likesCount: post.likes.length,
                isLiked: true,
                user: {
                    _id: req.user._id,
                    fullName: req.user.fullName,
                    profilePic: req.user.profilePic
                }
            }
        });

        // Send notification to post owner
        if (post.userId.toString() !== userId.toString()) {
            const postOwnerSocketId = userSocketMap[post.userId.toString()];
            if (postOwnerSocketId) {
                io.to(postOwnerSocketId).emit("notification", {
                    type: "like",
                    postId,
                    userId: req.user._id,
                    userFullName: req.user.fullName,
                    userProfilePic: req.user.profilePic,
                    message: `${req.user.fullName} liked your post`
                });
            }
        }

        res.json({
            success: true,
            likesCount: post.likes.length,
            isLiked: true
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Unlike a post
// @route   DELETE /api/posts/:postId/like
export const unlikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.json({ success: false, message: "Post not found" });
        }

        // Check if liked
        if (!post.likes.includes(userId)) {
            return res.json({ success: false, message: "Post not liked yet" });
        }

        post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        await post.save();

        // Emit unlike event to the post room
        io.to(`post:${postId}`).emit("postUpdate", {
            postId,
            action: "unlike",
            userId: req.user._id,
            data: {
                likesCount: post.likes.length,
                isLiked: false
            }
        });

        res.json({
            success: true,
            likesCount: post.likes.length,
            isLiked: false
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Add comment to post
// @route   POST /api/posts/:postId/comments
export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;
        const { text, image } = req.body;

        if (!text) {
            return res.json({ success: false, message: "Comment text is required" });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.json({ success: false, message: "Post not found" });
        }

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newComment = {
            userId,
            text,
            image: imageUrl,
            likes: []
        };

        post.comments.push(newComment);
        await post.save();

        // Get the newly added comment with populated user
        const populatedPost = await Post.findById(postId)
            .populate("comments.userId", "fullName profilePic");

        const addedComment = populatedPost.comments[populatedPost.comments.length - 1];

        // Emit new comment event to the post room
        io.to(`post:${postId}`).emit("postUpdate", {
            postId,
            action: "comment",
            userId: req.user._id,
            data: {
                comment: addedComment,
                commentsCount: post.comments.length
            }
        });

        // Send notification to post owner
        if (post.userId.toString() !== userId.toString()) {
            const postOwnerSocketId = userSocketMap[post.userId.toString()];
            if (postOwnerSocketId) {
                io.to(postOwnerSocketId).emit("notification", {
                    type: "comment",
                    postId,
                    userId: req.user._id,
                    userFullName: req.user.fullName,
                    userProfilePic: req.user.profilePic,
                    comment: text,
                    message: `${req.user.fullName} commented on your post`
                });
            }
        }

        res.json({ success: true, comment: addedComment });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Update a comment
// @route   PUT /api/posts/comments/:commentId
export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;
        const { text } = req.body;

        const post = await Post.findOne({ "comments._id": commentId });

        if (!post) {
            return res.json({ success: false, message: "Comment not found" });
        }

        const comment = post.comments.id(commentId);

        // Check if user owns the comment
        if (comment.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Unauthorized to update this comment" });
        }

        comment.text = text;
        await post.save();

        res.json({ success: true, comment });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/posts/comments/:commentId
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const post = await Post.findOne({ "comments._id": commentId });

        if (!post) {
            return res.json({ success: false, message: "Comment not found" });
        }

        const comment = post.comments.id(commentId);

        // Check if user owns the comment or post
        if (comment.userId.toString() !== userId.toString() &&
            post.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Unauthorized to delete this comment" });
        }

        comment.remove();
        await post.save();

        // Emit delete event to the post room
        io.to(`post:${post._id}`).emit("postUpdate", {
            postId: post._id,
            action: "deleteComment",
            userId: req.user._id,
            data: {
                commentId,
                commentsCount: post.comments.length
            }
        });

        res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// @desc    Like a comment
// @route   POST /api/posts/comments/:commentId/like
export const likeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const post = await Post.findOne({ "comments._id": commentId });

        if (!post) {
            return res.json({ success: false, message: "Comment not found" });
        }

        const comment = post.comments.id(commentId);

        // Check if already liked
        if (comment.likes.includes(userId)) {
            return res.json({ success: false, message: "Comment already liked" });
        }

        comment.likes.push(userId);
        await post.save();

        // Emit comment like event to the post room
        io.to(`post:${post._id}`).emit("postUpdate", {
            postId: post._id,
            action: "likeComment",
            userId: req.user._id,
            data: {
                commentId,
                likesCount: comment.likes.length,
                isLiked: true,
                user: {
                    _id: req.user._id,
                    fullName: req.user.fullName
                }
            }
        });

        res.json({
            success: true,
            likesCount: comment.likes.length,
            isLiked: true
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};