import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaUserEdit, FaSignOutAlt, FaEllipsisV } from 'react-icons/fa';
import { BsLightningChargeFill } from 'react-icons/bs';

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Safely filter users with null checks
  const filteredUsers = React.useMemo(() => {
    if (!users || !Array.isArray(users)) return [];

    if (input && input.trim()) {
      return users.filter((user) =>
        user && user.fullName &&
        user.fullName.toLowerCase().includes(input.toLowerCase().trim())
      );
    }

    return users.filter(user => user && user._id);
  }, [users, input]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getUsers();
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [onlineUsers, getUsers]);

  const handleUserSelect = (user) => {
    if (user && user._id) {
      setSelectedUser(user);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Calculate online count
  const onlineCount = onlineUsers?.length || 0;
  const totalUsers = users?.length || 0;

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`h-full bg-gradient-to-b from-gray-900 to-gray-950 p-5 rounded-r-2xl overflow-y-scroll text-white shadow-2xl border-r border-purple-500/20 flex flex-col ${selectedUser ? 'max-md:hidden' : ''
        }`}
    >
      {/* Header with Logo - Clean Version */}
      <div className="pb-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {/* Logo and Brand - Single instance */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2"
          >
            <img src={assets.logo} alt="QuickChat" className="h-8 w-auto" />
            
          </motion.div>

          {/* Menu Button */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <FaEllipsisV className="text-gray-400" />
            </motion.button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 z-50 w-48 mt-2 py-2 bg-gray-800 rounded-xl shadow-2xl border border-gray-700"
                >
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition flex items-center gap-3"
                  >
                    <FaUserEdit className="text-purple-400" />
                    Edit Profile
                  </button>
                  <hr className="my-1 border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition flex items-center gap-3"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Online Status Badge - Moved here, single instance */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 bg-gray-800/50 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-gray-300">
              <span className="text-green-400 font-semibold">{onlineCount}</span>
              <span className="text-gray-500">/{totalUsers}</span>
              <span className="text-gray-400 ml-1">online</span>
            </span>
          </div>
          <span className="text-xs text-gray-600">|</span>
          <div className="flex items-center gap-1">
            <BsLightningChargeFill className="text-yellow-400 text-xs" />
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-3">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            className="w-full bg-gray-800/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition border border-gray-700"
            placeholder="Search users..."
          />
        </div>
      </div>

      {/* User List */}
      <div className="mt-4 space-y-1 flex-1 overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <AnimatePresence>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => {
              if (!user || !user._id) return null;

              const hasUnseenMessages = unseenMessages && unseenMessages[user._id] > 0;
              const isSelected = selectedUser && selectedUser._id === user._id;
              const isOnline = onlineUsers && onlineUsers.includes(user._id);

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${isSelected
                      ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-l-4 border-purple-500'
                      : 'hover:bg-gray-800/50'
                    }`}
                >
                  {/* Avatar with online indicator */}
                  <div className="relative">
                    <img
                      src={user?.profilePic || assets.avatar_icon}
                      alt={user?.fullName || 'User'}
                      className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-purple-500 transition"
                      onError={(e) => {
                        e.target.src = assets.avatar_icon;
                      }}
                    />
                    {isOnline && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-900"
                      />
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm truncate text-white">
                        {user?.fullName || 'Unknown User'}
                      </p>
                      {hasUnseenMessages && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center"
                        >
                          {unseenMessages[user._id]}
                        </motion.span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="selectedIndicator"
                      className="absolute right-2 w-1.5 h-8 bg-purple-500 rounded-full"
                    />
                  )}
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="text-6xl mb-3">😢</div>
              <p className="text-gray-500 text-sm">
                {input ? 'No users found' : 'No users available'}
              </p>
              {input && (
                <button
                  onClick={() => setInput('')}
                  className="mt-3 text-xs text-purple-400 hover:text-purple-300 transition"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Simple Footer */}
      <div className="pt-3 mt-2 border-t border-gray-800">
        <div className="flex items-center justify-center text-xs text-gray-500">
          <span>© 2026 QuickChat</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;