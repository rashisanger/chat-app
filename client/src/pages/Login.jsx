import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUser, FaEnvelope, FaLock, FaArrowLeft, FaGithub, FaGoogle } from 'react-icons/fa'
import { BsLightningChargeFill } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'

const Login = () => {
  const [currState, setCurrState] = useState("Sign Up")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (currState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }

    setLoading(true)
    const success = await login(
      currState === "Sign Up" ? 'signup' : 'login',
      { fullName, email, password, bio }
    )
    setLoading(false)

    if (success) {
      navigate('/app')
    }
  }

  const toggleState = () => {
    setCurrState(currState === "Sign Up" ? "Login" : "Sign Up")
    setIsDataSubmitted(false)
    setBio('')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 flex items-center justify-center p-4 overflow-hidden relative'>

      {/* Animated Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className='absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl'
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className='absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl'
        />
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/')}
        className='absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-full text-gray-300 hover:text-white hover:bg-gray-700 transition border border-gray-700 z-10'
      >
        <FaArrowLeft size={14} />
        Back to Home
      </motion.button>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='w-full max-w-6xl relative z-10'
      >
        <div className='grid md:grid-cols-2 gap-6 items-center'>

          {/* Left Side - Branding */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className='hidden md:block'
          >
            <div className='text-center md:text-left p-8'>
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className='inline-block'
              >
                <img src={assets.logo_icon} alt="QuickChat" className='w-22 mx-auto md:mx-0' />
              </motion.div>

              <h1 className='text-5xl font-bold text-white mt-6 mb-4'>
                Quick<span className='text-purple-400'>Chat</span>
              </h1>

              <p className='text-gray-400 text-lg mb-8'>
                Connect with friends, share moments, and chat in real-time.
              </p>

              {/* Feature List */}
              <div className='space-y-4'>
                {[
                  { icon: '💬', text: 'Real-time messaging' },
                  { icon: '📸', text: 'Share photos & media' },
                  { icon: '😊', text: 'Express with emojis' },
                  { icon: '🔒', text: 'Private & secure' },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className='flex items-center gap-3 text-gray-300'
                  >
                    <span className='text-2xl'>{feature.icon}</span>
                    <span>{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Live Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className='mt-8 flex items-center gap-4 text-sm'
              >
                <div className='flex items-center gap-1'>
                  <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                  <span className='text-gray-400'>2.3k online</span>
                </div>
                <div className='flex items-center gap-1'>
                  <BsLightningChargeFill className='text-yellow-400' />
                  <span className='text-gray-400'>Fast & reliable</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className='bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-800 shadow-2xl'>

              {/* Header */}
              <div className='text-center mb-8'>
                <h2 className='text-3xl font-bold text-white mb-2'>
                  {currState === "Sign Up" ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className='text-gray-400'>
                  {currState === "Sign Up"
                    ? 'Sign up to start chatting with friends'
                    : 'Login to continue your conversations'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={onSubmitHandler} className='space-y-4'>

                {/* Progress Bar for Sign Up */}
                {currState === "Sign Up" && (
                  <div className='mb-6'>
                    <div className='flex justify-between text-sm text-gray-400 mb-2'>
                      <span>Step {isDataSubmitted ? '2/2' : '1/2'}</span>
                      <span>{isDataSubmitted ? 'Bio' : 'Basic Info'}</span>
                    </div>
                    <div className='w-full bg-gray-800 rounded-full h-2'>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isDataSubmitted ? '100%' : '50%' }}
                        className='bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full'
                      />
                    </div>
                  </div>
                )}

                <AnimatePresence mode='wait'>
                  {/* Full Name - Step 1 Sign Up */}
                  {currState === "Sign Up" && !isDataSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className='space-y-4'
                    >
                      <div className='relative'>
                        <FaUser className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500' />
                        <input
                          type="text"
                          placeholder='Full Name'
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className='w-full bg-gray-800/50 border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition'
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Email & Password - Common for both */}
                  {!isDataSubmitted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='space-y-4'
                    >
                      <div className='relative'>
                        <MdEmail className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500' />
                        <input
                          type="email"
                          placeholder='Email Address'
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className='w-full bg-gray-800/50 border border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition'
                          required
                        />
                      </div>

                      <div className='relative'>
                        <FaLock className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500' />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder='Password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className='w-full bg-gray-800/50 border border-gray-700 rounded-xl py-4 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition'
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300'
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Bio - Step 2 Sign Up */}
                  {currState === "Sign Up" && isDataSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        placeholder='Tell us a little about yourself...'
                        className='w-full bg-gray-800/50 border border-gray-700 rounded-xl py-4 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition resize-none'
                        required
                      />
                      <p className='text-xs text-gray-500 mt-2 text-right'>
                        {bio.length}/200 characters
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type='submit'
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6'
                >
                  {loading ? (
                    <div className='flex items-center justify-center gap-2'>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      Processing...
                    </div>
                  ) : (
                    currState === "Sign Up"
                      ? (isDataSubmitted ? 'Create Account' : 'Next →')
                      : 'Login Now'
                  )}
                </motion.button>

              {/* Terms */}
                <div className='flex items-center gap-2 text-sm text-gray-500 mt-4'>
                  <input type="checkbox" className='accent-purple-500' />
                  <p>I agree to the terms of use and privacy policy</p>
                </div>

                {/* Toggle between Login and Sign Up */}
                <div className='text-center text-gray-400 mt-4'>
                  {currState === "Sign Up" ? (
                    <p>Already have an account?
                      <button
                        type="button"
                        onClick={toggleState}
                        className='font-medium text-purple-400 hover:text-purple-300 ml-1'
                      >
                        Login Here
                      </button>
                    </p>
                  ) : (
                    <p>New to QuickChat?
                      <button
                        type="button"
                        onClick={toggleState}
                        className='font-medium text-purple-400 hover:text-purple-300 ml-1'
                      >
                        Create Account
                      </button>
                    </p>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login