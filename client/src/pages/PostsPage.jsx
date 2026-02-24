import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { PostContext } from '../../context/PostContext';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
    FaNewspaper,
    FaArrowLeft,
    FaFire,
    FaHashtag,
    FaUserGraduate,
    FaClock,
    FaHeart,
    FaComment,
    FaRocket
} from 'react-icons/fa';
import { GiBrain, GiCoffeeCup } from 'react-icons/gi';
import CreatePost from '../components/posts/CreatePost';
import PostList from '../components/posts/PostList';

const PostsPage = () => {
    const { authUser } = useContext(AuthContext);
    const postContext = useContext(PostContext);
    const navigate = useNavigate();

    // Trending topics data
    const [trendingTopics, setTrendingTopics] = useState([
        { tag: 'exams', posts: 234, color: 'from-purple-600 to-pink-600' },
        { tag: 'coding', posts: 189, color: 'from-blue-600 to-purple-600' },
        { tag: 'memes', posts: 456, color: 'from-pink-600 to-orange-600' },
        { tag: 'studygram', posts: 123, color: 'from-green-600 to-teal-600' },
        { tag: 'internship', posts: 98, color: 'from-orange-600 to-red-600' },
        { tag: 'assignments', posts: 167, color: 'from-purple-600 to-indigo-600' }
    ]);

    // User stats
    const [userStats, setUserStats] = useState({
        postsCount: 0,
        likesReceived: 0,
        commentsReceived: 0,
        daysActive: 0
    });

    useEffect(() => {
        if (!authUser) {
            navigate('/login');
        }
    }, [authUser, navigate]);

    useEffect(() => {
        if (postContext) {
            postContext.loadFeedPosts(1, true);

            // Calculate user stats from posts
            if (postContext.feedPosts) {
                const userPosts = postContext.feedPosts.filter(p => p.userId?._id === authUser?._id);
                const likes = userPosts.reduce((acc, post) => acc + (post.likesCount || 0), 0);
                const comments = userPosts.reduce((acc, post) => acc + (post.commentsCount || 0), 0);

                setUserStats({
                    postsCount: userPosts.length,
                    likesReceived: likes,
                    commentsReceived: comments,
                    daysActive: Math.floor((Date.now() - new Date(authUser?.createdAt).getTime()) / (1000 * 60 * 60 * 24)) || 1
                });
            }
        }
    }, [postContext, authUser]);

    if (!authUser || !postContext) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="text-white flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    Loading posts...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Header - Dark Purple like Landing Page */}
            <div className="bg-purple-950/80 backdrop-blur-sm border-b border-purple-900/50 sticky top-16 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/app')}
                                className="p-2 hover:bg-purple-800 rounded-lg transition md:hidden"
                            >
                                <FaArrowLeft className="text-gray-300" />
                            </motion.button>

                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-10 h-10 bg-purple-700 rounded-xl flex items-center justify-center">
                                    <FaNewspaper className="text-white text-lg" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Community Feed</h1>
                                    <p className="text-xs text-purple-300">Share your thoughts with everyone</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Empty div for spacing */}
                        <div className="w-10"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar - User Info & Stats */}
                    <div className="hidden lg:block lg:col-span-2">
                        <div className="sticky top-28 space-y-4">
                            {/* User Profile Card */}
                            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-purple-900/50">
                                <div className="flex flex-col items-center text-center">
                                    <img
                                        src={authUser?.profilePic || 'https://via.placeholder.com/64'}
                                        alt={authUser?.fullName}
                                        className="w-16 h-16 rounded-full border-2 border-purple-500 mb-3"
                                    />
                                    <h3 className="font-semibold text-white">{authUser?.fullName}</h3>
                                    <p className="text-xs text-purple-400 mt-1">@{authUser?.email?.split('@')[0]}</p>

                                    <div className="w-full mt-3 pt-3 border-t border-gray-800">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Member for</span>
                                            <span className="text-white">{userStats.daysActive} days</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User Stats Card */}
                            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-purple-900/50">
                                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                    <FaRocket className="text-purple-400" />
                                    Your Activity
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-xs flex items-center gap-1">
                                            <FaNewspaper className="text-purple-400" /> Posts
                                        </span>
                                        <span className="text-white font-semibold">{userStats.postsCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-xs flex items-center gap-1">
                                            <FaHeart className="text-pink-400" /> Likes received
                                        </span>
                                        <span className="text-white font-semibold">{userStats.likesReceived}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 text-xs flex items-center gap-1">
                                            <FaComment className="text-blue-400" /> Comments
                                        </span>
                                        <span className="text-white font-semibold">{userStats.commentsReceived}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Tips Card */}
                            <div className="bg-purple-950/30 rounded-xl p-4 border border-purple-900/50">
                                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                                    <GiBrain className="text-purple-400" />
                                    Quick Tips
                                </h4>
                                <ul className="space-y-2 text-xs text-gray-400">
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-400">•</span>
                                        Add images to get more likes
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-400">•</span>
                                        Use hashtags to reach more students
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-400">•</span>
                                        Engage with comments to build community
                                    </li>
                                </ul>
                            </div>

                            {/* Study Buddy Card */}
                            <div className="bg-linear-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-500/30">
                                <div className="flex items-start gap-3">
                                    <GiCoffeeCup className="text-2xl text-purple-400 shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-white mb-1">Study Buddy?</h4>
                                        <p className="text-xs text-gray-400">
                                            Find study partners in the <button onClick={() => navigate('/app')} className="text-purple-400 hover:underline">chat section</button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Feed Area */}
                    <div className="lg:col-span-7">
                        {/* Create Post - Dark Theme */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-6"
                        >
                            <div className="bg-purple-950/30 rounded-2xl p-1 border border-purple-900/50">
                                <div className="bg-gray-900 rounded-xl">
                                    <CreatePost />
                                </div>
                            </div>
                        </motion.div>

                        {/* Posts List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <PostList />
                        </motion.div>
                    </div>

                    {/* Right Sidebar - Trending Topics */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-28 space-y-4">
                            {/* Trending Topics Card */}
                            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-5 border border-purple-900/50">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <FaFire className="text-orange-500" />
                                    <span>Trending Now</span>
                                </h3>

                                <div className="space-y-3">
                                    {trendingTopics.map((topic, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-900/30 transition">
                                                <div className="flex items-center gap-2">
                                                    <FaHashtag className={`text-sm bg-linear-to-r ${topic.color} bg-clip-text text-transparent`} />
                                                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition">
                                                        {topic.tag}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-xs text-gray-500">{topic.posts}</span>
                                                    <span className="text-xs text-gray-600">posts</span>
                                                </div>
                                            </div>

                                            {/* Trending bar - visual indicator */}
                                            <div className="w-full h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, (topic.posts / 500) * 100)}%` }}
                                                    transition={{ delay: index * 0.1 + 0.3 }}
                                                    className={`h-full bg-linear-to-r ${topic.color}`}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="mt-4 pt-3 border-t border-gray-800">
                                    <p className="text-xs text-gray-500 text-center">
                                        Updated in real-time • Based on student activity
                                    </p>
                                </div>
                            </div>

                            {/* Study Tip Card */}
                            <div className="bg-purple-950/30 rounded-xl p-4 border border-purple-900/50">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-purple-800 rounded-lg flex items-center justify-center shrink-0">
                                        <span className="text-lg">📚</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white mb-1">Study Tip</h4>
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            Break your study sessions into 25-minute chunks with 5-minute breaks.
                                            Your brain will thank you!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Back to Chat Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/app')}
                                className="w-full px-4 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-xl flex items-center justify-center gap-2 transition border border-purple-500/30"
                            >
                                <FaArrowLeft size={14} />
                                Back to Chat
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Back Button */}
            <div className="lg:hidden fixed bottom-6 right-6">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/app')}
                    className="w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center shadow-lg shadow-purple-900/50"
                >
                    <FaArrowLeft className="text-white" />
                </motion.button>
            </div>
        </div>
    );
};

export default PostsPage;