import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import io from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    // Posts features
    const [posts, setPosts] = useState([]);
    const [feedPosts, setFeedPosts] = useState([]);
    const [currentPost, setCurrentPost] = useState(null);

    // Check if user is authenticated
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Auth check failed:", error);
            return false;
        }
    };

    // Login / Signup function
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
                return true; // Return success for navigation
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return false;
        }
    };

    // Logout Function
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        setPosts([]);
        setFeedPosts([]);
        setCurrentPost(null);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out successfully");

        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    };

    // Update profile function
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
                return true;
            }
            return false;
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return false;
        }
    };

    // Connect socket function
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            },
            transports: ['websocket'],
            withCredentials: true
        });

        newSocket.on("connect", () => {
            console.log("Socket connected");
        });

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });

        newSocket.on("connect_error", (err) => {
            console.error("Socket connection error:", err);
        });

        setSocket(newSocket);
    };

    // Initialize auth on mount
    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                axios.defaults.headers.common["token"] = token;
                await checkAuth();
            }
        };
        initAuth();
    }, []);

    // Cleanup socket on unmount
    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        posts,
        feedPosts,
        currentPost,
        setPosts,
        setFeedPosts,
        setCurrentPost,
        login,
        logout,
        updateProfile,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};