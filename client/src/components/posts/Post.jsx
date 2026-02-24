import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { PostContext } from '../../../context/PostContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaEllipsisH, FaTrash, FaTimes, FaLink } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import CommentSection from './CommentSection';
import toast from 'react-hot-toast';

const Post = ({ post, onPostDeleted }) => {
    const { authUser } = useContext(AuthContext);
    const { likePost, unlikePost, deletePost, joinPostRoom, leavePostRoom } = useContext(PostContext);

    const [liked, setLiked] = useState(post.isLiked || false);
    const [likesCount, setLikesCount] = useState(post.likesCount || 0);
    const [showComments, setShowComments] = useState(false);
    const [commentsCount, setCommentsCount] = useState(post.commentsCount || post.comments?.length || 0);
    const [showOptions, setShowOptions] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showFullImage, setShowFullImage] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);

    const optionsRef = useRef(null);
    const shareMenuRef = useRef(null);
    const postId = post._id;

    // Join post room for real-time updates
    useEffect(() => {
        joinPostRoom(postId);
        return () => leavePostRoom(postId);
    }, [postId]);

    // Close options when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(false);
            }
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
                setShowShareMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLike = async () => {
        try {
            if (liked) {
                const success = await unlikePost(postId);
                if (success) {
                    setLiked(false);
                    setLikesCount(prev => prev - 1);
                }
            } else {
                const success = await likePost(postId);
                if (success) {
                    setLiked(true);
                    setLikesCount(prev => prev + 1);
                }
            }
        } catch (error) {
            toast.error('Failed to process like');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        setIsDeleting(true);
        try {
            const success = await deletePost(postId);
            if (success) {
                toast.success('Post deleted');
                onPostDeleted?.(postId);
            }
        } catch (error) {
            toast.error('Failed to delete post');
        } finally {
            setIsDeleting(false);
        }
    };

    // Share functionality - Copy link only (reliable)
    const handleCopyLink = () => {
        const postUrl = `${window.location.origin}/posts?post=${postId}`;
        navigator.clipboard.writeText(postUrl).then(() => {
            toast.success('Link copied to clipboard!');
            setShowShareMenu(false);
        }).catch(() => {
            toast.error('Failed to copy link');
        });
    };

    // Native share if available
    const handleNativeShare = async () => {
        const postUrl = `${window.location.origin}/posts?post=${postId}`;
        const postText = `Check out this post by ${post.userId?.fullName || 'a student'}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'QuickChat Post',
                    text: postText,
                    url: postUrl,
                });
                setShowShareMenu(false);
                // Only show success if share was completed
                toast.success('Shared successfully!');
            } catch (error) {
                // User cancelled - don't show error
                if (error.name !== 'AbortError' && error.name !== 'CancelError') {
                    console.error('Share failed:', error);
                    handleCopyLink();
                }
            }
        } else {
            handleCopyLink();
        }
    };

    const formatTime = (date) => {
        try {
            return formatDistanceToNow(new Date(date), { addSuffix: true });
        } catch {
            return 'some time ago';
        }
    };

    const isOwner = post.userId?._id === authUser?._id;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className='bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-5 mb-4 shadow-xl hover:border-gray-700 transition'
            >
                {/* Post Header */}
                <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                        <img
                            src={post.userId?.profilePic || 'https://via.placeholder.com/40'}
                            alt={post.userId?.fullName}
                            className='w-12 h-12 rounded-full object-cover border-2 border-purple-500/50'
                        />
                        <div>
                            <h4 className='font-semibold text-white'>{post.userId?.fullName}</h4>
                            <div className='flex items-center gap-2 text-xs text-gray-500'>
                                <span>{formatTime(post.createdAt)}</span>
                                {post.privacy && (
                                    <>
                                        <span className='w-1 h-1 bg-gray-600 rounded-full'></span>
                                        <span className='capitalize'>
                                            {post.privacy === 'public' && '🌍 Public'}
                                            {post.privacy === 'friends' && '👥 Friends'}
                                            {post.privacy === 'private' && '🔒 Private'}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Post Options Menu */}
                    {isOwner && (
                        <div className='relative' ref={optionsRef}>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowOptions(!showOptions)}
                                className='p-2 hover:bg-gray-800 rounded-full transition'
                            >
                                <FaEllipsisH className='text-gray-400' />
                            </motion.button>

                            <AnimatePresence>
                                {showOptions && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        className='absolute right-0 mt-2 w-40 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 z-20'
                                    >
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className='w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition first:rounded-t-xl last:rounded-b-xl flex items-center gap-2'
                                        >
                                            {isDeleting ? (
                                                <div className='w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin'></div>
                                            ) : (
                                                <FaTrash size={14} />
                                            )}
                                            Delete
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Post Content */}
                <div className='mb-4'>
                    <p className='text-gray-200 whitespace-pre-wrap wrap-break-word mb-3'>
                        {post.text}
                    </p>
                    {post.image && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.02 }}
                            className='relative group cursor-pointer'
                            onClick={() => setShowFullImage(true)}
                        >
                            <img
                                src={post.image}
                                alt="Post content"
                                className='w-full max-h-96 object-contain rounded-xl border border-gray-700 bg-gray-800/50'
                            />
                            <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center'>
                                <span className='text-white text-sm'>Click to enlarge</span>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Post Stats */}
                <div className='flex items-center justify-between text-sm text-gray-400 border-t border-gray-800 pt-3 mb-3'>
                    <div className='flex items-center gap-1'>
                        <FaHeart className={likesCount > 0 ? 'text-pink-500' : 'text-gray-600'} />
                        <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <FaComment className='text-gray-600' />
                        <span>{commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}</span>
                    </div>
                </div>

                {/* Post Actions */}
                <div className='flex items-center justify-around border-t border-gray-800 pt-3'>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl transition ${liked
                                ? 'text-pink-500'
                                : 'text-gray-400 hover:text-pink-500 hover:bg-gray-800/50'
                            }`}
                    >
                        {liked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                        <span className='text-sm font-medium'>Like</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl transition ${showComments
                                ? 'text-purple-400'
                                : 'text-gray-400 hover:text-purple-400 hover:bg-gray-800/50'
                            }`}
                    >
                        <FaComment size={18} />
                        <span className='text-sm font-medium'>Comment</span>
                    </motion.button>

                    {/* Share Button with Menu */}
                    <div className='relative'>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowShareMenu(!showShareMenu)}
                            className='flex items-center gap-2 px-6 py-2 rounded-xl text-gray-400 hover:text-blue-400 hover:bg-gray-800/50 transition'
                        >
                            <FaShare size={18} />
                            <span className='text-sm font-medium'>Share</span>
                        </motion.button>

                        <AnimatePresence>
                            {showShareMenu && (
                                <motion.div
                                    ref={shareMenuRef}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className='absolute bottom-full left-0 mb-2 w-48 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-30'
                                >
                                    <button
                                        onClick={handleNativeShare}
                                        className='w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition flex items-center gap-2'
                                    >
                                        <FaShare size={14} className='text-blue-400' />
                                        Share via...
                                    </button>
                                    <button
                                        onClick={handleCopyLink}
                                        className='w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition flex items-center gap-2'
                                    >
                                        <FaLink size={14} className='text-green-400' />
                                        Copy link
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className='overflow-hidden'
                        >
                            <CommentSection
                                postId={postId}
                                comments={post.comments || []}
                                onCommentAdded={() => setCommentsCount(prev => prev + 1)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Full Image Modal */}
            <AnimatePresence>
                {showFullImage && post.image && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowFullImage(false)}
                        className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className='relative max-w-5xl max-h-[90vh]'
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={post.image}
                                alt="Post content"
                                className='max-w-full max-h-[90vh] object-contain rounded-lg'
                            />
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowFullImage(false)}
                                className='absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition backdrop-blur-sm border border-white/20'
                            >
                                <FaTimes size={20} />
                            </motion.button>
                            <a
                                href={post.image}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='absolute bottom-4 right-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm transition'
                            >
                                Open Original
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Post;