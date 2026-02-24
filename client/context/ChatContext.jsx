import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { toast } from 'react-hot-toast';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});
    const [loading, setLoading] = useState(false);

    const { socket, axios, authUser } = useContext(AuthContext);

    // Function to get all users for sidebar
    const getUsers = useCallback(async () => {
        if (!authUser) return;

        try {
            setLoading(true);
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                console.log("Users fetched:", data.users);
                setUsers(data.users || []);
                setUnseenMessages(data.unseenMessages || {});
            } else {
                toast.error(data.message || "Failed to fetch users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }, [axios, authUser]);

    // Function to get messages for selected user
    const getMessages = async (userId) => {
        if (!userId) return;

        try {
            setLoading(true);
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                console.log("Messages fetched:", data.messages);
                setMessages(data.messages || []);

                // Clear unseen messages for this user
                setUnseenMessages(prev => ({
                    ...prev,
                    [userId]: 0
                }));
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Send message to selected user
    const sendMessage = async (messageData) => {
        if (!selectedUser) {
            toast.error("No user selected");
            return false;
        }

        // Create a temporary message for immediate display
        const tempId = 'temp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        const tempMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text || '',
            image: messageData.image || null,
            seen: false,
            createdAt: new Date().toISOString(),
            temp: true // Mark as temporary
        };

        console.log("Adding temporary message:", tempMessage);

        // Add temporary message immediately
        setMessages((prevMessages) => [...prevMessages, tempMessage]);

        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            console.log("Send message response:", data);

            if (data.success) {
                // Replace temporary message with real one
                setMessages((prevMessages) =>
                    prevMessages.map(msg =>
                        msg._id === tempId ? { ...data.newMsg, temp: false } : msg
                    )
                );
                return true;
            } else {
                // Remove temporary message on error
                setMessages((prevMessages) =>
                    prevMessages.filter(msg => msg._id !== tempId)
                );
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            // Remove temporary message on error
            setMessages((prevMessages) =>
                prevMessages.filter(msg => msg._id !== tempId)
            );
            console.error("Error sending message:", error);
            toast.error(error.response?.data?.message || error.message);
            return false;
        }
    };

    // Mark message as seen
    const markMessageAsSeen = async (messageId) => {
        try {
            await axios.put(`/api/messages/mark/${messageId}`);
        } catch (error) {
            console.error("Error marking message as seen:", error);
        }
    };

    // Function to subscribe to new messages
    const subscribeToMessages = useCallback(() => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            console.log("New message received:", newMessage);

            setMessages((prevMessages) => {
                // Check if message already exists (including temporary ones)
                const messageExists = prevMessages.some(msg =>
                    msg._id === newMessage._id ||
                    (msg.temp &&
                        msg.senderId === newMessage.senderId &&
                        msg.text === newMessage.text &&
                        new Date(msg.createdAt).getTime() > Date.now() - 10000)
                );

                if (messageExists) {
                    console.log("Message already exists, skipping");
                    return prevMessages;
                }

                if (selectedUser && (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id)) {
                    // Message for current chat

                    // Mark as seen if it's from selected user
                    if (newMessage.senderId === selectedUser._id) {
                        markMessageAsSeen(newMessage._id);
                    }
                    return [...prevMessages, { ...newMessage, temp: false }];
                } else {
                    // Message for other user - update unseen count
                    const senderId = newMessage.senderId === authUser?._id ? newMessage.receiverId : newMessage.senderId;
                    setUnseenMessages((prev) => ({
                        ...prev,
                        [senderId]: (prev[senderId] || 0) + 1
                    }));
                    return prevMessages;
                }
            });
        });
    }, [socket, selectedUser, authUser]);

    // Function to unsubscribe from messages
    const unsubscribeFromMessages = useCallback(() => {
        if (socket) {
            socket.off("newMessage");
        }
    }, [socket]);

    // Select a user
    const selectUser = (user) => {
        setSelectedUser(user);
        setMessages([]); // Clear previous messages immediately
        if (user) {
            getMessages(user._id);
        }
    };

    // Clear messages when selectedUser becomes null
    useEffect(() => {
        if (!selectedUser) {
            setMessages([]);
        }
    }, [selectedUser]);

    // Load users when authUser changes
    useEffect(() => {
        if (authUser) {
            getUsers();
        }
    }, [authUser, getUsers]);

    // Subscribe to messages when socket and selectedUser are available
    useEffect(() => {
        if (socket && authUser) {
            subscribeToMessages();
            return () => unsubscribeFromMessages();
        }
    }, [socket, authUser, selectedUser, subscribeToMessages, unsubscribeFromMessages]);

    const value = {
        messages,
        users,
        selectedUser,
        unseenMessages,
        loading,
        getUsers,
        getMessages,
        sendMessage,
        selectUser,
        setSelectedUser,
        markMessageAsSeen
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};