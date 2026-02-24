import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FaImage, FaSignOutAlt, FaUser, FaInfoCircle, FaTimes } from 'react-icons/fa'
import { MdPhotoLibrary } from 'react-icons/md'

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext)
  const { logout, onlineUsers, authUser } = useContext(AuthContext)
  const [msgImages, setMsgImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [showMedia, setShowMedia] = useState(true)

  // Get all images from messages
  useEffect(() => {
    setMsgImages(
      messages.filter(msg => msg.image).map(msg => msg.image)
    )
  }, [messages])

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);
  const isCurrentUser = selectedUser._id === authUser?._id;

  return (
    <>
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 20, opacity: 0 }}
        className={`h-full bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-y-scroll border-l border-purple-500/20 relative ${selectedUser ? "max-md:hidden" : ""
          }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setSelectedUser(null)}
          className='md:hidden absolute top-4 right-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition z-10'
        >
          <FaTimes className='text-gray-400' />
        </button>

        {/* Profile Section */}
        <div className='pt-12 pb-6 px-6 bg-gradient-to-b from-purple-900/20 to-transparent'>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className='flex flex-col items-center'
          >
            {/* Avatar with online indicator */}
            <div className='relative mb-4'>
              <img
                src={selectedUser?.profilePic || assets.avatar_icon}
                alt={selectedUser?.fullName}
                className='w-28 h-28 rounded-full object-cover border-4 border-purple-500/30 shadow-2xl'
              />
              {isOnline && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-gray-900'
                />
              )}
            </div>

            {/* User Name with badge */}
            <h2 className='text-2xl font-bold text-white mb-1 flex items-center gap-2'>
              {selectedUser.fullName}
              {isCurrentUser && (
                <span className='text-xs bg-purple-600 px-2 py-1 rounded-full'>You</span>
              )}
            </h2>

            {/* Online/Offline Status */}
            <div className='flex items-center gap-2 mb-4'>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className={`text-sm ${isOnline ? 'text-green-400' : 'text-gray-400'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Bio Card */}
            {selectedUser.bio && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='w-full bg-gray-800/50 rounded-xl p-4 border border-gray-700 mb-2'
              >
                <div className='flex items-center gap-2 mb-2 text-purple-400'>
                  <FaInfoCircle size={14} />
                  <span className='text-xs font-medium'>BIO</span>
                </div>
                <p className='text-sm text-gray-300 leading-relaxed'>
                  {selectedUser.bio}
                </p>
              </motion.div>
            )}

            {/* User Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className='w-full grid grid-cols-2 gap-3 mt-2'
            >
              <div className='bg-gray-800/30 rounded-lg p-3 text-center'>
                <div className='text-xl font-bold text-purple-400'>
                  {messages.length}
                </div>
                <div className='text-xs text-gray-500'>Messages</div>
              </div>
              <div className='bg-gray-800/30 rounded-lg p-3 text-center'>
                <div className='text-xl font-bold text-pink-400'>
                  {msgImages.length}
                </div>
                <div className='text-xs text-gray-500'>Media</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Media Section - With proper spacing for logout button */}
        <div className='px-6 pb-24'> {/* Added pb-24 to create space for logout button */}
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <MdPhotoLibrary className='text-purple-400 text-xl' />
              <h3 className='font-semibold text-white'>Shared Media</h3>
            </div>
            {msgImages.length > 0 && (
              <button
                onClick={() => setShowMedia(!showMedia)}
                className='text-xs text-gray-400 hover:text-purple-400 transition'
              >
                {showMedia ? 'Hide' : `Show ${msgImages.length}`}
              </button>
            )}
          </div>

          <AnimatePresence mode='wait'>
            {showMedia && (
              <motion.div
                key='media-grid'
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='overflow-hidden'
              >
                {msgImages.length > 0 ? (
                  <div className='grid grid-cols-2 gap-3'>
                    {msgImages.map((url, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedImage(url)}
                        className='relative group cursor-pointer rounded-xl overflow-hidden aspect-square bg-gray-800'
                      >
                        <img
                          src={url}
                          alt={`Shared media ${index + 1}`}
                          className='w-full h-full object-cover'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-center p-2'>
                          <span className='text-white text-xs'>Click to view</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='text-center py-8 bg-gray-800/30 rounded-xl'
                  >
                    <FaImage className='text-4xl text-gray-600 mx-auto mb-2' />
                    <p className='text-sm text-gray-500'>No media shared yet</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout Button - Fixed at bottom with proper spacing */}
        <div className='sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent'>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className='w-full py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500 hover:to-red-600 text-red-400 hover:text-white rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 border border-red-500/30 hover:border-red-500'
          >
            <FaSignOutAlt />
            Logout
          </motion.button>
        </div>
      </motion.div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className='relative max-w-4xl max-h-[90vh]'
            >
              <img
                src={selectedImage}
                alt='Enlarged media'
                className='w-full h-full object-contain rounded-lg'
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedImage(null)}
                className='absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition backdrop-blur-sm'
              >
                <FaTimes />
              </motion.button>
              <a
                href={selectedImage}
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
  )
}

export default RightSidebar