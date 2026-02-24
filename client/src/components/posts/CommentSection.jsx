import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { PostContext } from '../../../context/PostContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaSmile } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import EmojiPicker from 'emoji-picker-react';
import toast from 'react-hot-toast';

const CommentSection = ({ postId, comments: initialComments, onCommentAdded }) => {
    const { authUser } = useContext(AuthContext);
    const { addComment, likeComment } = useContext(PostContext);

    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const emojiPickerRef = useRef(null);
    const inputRef = useRef(null);

    // Update comments when initialComments changes
    useEffect(() => {
        setComments(initialComments || []);
    }, [initialComments]);

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

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) {
            toast.error('Please write a comment');
            return;
        }

        setIsSubmitting(true);
        try {
            const success = await addComment(postId, newComment.trim());
            if (success) {
                setNewComment('');
                onCommentAdded?.();
                toast.success('Comment added');
            }
        } catch (error) {
            toast.error('Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            await likeComment(commentId);
            // Optimistic update
            setComments(prev => prev.map(comment => {
                if (comment._id === commentId) {
                    const isLiked = comment.isLiked || false;
                    return {
                        ...comment,
                        isLiked: !isLiked,
                        likesCount: isLiked ? (comment.likesCount || 1) - 1 : (comment.likesCount || 0) + 1
                    };
                }
                return comment;
            }));
        } catch (error) {
            toast.error('Failed to like comment');
        }
    };

    const onEmojiClick = (emojiData) => {
        setNewComment(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 100);
    };

    const formatTime = (date) => {
        try {
            return formatDistanceToNow(new Date(date), { addSuffix: true });
        } catch {
            return 'some time ago';
        }
    };

    return (
        <div className='mt-4 pt-4 border-t border-gray-800'>
            {/* Comments List */}
            <div className='space-y-4 mb-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 pr-2'>
                <AnimatePresence initial={false}>
                    {comments.length > 0 ? (
                        comments.map((comment) => {
                            const isLiked = comment.isLiked || false;
                            const likesCount = comment.likesCount || 0;

                            return (
                                <motion.div
                                    key={comment._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className='flex gap-3 group'
                                >
                                    {/* Commenter Avatar */}
                                    <img
                                        src={comment.userId?.profilePic || 'https://via.placeholder.com/32'}
                                        alt={comment.userId?.fullName}
                                        className='w-8 h-8 rounded-full object-cover border border-purple-500/30 shrink-0'
                                    />

                                    {/* Comment Content */}
                                    <div className='flex-1'>
                                        <div className='bg-gray-800/50 rounded-2xl p-3 border border-gray-700'>
                                            <div className='flex items-center justify-between mb-1'>
                                                <span className='font-semibold text-sm text-white'>
                                                    {comment.userId?.fullName}
                                                </span>
                                                <span className='text-xs text-gray-500'>
                                                    {formatTime(comment.createdAt)}
                                                </span>
                                            </div>
                                            <p className='text-sm text-gray-300 wrap-break-word'>
                                                {comment.text}
                                            </p>
                                            {comment.image && (
                                                <img
                                                    src={comment.image}
                                                    alt="Comment attachment"
                                                    className='mt-2 max-h-32 rounded-lg cursor-pointer hover:opacity-90 transition'
                                                    onClick={() => window.open(comment.image, '_blank')}
                                                />
                                            )}
                                        </div>

                                        {/* Comment Actions - Only Like button remains */}
                                        <div className='flex items-center gap-4 mt-1 ml-2'>
                                            <button
                                                onClick={() => handleLikeComment(comment._id)}
                                                className={`text-xs flex items-center gap-1 transition ${isLiked
                                                        ? 'text-pink-500'
                                                        : 'text-gray-500 hover:text-pink-500'
                                                    }`}
                                            >
                                                {isLiked ? <FaHeart size={10} /> : <FaRegHeart size={10} />}
                                                <span>{likesCount}</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className='text-center py-6'
                        >
                            <p className='text-gray-500 text-sm'>No comments yet. Be the first to comment!</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmitComment} className='relative'>
                <div className='flex items-center gap-2'>
                    <div className='flex-1 relative'>
                        <input
                            ref={inputRef}
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className='w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 px-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition'
                            disabled={isSubmitting}
                        />

                        {/* Emoji Button */}
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition ${showEmojiPicker
                                    ? 'text-purple-400'
                                    : 'text-gray-500 hover:text-purple-400'
                                }`}
                        >
                            <FaSmile size={16} />
                        </motion.button>

                        {/* Emoji Picker */}
                        <AnimatePresence>
                            {showEmojiPicker && (
                                <motion.div
                                    ref={emojiPickerRef}
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    className='absolute bottom-full left-0 mb-2 z-50'
                                >
                                    <EmojiPicker
                                        onEmojiClick={onEmojiClick}
                                        autoFocusSearch={false}
                                        theme='dark'
                                        width={280}
                                        height={350}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isSubmitting || !newComment.trim()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='px-4 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-600/30 transition'
                    >
                        {isSubmitting ? (
                            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        ) : (
                            'Post'
                        )}
                    </motion.button>
                </div>
            </form>
        </div>
    );
};

export default CommentSection;