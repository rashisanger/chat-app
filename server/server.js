import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import postRouter from "./routes/postRoutes.js";  // 

import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);//socket io support http server

// Initialize socket.io server
export const io = new Server(server, {
    cors: { origin: "*" }//allow all origins
})
// store online user
export const userSocketMap = {}; //{userId,socketId}

// socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected", userId);

    if (userId) userSocketMap[userId] = socket.id;

    // ============ POST RELATED SOCKET EVENTS ============

    // Join a post room to receive real-time updates
    socket.on("joinPost", (postId) => {
        socket.join(`post:${postId}`);
        console.log(`User ${userId} joined post room: post:${postId}`);
    });

    // Leave a post room
    socket.on("leavePost", (postId) => {
        socket.leave(`post:${postId}`);
        console.log(`User ${userId} left post room: post:${postId}`);
    });

    // Typing indicator for post comments
    socket.on("commentTyping", ({ postId, isTyping }) => {
        socket.to(`post:${postId}`).emit("userCommentTyping", {
            userId,
            isTyping
        });
    });

    // ============ END POST EVENTS ============

    // Emit online users to all
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

//Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Route setup
app.use("/api/status", (req, res) => {
    res.send("Server is live");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/posts", postRouter);

//connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log("server is running on PORT:", PORT);
});