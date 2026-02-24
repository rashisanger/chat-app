import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import assets from '../assets/assets'
import {
    FaRocket,
    FaComments,
    FaGraduationCap,
    FaHeart,
    FaArrowRight,
    FaGithub,
    FaTwitter,
    FaLinkedin,
    FaLaugh,
    FaBook
} from 'react-icons/fa';
import { MdChat } from 'react-icons/md';
import { BsLightningChargeFill } from 'react-icons/bs';
import { GiCoffeeCup } from 'react-icons/gi';

// GIF URLs
const studyGifs = [
    "https://media.giphy.com/media/l0MYEqE4y7irQfsjen/giphy.gif",
    "https://media.giphy.com/media/26gR2qGRnxxXAvhBu/giphy.gif",
    "https://media.giphy.com/media/l0MYt5jH6gkTWm8qo/giphy.gif",
    "https://media.giphy.com/media/3o7abB06u9bNzA8LC8/giphy.gif",
];

const memeGifs = [
    "https://media.giphy.com/media/3o7abB06u9bNzA8LC8/giphy.gif",
    "https://media.giphy.com/media/l0MYEqE4y7irQfsjen/giphy.gif",
    "https://media.giphy.com/media/26gR2qGRnxxXAvhBu/giphy.gif",
    "https://media.giphy.com/media/l0MYt5jH6gkTWm8qo/giphy.gif",
];

const LandingPage = () => {
    const { authUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [currentGif, setCurrentGif] = useState(0);
    const [stats, setStats] = useState({
        users: 1234,
        messages: 45678,
        posts: 2345,
        reactions: 5678
    });


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentGif((prev) => (prev + 1) % studyGifs.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                users: prev.users + Math.floor(Math.random() * 5),
                messages: prev.messages + Math.floor(Math.random() * 50),
                posts: prev.posts + Math.floor(Math.random() * 10),
                reactions: prev.reactions + Math.floor(Math.random() * 20)
            }));
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: <MdChat className="text-3xl" />,
            title: "One-on-One Chat",
            description: "Private, real-time conversations with friends",
            color: "bg-purple-600"
        },
        {
            icon: <FaGraduationCap className="text-3xl" />,
            title: "Study Posts",
            description: "Share notes, assignments, and study materials",
            color: "bg-blue-600"
        },
        {
            icon: <FaLaugh className="text-3xl" />,
            title: "Meme Central",
            description: "Post relatable memes and lighten the mood",
            color: "bg-pink-600"
        },
        {
            icon: <FaHeart className="text-3xl" />,
            title: "Like & Comment",
            description: "Engage with posts and start discussions",
            color: "bg-green-600"
        }
    ];

    const stats_data = [
        { label: "Active Students", value: stats.users, icon: "👥" },
        { label: "Messages Sent", value: stats.messages, icon: "💬" },
        { label: "Posts Shared", value: stats.posts, icon: "📝" },
        { label: "Reactions", value: stats.reactions, icon: "❤️" }
    ];

    const recentPosts = [
        {
            type: "study",
            user: "Alex",
            content: "📚 CS101 notes - Linked Lists explained!",
            likes: 45,
            comments: 12,
            time: "2h ago"
        },
        {
            type: "meme",
            user: "Priya",
            content: "When the professor says 'this won't be in exam'",
            likes: 89,
            comments: 23,
            time: "4h ago"
        },
        {
            type: "study",
            user: "Raj",
            content: "🧮 Calculus cheat sheet - DM me!",
            likes: 67,
            comments: 34,
            time: "6h ago"
        },
        {
            type: "meme",
            user: "Neha",
            content: "Me trying to understand pointers:",
            likes: 112,
            comments: 45,
            time: "8h ago"
        }
    ];

    // Handle main action based on auth state
    const handleMainAction = () => {
        if (authUser) {
            navigate('/app');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white overflow-hidden">

            <div className="fixed inset-0 bg-linear-to-b from-gray-950 to-gray-900 -z-10"></div>


            <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <img src={assets.logo_icon} alt="" className='w-10' />
                    <span className="text-2xl font-bold text-white">
                        QuickChat
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4"
                >
                    {authUser ? (
                        <button
                            onClick={() => navigate('/app')}
                            className="px-6 py-2 bg-purple-600 rounded-full font-semibold hover:bg-purple-700 transition flex items-center gap-2"
                        >
                            <FaComments />
                            Go to Chat
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-6 py-2 text-gray-300 hover:text-white transition"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-6 py-2 bg-purple-600 rounded-full font-semibold hover:bg-purple-700 transition"
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </motion.div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-6 pt-20 pb-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
                            Chat, Share, and{' '}
                            <span className="text-purple-400">
                                Survive College
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-8">
                            One-on-one chats + student posts. Share notes, memes, and everything in between.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-12">
                            <button
                                onClick={handleMainAction}
                                className="px-8 py-4 bg-purple-600 rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-purple-700 transition"
                            >
                                {authUser ? 'Go to Chat' : 'Start Chatting'}
                                <FaArrowRight />
                            </button>
                            <button
                                onClick={() => navigate(authUser ? '/posts' : '/login')}
                                className="px-8 py-4 bg-gray-800 rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-gray-700 transition"
                            >
                                <GiCoffeeCup />
                                {authUser ? 'Browse Posts' : 'See Posts'}
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats_data.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="text-center bg-gray-900 rounded-lg p-3"
                                >
                                    <div className="text-2xl mb-1">{stat.icon}</div>
                                    <div className="text-2xl font-bold text-purple-400">
                                        {stat.value.toLocaleString()}+
                                    </div>
                                    <div className="text-xs text-gray-500">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right side - GIF Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative"
                    >
                        <div className="bg-gray-900 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-800">
                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                                    <FaComments />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Trending Posts</h3>
                                    <p className="text-xs text-gray-500">What students are sharing</p>
                                </div>
                            </div>

                            {/* Post Feed */}
                            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                                {recentPosts.map((post, index) => (
                                    <div key={index} className="flex gap-3 bg-gray-800 rounded-lg p-3">
                                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm">
                                            {post.user[0]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm text-white">{post.user}</span>
                                                <span className="text-xs text-gray-500">{post.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 mt-1">{post.content}</p>
                                            <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                                <span>❤️ {post.likes}</span>
                                                <span>💬 {post.comments}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="absolute -top-4 -right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            ⚡ 1-on-1 Chat
                        </div>
                        <div className="absolute -bottom-4 -left-4 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            📸 Post Memes
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-20">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-center mb-4 text-white"
                >
                    Everything a Student Needs
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-500 text-center mb-12 max-w-2xl mx-auto"
                >
                    Private chats + student posts = the perfect college companion
                </motion.p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition"
                        >
                            <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 text-white`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Posts Preview */}
            <section className="container mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gray-900 rounded-2xl p-8"
                >
                    <h2 className="text-3xl font-bold mb-8 text-center text-white">
                        What Students Are Posting
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Study Posts */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
                                <FaBook className="text-purple-400" />
                                Study Materials
                            </h3>
                            {recentPosts.filter(p => p.type === 'study').map((post, idx) => (
                                <div key={idx} className="bg-gray-800 rounded-lg p-4">
                                    <p className="text-gray-300">{post.content}</p>
                                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                        <span>❤️ {post.likes}</span>
                                        <span>💬 {post.comments}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Meme Posts */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
                                <FaLaugh className="text-pink-400" />
                                Relatable Memes
                            </h3>
                            {recentPosts.filter(p => p.type === 'meme').map((post, idx) => (
                                <div key={idx} className="bg-gray-800 rounded-lg p-4">
                                    <p className="text-gray-300">{post.content}</p>
                                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                        <span>❤️ {post.likes}</span>
                                        <span>💬 {post.comments}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* CTA Section - Dark Purple with Floating Emojis */}
            <section className="container mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="bg-purple-900 rounded-3xl p-12 relative overflow-hidden">

                        {/* Floating Emojis */}
                        <div className="absolute inset-0 pointer-events-none">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute top-10 left-10 text-3xl opacity-20"
                            >
                                😂
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                                className="absolute top-20 right-20 text-3xl opacity-20"
                            >
                                📚
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                                className="absolute bottom-10 left-20 text-3xl opacity-20"
                            >
                                💀
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4.5, repeat: Infinity, delay: 1.5 }}
                                className="absolute bottom-20 right-10 text-3xl opacity-20"
                            >
                                🤓
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                                className="absolute top-1/3 left-1/4 text-3xl opacity-20"
                            >
                                😭
                            </motion.div>
                        </div>

                        <div className="relative grid md:grid-cols-2 gap-8 items-center">
                            {/* Left side */}
                            <div className="text-left text-white">
                                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                    {authUser ? 'Welcome Back!' : 'Ready to join?'} <span className="text-4xl animate-bounce inline-block">🎉</span>
                                </h2>

                                <p className="text-xl text-purple-200 mb-6">
                                    {authUser
                                        ? 'Continue chatting and sharing with your friends.'
                                        : '10,000+ students already here. Chat, share memes, survive college together.'}
                                </p>

                                {/* Stats with emojis */}
                                <div className="flex flex-wrap gap-3 mb-8">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-purple-800 rounded-full px-4 py-2 text-sm flex items-center gap-1"
                                    >
                                        <span>📚</span> 5K+ notes
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-purple-800 rounded-full px-4 py-2 text-sm flex items-center gap-1"
                                    >
                                        <span>😂</span> 10K+ memes
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-purple-800 rounded-full px-4 py-2 text-sm flex items-center gap-1"
                                    >
                                        <span>💬</span> 50K+ chats
                                    </motion.div>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-wrap gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleMainAction}
                                        className="px-8 py-4 bg-white text-purple-900 rounded-full font-bold text-lg flex items-center gap-2 hover:bg-gray-100 transition"
                                    >
                                        {authUser ? 'Go to Chat' : 'Join Now'} <span className="text-2xl">🚀</span>
                                    </motion.button>

                                    {!authUser && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate('/login')}
                                            className="px-8 py-4 bg-purple-800 text-white rounded-full font-semibold text-lg hover:bg-purple-700 transition flex items-center gap-2"
                                        >
                                            <span>📱</span> Browse Posts
                                        </motion.button>
                                    )}
                                </div>

                                {/* Live count */}
                                <div className="mt-6 flex items-center gap-2 text-sm text-purple-300">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    <span>{stats.users}+ students online now</span>
                                </div>
                            </div>

                            {/* Right side - Meme Gallery with Working GIFs */}
                            <div className="relative h-80 hidden md:block">
                                {/* Meme gallery images - keep as is */}
                                <motion.div
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-2xl overflow-hidden border-4 border-purple-400 z-20 bg-purple-800 shadow-2xl"
                                >
                                    <img
                                        src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGFmODJ3bmN6dHNvNjZocGltaXNncjR2dTI5dnNrdDV3emsxZHhmdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ws6T5PN7wHv3cY8xy8/giphy.gif"
                                        alt="coding meme"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://i.imgur.com/8Qr8r8r.gif";
                                        }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-purple-900/90 text-xs p-1 text-center">
                                        🖥️ When code works
                                    </div>
                                </motion.div>

                                {/* Top right meme */}
                                <motion.div
                                    animate={{ rotate: [0, 5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute top-0 right-0 w-36 h-36 rounded-2xl overflow-hidden border-4 border-purple-500 z-10 bg-purple-800 shadow-xl"
                                >
                                    <img
                                        src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjY2NGluZzYwZW9za20yNXdzNTV5emNmN3AwMGlsYXdqbW5meGhtZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2Jeev6AvurRQMgEM/giphy.gif"
                                        alt="coffee meme"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://i.imgur.com/7YQqQqQ.gif";
                                        }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-purple-900/90 text-xs p-1 text-center">
                                        ☕ Exam prep
                                    </div>
                                </motion.div>

                                {/* Bottom left meme */}
                                <motion.div
                                    animate={{ rotate: [0, -5, 0] }}
                                    transition={{ duration: 4.5, repeat: Infinity }}
                                    className="absolute bottom-0 left-0 w-32 h-32 rounded-2xl overflow-hidden border-4 border-purple-500 z-10 bg-purple-800 shadow-xl"
                                >
                                    <img
                                        src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTdlbGJrczY2MzZzcWljbXV1c2Q5czlqMjYzMG12cWdqaHdpYmIwZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8dYmJ6Buo3lYY/giphy.gif"
                                        alt="brain meme"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://i.imgur.com/8Qr8r8r.gif";
                                        }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-purple-900/90 text-xs p-1 text-center">
                                        🧠 2AM study
                                    </div>
                                </motion.div>

                                {/* Small floating meme - Top left */}
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute top-10 left-10 w-16 h-16 rounded-xl overflow-hidden border-2 border-purple-400 bg-purple-800 shadow-lg"
                                >
                                    <img
                                        src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExY201MWg4eDFycGQzeHljN2RwZ2wxMDA2Y3dteXRiOG9tZmVzdDVwMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZqlvCTNHpqrio/giphy.gif"
                                        alt="funny"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>

                                {/* Small floating meme - Bottom right */}
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                    className="absolute bottom-10 right-10 w-16 h-16 rounded-xl overflow-hidden border-2 border-purple-400 bg-purple-800 shadow-lg"
                                >
                                    <img
                                        src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmYwNDhpYmw2c3FiMm5zdXpnYW5ncWl4cmpnc2ttNXZzdWkzaTZjMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/v9lm43DQcsKtRPzu9z/giphy.gif"
                                        alt="funny"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        {/* Bottom join strip */}
                        <div className="relative mt-8 pt-6 border-t border-purple-700">
                            <p className="text-center text-purple-300 text-sm flex items-center justify-center gap-2">
                                <span className="text-yellow-400">⚡</span>
                                <span>{stats.users}+ students online now</span>
                                <span className="text-yellow-400">⚡</span>
                            </p>
                            <div className="flex justify-center gap-2 mt-2 text-sm text-purple-300">
                                <span>#studymemes</span>
                                <span>#collegelife</span>
                                <span>#examseason</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-800 mt-20">
                <div className="container mx-auto px-6 py-12">
                    {/* 3 Columns */}
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        {/* Brand */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                                <BsLightningChargeFill className="text-2xl text-purple-400" />
                                <span className="text-xl font-bold text-white">QuickChat</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Chat, share memes, and survive college with friends.
                            </p>

                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>{stats.users}+ students online</span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-white">Quick Links</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><button onClick={() => navigate('/')} className="hover:text-white transition">Home</button></li>
                                <li><button onClick={() => navigate('/login')} className="hover:text-white transition">Login</button></li>
                                <li><button onClick={() => navigate('/login')} className="hover:text-white transition">Sign Up</button></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            {/* Meme of the day with image */}
                            <div className="bg-gray-800 rounded-lg p-3">
                                <p className="text-xs text-gray-400 mb-2">🔥 Meme of the day:</p>
                                <div className="relative">
                                    <img
                                        src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjhneXU1bnEybmdkczBpamZxZWl4aDV3c2lkcmhmNzBwMTA2amJ1bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GghGKaZ8JeHJx0apQC/giphy.gif"
                                        alt="meme of the day"
                                        className="w-full h-65 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://i.imgur.com/LvwO7xM.gif";
                                        }}
                                    />
                                    <p className="text-sm text-white mt-2 font-medium">
                                        "Me trying to understand pointers" 😂
                                    </p>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                        <span>❤️ 234</span>
                                        <span>💬 56</span>
                                        <span>🔄 12</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 mt-8 border-t border-gray-800">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <span>© 2026 QuickChat</span>
                                <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                <span>Made by students</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-purple-400">⚡</span>
                                <span>v1.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Scrollbar Styles */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1f2937;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #4c1d95;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;