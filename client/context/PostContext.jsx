import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [feedPosts, setFeedPosts] = useState([]);
    const [currentPost, setCurrentPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const { axios, socket, authUser } = useContext(AuthContext);

    // Load feed posts
    const loadFeedPosts = useCallback(async (pageNum = 1, reset = false) => {
        if (!authUser) return;

        try {
            setLoading(true);
            const { data } = await axios.get(`/api/posts/feed?page=${pageNum}&limit=10`);

            if (data.success) {
                if (reset || pageNum === 1) {
                    setFeedPosts(data.posts);
                } else {
                    setFeedPosts(prev => [...prev, ...data.posts]);
                }
                setHasMore(data.hasMore);
                setPage(pageNum);
            }
        } catch (error) {
            toast.error('Failed to load posts');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [axios, authUser]);

    // Create new post
    const createPost = async (postData) => {
        try {
            const { data } = await axios.post('/api/posts', postData);
            if (data.success) {
                toast.success('Post created successfully');
                // Add to feed if it's public or user's own post
                if (data.post.privacy === 'public' || data.post.userId._id === authUser._id) {
                    setFeedPosts(prev => [data.post, ...prev]);
                }
                return true;
            }
            return false;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create post');
            return false;
        }
    };

    // Like post
    const likePost = async (postId) => {
        try {
            const { data } = await axios.post(`/api/posts/${postId}/like`);
            if (data.success) {
                // Update local state
                setFeedPosts(prev => prev.map(post =>
                    post._id === postId
                        ? { ...post, isLiked: true, likesCount: data.likesCount }
                        : post
                ));
                return true;
            }
            return false;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to like post');
            return false;
        }
    };

    // Unlike post
    const unlikePost = async (postId) => {
        try {
            const { data } = await axios.delete(`/api/posts/${postId}/like`);
            if (data.success) {
                setFeedPosts(prev => prev.map(post =>
                    post._id === postId
                        ? { ...post, isLiked: false, likesCount: data.likesCount }
                        : post
                ));
                return true;
            }
            return false;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to unlike post');
            return false;
        }
    };

    // Add comment
    const addComment = async (postId, text) => {
        try {
            const { data } = await axios.post(`/api/posts/${postId}/comments`, { text });
            if (data.success) {
                toast.success('Comment added');
                setFeedPosts(prev => prev.map(post =>
                    post._id === postId
                        ? {
                            ...post,
                            comments: [...post.comments, data.comment],
                            commentsCount: (post.commentsCount || 0) + 1
                        }
                        : post
                ));
                return true;
            }
            return false;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add comment');
            return false;
        }
    };

    // Delete post
    const deletePost = async (postId) => {
        try {
            const { data } = await axios.delete(`/api/posts/${postId}`);
            if (data.success) {
                toast.success('Post deleted');
                setFeedPosts(prev => prev.filter(post => post._id !== postId));
                return true;
            }
            return false;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete post');
            return false;
        }
    };

    // Like comment
    const likeComment = async (commentId) => {
        try {
            const { data } = await axios.post(`/api/posts/comments/${commentId}/like`);
            if (data.success) {
                // Update comment like status in state
                setFeedPosts(prev => prev.map(post => ({
                    ...post,
                    comments: post.comments.map(comment =>
                        comment._id === commentId
                            ? { ...comment, likesCount: data.likesCount, isLiked: data.isLiked }
                            : comment
                    )
                })));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to like comment');
        }
    };


    // Join post room for real-time updates
    const joinPostRoom = (postId) => {
        if (socket) {
            socket.emit('joinPost', postId);
        }
    };

    // Leave post room
    const leavePostRoom = (postId) => {
        if (socket) {
            socket.emit('leavePost', postId);
        }
    };

    // Socket event listeners for real-time updates
    useEffect(() => {
        if (!socket) return;

        // Listen for new posts
        socket.on('newPost', (newPost) => {
            setFeedPosts(prev => [newPost, ...prev]);
        });

        // Listen for post updates (likes, comments)
        socket.on('postUpdate', (data) => {
            console.log('Post update received:', data);

            setFeedPosts(prev => prev.map(post => {
                if (post._id === data.postId) {
                    switch (data.action) {
                        case 'like':
                            return {
                                ...post,
                                likesCount: data.data.likesCount,
                                
                            };
                        case 'unlike':
                            return {
                                ...post,
                                likesCount: data.data.likesCount
                            };
                        case 'comment':
                            return {
                                ...post,
                                comments: [...post.comments, data.data.comment],
                                commentsCount: (post.commentsCount || 0) + 1
                            };
                        case 'deleteComment':
                            return {
                                ...post,
                                comments: post.comments.filter(c => c._id !== data.data.commentId),
                                commentsCount: data.data.commentsCount
                            };
                        default:
                            return post;
                    }
                }
                return post;
            }));
        });

        // Listen for post deletion
        socket.on('postDeleted', ({ postId }) => {
            setFeedPosts(prev => prev.filter(post => post._id !== postId));
        });

        return () => {
            socket.off('newPost');
            socket.off('postUpdate');
            socket.off('postDeleted');
        };
    }, [socket]);

    const value = {
        posts,
        feedPosts,
        currentPost,
        loading,
        hasMore,
        page,
        setCurrentPost,
        loadFeedPosts,
        createPost,
        likePost,
        unlikePost,
        addComment,
        deletePost,
        likeComment,
        joinPostRoom,
        leavePostRoom
    };

    return (
        <PostContext.Provider value={value}>
            {children}
        </PostContext.Provider>
    );
};