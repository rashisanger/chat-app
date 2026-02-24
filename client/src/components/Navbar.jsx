import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaComments,
    FaNewspaper,
    FaUser,
    FaSignOutAlt,
    FaCog,
    FaBolt,
    FaPlus,
    FaUserFriends,
    FaImage,
    FaQuestion,
    FaMoon,
    FaSun
} from 'react-icons/fa';

import assets from '../assets/assets';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { authUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true); // You can expand this later

    if (!authUser) return null;

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleCreatePost = () => {
        setShowActionsMenu(false);
        navigate('/posts');
       
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    const handleFindFriends = () => {
        setShowActionsMenu(false);
        navigate('/app');
        toast.success('Browse users to start chatting!');
    };

    const handleSharePhoto = () => {
        setShowActionsMenu(false);
        
        if (location.pathname === '/posts') {
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.click();
            } else {
                navigate('/posts');
                setTimeout(() => {
                    const input = document.querySelector('input[type="file"]');
                    if (input) input.click();
                }, 500);
            }
        } else {
            navigate('/posts');
            toast.success('Go to posts to share photos!');
        }
    };

    const handleHelp = () => {
        setShowActionsMenu(false);
        toast.success('QuickChat v1.0 - Built for students 🎓');
    };

    

    return (
        <>
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className='fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 z-50'
            >
                <div className='container mx-auto px-4'>
                    <div className='flex items-center justify-between h-16'>
                        {/* Logo Section */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className='flex items-center gap-2 cursor-pointer'
                            onClick={() => navigate('/')}
                        >
                            <img src={assets.logo} alt="QuickChat" className='h-8 w-auto font-bold' />
                            
                        </motion.div>

                        {/* Navigation Links - Center */}
                        <div className='flex items-center gap-1 sm:gap-2'>
                            <NavButton
                                to="/app"
                                active={isActive('/app')}
                                icon={<FaComments />}
                                label="Chat"
                            />
                            <NavButton
                                to="/posts"
                                active={isActive('/posts')}
                                icon={<FaNewspaper />}
                                label="Posts"
                            />
                        </div>

                        {/* Right Section - Quick Actions & Profile */}
                        <div className='flex items-center gap-2'>
                            {/* Quick Actions Menu */}
                            <div className='relative'>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowActionsMenu(!showActionsMenu)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${showActionsMenu
                                            ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                        }`}
                                >
                                    <FaBolt className='text-lg' />
                                    <span className='text-sm font-medium hidden sm:inline'>Quick Actions</span>
                                </motion.button>

                                <AnimatePresence>
                                    {showActionsMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className='absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden'
                                        >
                                            <QuickAction
                                                icon={<FaPlus />}
                                                label="Create Post"
                                                onClick={handleCreatePost}
                                                color="purple"
                                                shortcut="Ctrl+P"
                                            />
                                            <QuickAction
                                                icon={<FaUserFriends />}
                                                label="Find Friends"
                                                onClick={handleFindFriends}
                                                color="blue"
                                                shortcut="Ctrl+F"
                                            />
                                            <QuickAction
                                                icon={<FaImage />}
                                                label="Share Photo"
                                                onClick={handleSharePhoto}
                                                color="green"
                                                shortcut="Ctrl+I"
                                            />
                                            <QuickAction
                                                icon={<FaQuestion />}
                                                label="Help & Info"
                                                onClick={handleHelp}
                                                color="gray"
                                                shortcut="?"
                                            />
                                            
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Profile Menu */}
                            <div className='relative'>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${showProfileMenu
                                            ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                        }`}
                                >
                                    <img
                                        src={authUser?.profilePic || assets.avatar_icon}
                                        alt={authUser?.fullName}
                                        className='w-5 h-5 rounded-full object-cover border border-purple-500'
                                    />
                                    <span className='text-sm font-medium hidden sm:inline'>
                                        {authUser?.fullName?.split(' ')[0]}
                                    </span>
                                </motion.button>

                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className='absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden'
                                        >
                                            <button
                                                onClick={() => {
                                                    navigate('/profile');
                                                    setShowProfileMenu(false);
                                                }}
                                                className='w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition flex items-center gap-2'
                                            >
                                                <FaUser className='text-purple-400' />
                                                Profile
                                            </button>
                                            
                                            <hr className='border-gray-700' />
                                            <button
                                                onClick={handleLogout}
                                                className='w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition flex items-center gap-2'
                                            >
                                                <FaSignOutAlt />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Spacer */}
            <div className='h-16' />
        </>
    );
};

// Navigation Button Component
const NavButton = ({ to, active, icon, label }) => {
    const navigate = useNavigate();
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(to)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${active
                    ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
        >
            <span className='text-lg'>{icon}</span>
            <span className='text-sm font-medium hidden sm:inline'>{label}</span>
        </motion.button>
    );
};

// Quick Action Component
const QuickAction = ({ icon, label, onClick, color, shortcut }) => {
    const getColorClass = () => {
        switch (color) {
            case 'purple': return 'text-purple-400';
            case 'blue': return 'text-blue-400';
            case 'green': return 'text-green-400';
            case 'yellow': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <button
            onClick={onClick}
            className='w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition flex items-center justify-between group'
        >
            <div className='flex items-center gap-3'>
                <span className={`text-lg ${getColorClass()}`}>{icon}</span>
                <span>{label}</span>
            </div>
            {shortcut && (
                <span className='text-xs text-gray-600 group-hover:text-gray-400'>{shortcut}</span>
            )}
        </button>
    );
};

export default Navbar;