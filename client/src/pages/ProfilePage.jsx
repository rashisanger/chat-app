import React, { useContext, useState } from 'react'
import { useNavigate } from "react-router"
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaEdit, FaCamera, FaSave, FaArrowLeft } from 'react-icons/fa';
import { BsFillPersonFill } from 'react-icons/bs';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName || '')
  const [bio, setBio] = useState(authUser?.bio || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsLoading(true);

    if (!selectedImage) {
      await updateProfile({ fullName: name, bio });
      navigate('/app');
      setIsLoading(false);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      setIsLoading(false);
      navigate('/app');
    };
  };

  // If no authUser, show loading
  if (!authUser) {
    return (
      <div className='min-h-screen bg-gray-950 flex items-center justify-center'>
        <div className='text-white'>Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center p-4 pt-24' // Added pt-24 for navbar
    >
      {/* Back Button - Updated to go to previous page */}
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)} // Go back to previous page
        className='absolute top-24 left-6 flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-full text-gray-300 hover:text-white hover:bg-gray-700 transition border border-gray-700 z-10'
      >
        <FaArrowLeft size={14} />
        Back
      </motion.button>

      {/* Main Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className='w-full max-w-4xl bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-purple-500/20'
      >
        {/* Header with Gradient */}
        <div className='bg-gradient-to-r from-purple-600 to-pink-600 p-8 relative'>
          <div className='absolute inset-0 bg-black/20'></div>
          <div className='relative z-10'>
            <h1 className='text-3xl font-bold text-white flex items-center gap-3'>
              <FaEdit />
              Edit Profile
            </h1>
            <p className='text-purple-100 mt-2'>Customize your profile information</p>
          </div>
        </div>

        <div className='p-8'>
          <div className='flex flex-col md:flex-row gap-8'>
            {/* Left Column - Avatar */}
            <div className='md:w-1/3'>
              <div className='sticky top-8'>
                <div className='flex flex-col items-center'>
                  {/* Avatar with Upload Overlay */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className='relative group cursor-pointer mb-4'
                  >
                    <div className='relative'>
                      <img
                        src={imagePreview || authUser?.profilePic || assets.logo_icon}
                        alt="Profile"
                        className='w-48 h-48 rounded-full object-cover border-4 border-purple-500/30 shadow-2xl'
                      />
                      <motion.label
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        htmlFor="avatar-upload"
                        className='absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-purple-600/50 transition border-4 border-gray-900'
                      >
                        <FaCamera className='text-white text-xl' />
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </motion.label>
                    </div>
                  </motion.div>

                  {/* Upload Hint */}
                  <p className='text-sm text-gray-400 text-center'>
                    Click the camera icon to change your profile picture
                  </p>

                  {/* Current Email Display */}
                  <div className='mt-6 w-full bg-gray-800/50 rounded-xl p-4 border border-gray-700'>
                    <div className='flex items-center gap-3 text-gray-400'>
                      <FaEnvelope className='text-purple-400' />
                      <div className='flex-1'>
                        <p className='text-xs text-gray-500'>Email</p>
                        <p className='text-sm text-white truncate'>{authUser?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className='md:w-2/3'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Full Name Input */}
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2'>
                    <FaUser className='text-purple-400' />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className='w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition'
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Bio Input */}
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2'>
                    <BsFillPersonFill className='text-purple-400' />
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className='w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition resize-none'
                    placeholder="Tell others about yourself..."
                  />
                  <p className='text-xs text-gray-500 mt-2'>
                    {bio.length}/200 characters
                  </p>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-3 pt-4'>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                  >
                    {isLoading ? (
                      <>
                        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Save Changes
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/app')}
                    className='px-6 py-3 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition'
                  >
                    Cancel
                  </motion.button>
                </div>

                {/* Profile Stats */}
                <div className='mt-6 pt-6 border-t border-gray-800'>
                  <div className='grid grid-cols-3 gap-4 text-center'>
                    <div>
                      <div className='text-2xl font-bold text-purple-400'>✓</div>
                      <div className='text-xs text-gray-500'>Verified</div>
                    </div>
                    <div>
                      <div className='text-2xl font-bold text-pink-400'>📸</div>
                      <div className='text-xs text-gray-500'>Profile Set</div>
                    </div>
                    <div>
                      <div className='text-2xl font-bold text-green-400'>💬</div>
                      <div className='text-xs text-gray-500'>Active</div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProfilePage