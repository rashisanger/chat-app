import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMsgTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaImage, FaArrowLeft, FaEllipsisV, FaSmile, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import EmojiPicker from 'emoji-picker-react';

const ChatContainer = () => {
    const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
    const { authUser, onlineUsers } = useContext(AuthContext)

    const messagesEndRef = useRef(null)
    const containerRef = useRef(null)
    const fileInputRef = useRef(null)
    const emojiPickerRef = useRef(null)
    const inputRef = useRef(null)

    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [imagePreview, setImagePreview] = useState('')
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [isSending, setIsSending] = useState(false)

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSendMessage = async (e) => {
        e?.preventDefault();

        if ((!input.trim() && !selectedImage) || isSending) return;

        setIsSending(true);

        try {
            if (selectedImage) {
                await sendMessage({ image: selectedImage })
                setSelectedImage(null)
                setImagePreview('')
                if (fileInputRef.current) fileInputRef.current.value = ''
            } else {
                await sendMessage({ text: input.trim() })
                setInput("")
            }

            // Scroll to bottom after sending
            setTimeout(() => {
                if (messagesEndRef.current) {
                    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
                }
            }, 100);

        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setIsSending(false);
        }
    }

    const handleSendImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB")
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result)
            // Create preview
            const previewReader = new FileReader();
            previewReader.onloadend = () => {
                setImagePreview(previewReader.result)
            }
            previewReader.readAsDataURL(file)
        }
        reader.readAsDataURL(file);
        e.target.value = ""
    }

    const removeSelectedImage = () => {
        setSelectedImage(null)
        setImagePreview('')
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage(e)
        }
    }

    const onEmojiClick = (emojiData) => {
        setInput((prevInput) => prevInput + emojiData.emoji);
        setShowEmojiPicker(false);
        // Focus back on input after selecting emoji
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    };

    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
        }
    }, [selectedUser]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current && messages.length > 0) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages]);

    if (!selectedUser) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='flex flex-col items-center justify-center gap-4 text-gray-500 bg-linear-to-b from-gray-900/50 to-gray-950/50 max-md:hidden h-full rounded-2xl m-4'
            >
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    <img src={assets.logo_icon} alt="" className='w-20 h-20 opacity-50' />
                </motion.div>
                <p className='text-lg font-medium text-gray-400'>Select a user to start chatting</p>
                <p className='text-sm text-gray-600'>💬 Click on anyone from the sidebar</p>
            </motion.div>
        )
    }

    const isOnline = onlineUsers.includes(selectedUser._id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='h-full flex flex-col bg-linear-to-b from-gray-900 to-gray-950 relative rounded-2xl m-2 overflow-hidden border border-gray-800'
        >
            {/* Chat Header */}
            <div className='flex items-center gap-3 py-4 px-5 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10'>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedUser(null)}
                    className='md:hidden p-2 hover:bg-gray-800 rounded-full transition'
                >
                    <FaArrowLeft className='text-gray-400' />
                </motion.button>

                <div className='relative'>
                    <img
                        src={selectedUser.profilePic || assets.avatar_icon}
                        alt={selectedUser.fullName}
                        className='w-12 h-12 rounded-full object-cover border-2 border-purple-500/50'
                    />
                    {isOnline && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className='absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900'
                        />
                    )}
                </div>

                <div className='flex-1'>
                    <h2 className='font-semibold text-white'>{selectedUser.fullName}</h2>
                    <p className='text-xs text-gray-400 flex items-center gap-1'>
                        {isOnline ? (
                            <>
                                <span className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'></span>
                                Online
                            </>
                        ) : (
                            <>
                                <span className='w-1.5 h-1.5 bg-gray-500 rounded-full'></span>
                                Offline
                            </>
                        )}
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className='p-2 hover:bg-gray-800 rounded-full transition'
                >
                    <FaEllipsisV className='text-gray-400' />
                </motion.button>
            </div>

            {/* Messages Area */}
            <div
                ref={containerRef}
                className='flex-1 overflow-y-scroll p-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900'
            >
                <div className="flex flex-col space-y-4">
                    {messages.map((msg, index) => {
                        const isOwnMessage = msg.senderId === authUser._id;
                        const showAvatar = index === 0 || messages[index - 1]?.senderId !== msg.senderId;
                        const isLastMessage = index === messages.length - 1;

                        return (
                            <motion.div
                                key={msg._id || `msg-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: isLastMessage ? 0 : 0.05 }}
                                className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                {!isOwnMessage && showAvatar && (
                                    <img
                                        src={selectedUser?.profilePic || assets.avatar_icon}
                                        alt=""
                                        className='w-8 h-8 rounded-full object-cover mb-1 shrink-0'
                                    />
                                )}
                                {!isOwnMessage && !showAvatar && <div className='w-8 shrink-0'></div>}

                                <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                                    {msg.image ? (
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className='relative group'
                                        >
                                            <img
                                                src={msg.image}
                                                alt="message attachment"
                                                className='max-w-full max-h-80 rounded-2xl border border-gray-700 cursor-pointer'
                                                onClick={() => window.open(msg.image, '_blank')}
                                                loading="lazy"
                                            />
                                            <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-2xl flex items-center justify-center'>
                                                <span className='text-white text-sm'>Click to enlarge</span>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div
                                            className={`p-3 rounded-2xl text-sm wrap-break-word ${isOwnMessage
                                                    ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-br-none'
                                                    : 'bg-gray-800 text-gray-200 rounded-bl-none'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                    )}
                                    <div className='flex items-center gap-1 mt-1 px-2'>
                                        <span className='text-[10px] text-gray-500'>
                                            {formatMsgTime(msg.createdAt)}
                                        </span>
                                        {isOwnMessage && (
                                            <span className='text-[10px] text-gray-500'>
                                                {msg.seen ? '✓✓' : '✓'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {isOwnMessage && showAvatar && (
                                    <img
                                        src={authUser?.profilePic || assets.avatar_icon}
                                        alt=""
                                        className='w-8 h-8 rounded-full object-cover mb-1 shrink-0'
                                    />
                                )}
                                {isOwnMessage && !showAvatar && <div className='w-8 shrink-0'></div>}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Typing indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='flex items-center gap-2'
                    >
                        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-6 h-6 rounded-full' />
                        <div className='bg-gray-800 rounded-2xl p-3'>
                            <div className='flex gap-1'>
                                <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className='w-1.5 h-1.5 bg-gray-400 rounded-full' />
                                <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className='w-1.5 h-1.5 bg-gray-400 rounded-full' />
                                <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className='w-1.5 h-1.5 bg-gray-400 rounded-full' />
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Image Preview */}
            <AnimatePresence>
                {imagePreview && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className='absolute bottom-20 left-5 bg-gray-800 rounded-xl p-3 border border-gray-700 shadow-2xl z-20'
                    >
                        <div className='relative inline-block'>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className='max-h-32 rounded-lg'
                            />
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={removeSelectedImage}
                                className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition'
                            >
                                <FaTimes size={12} />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Emoji Picker */}
            <AnimatePresence>
                {showEmojiPicker && (
                    <motion.div
                        ref={emojiPickerRef}
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className='absolute bottom-20 left-5 z-50'
                    >
                        <EmojiPicker
                            onEmojiClick={onEmojiClick}
                            autoFocusSearch={false}
                            theme='dark'
                            skinTonesDisabled
                            width={320}
                            height={400}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Message Input Area */}
            <div className='p-4 bg-gray-900/90 backdrop-blur-sm border-t border-gray-800'>
                <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
                    <div className='flex-1 flex items-center bg-gray-800 rounded-full px-4 py-2 border border-gray-700 focus-within:border-purple-500 transition'>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className='flex-1 bg-transparent outline-none text-white text-sm placeholder-gray-500'
                            disabled={isSending}
                        />

                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={`text-gray-400 hover:text-purple-400 transition mr-1 ${showEmojiPicker ? 'text-purple-400' : ''}`}
                        >
                            <FaSmile size={18} />
                        </motion.button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            id="image"
                            accept='image/*'
                            onChange={handleSendImage}
                            hidden
                        />
                        <motion.label
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            htmlFor="image"
                            className='text-gray-400 hover:text-purple-400 transition cursor-pointer mr-1'
                        >
                            <FaImage size={18} />
                        </motion.label>
                    </div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={(!input.trim() && !selectedImage) || isSending}
                        className='p-3 bg-linear-to-r from-purple-600 to-pink-600 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-600/30 transition'
                    >
                        <FaPaperPlane size={18} />
                    </motion.button>
                </form>
            </div>
        </motion.div>
    )
}

export default ChatContainer