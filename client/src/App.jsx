import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import ProfilePage from './pages/ProfilePage'
import PostsPage from './pages/PostsPage'
import LandingPage from './pages/LandingPage'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext' 
import { ChatProvider } from '../context/ChatContext'
import { PostProvider } from '../context/PostContext' 

const App = () => {
  const { authUser } = useContext(AuthContext)

  return (
    <div className='min-h-screen bg-gray-950'>
      <Toaster />

      {/* Show navbar only when logged in */}
      {authUser && <Navbar />}

      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to={"/app"} />} />

        <Route path='/app' element={
          authUser ? (
            <ChatProvider>
              <Homepage />
            </ChatProvider>
          ) : (
            <Navigate to={"/login"} />
          )
        } />

        <Route path='/posts' element={
          authUser ? (
            <PostProvider>
              <PostsPage />
            </PostProvider>
          ) : (
            <Navigate to={"/login"} />
          )
        } />

        <Route path='/profile' element={
          authUser ? (
            <ProfilePage />
          ) : (
            <Navigate to={"/login"} />
          )
        } />
      </Routes>
    </div>
  )
}

export default App