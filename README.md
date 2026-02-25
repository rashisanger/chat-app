💬 QuickChat - Real-time Student Communication Platform
<p align="center"> <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3NmZDFjMW5uNnV1NmE0dzl4eTBqZnI5bTNkNnc2MmFvczh3M3l2cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qgQUggAC3Pfv687qPC/giphy.gif" width="600"/> </p><p align="center"> <img src="https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge" /> <img src="https://img.shields.io/badge/Socket.io-Realtime-010101?style=for-the-badge&logo=socket.io" /> <img src="https://img.shields.io/badge/JWT-Authentication-red?style=for-the-badge&logo=json-web-tokens" /> <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwind-css" /> </p>
📋 Overview
QuickChat is a full-stack real-time communication platform built specifically for students. It combines instant messaging with social features like posts, likes, and comments, creating a unified student community experience.

🎯 Live Demo: [Your Vercel URL]
🔗 Frontend Repository: [Your GitHub Repo URL]
🖥️ Backend API: [Your Render URL]/api/status

✨ Key Features
💬 Real-time Chat
One-on-one instant messaging with Socket.io

Typing indicators while composing messages

✓✓ Read receipts (seen/unseen status)

Online/offline user status

Image sharing in chats

📝 Social Posts
Create text posts with optional images

Like/unlike posts with real-time updates

Comment on posts with emoji support

Privacy settings (public/private)

Infinite scroll pagination

🔐 Authentication
Secure JWT-based authentication

Password hashing with bcrypt

Persistent login with token storage

Protected routes & middleware

👤 User Profile
Customizable profile with bio

Profile picture upload via Cloudinary

Edit profile information

View personal post statistics

🎨 UI/UX
Modern dark theme for reduced eye strain

Fully responsive (mobile, tablet, desktop)

Smooth animations with Framer Motion

Toast notifications for feedback

Loading states for async operations

🛠️ Technology Stack
Frontend
Technology	Purpose
React 19	UI library
TailwindCSS	Styling
Socket.io-client	Real-time communication
Framer Motion	Animations
Context API	State management
React Router	Navigation
Axios	HTTP requests
React Hot Toast	Notifications
Emoji Picker React	Emoji selection
Backend
Technology	Purpose
Node.js	Runtime environment
Express.js	Web framework
MongoDB	Database
Mongoose	ODM
Socket.io	Real-time engine
JWT	Authentication
Bcrypt	Password hashing
Cloudinary	Image storage
Multer	File upload handling
DevOps & Deployment
Frontend Hosting: Vercel

Backend Hosting: Render

Database: MongoDB Atlas

Version Control: Git & GitHub


Step 1: Clone Repository
bash
git clone https://github.com/rashisanger/chat-app.git
cd chat-app
Step 2: Backend Setup
bash
cd server
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
# PORT=5000

npm run server
Step 3: Frontend Setup
bash
cd client
npm install

# Create .env file
echo "VITE_BACKEND_URL=http://localhost:5000" > .env

npm run dev
Step 4: Access Application
Frontend: http://localhost:5173

Backend API: http://localhost:5000/api/status

🌐 Deployment
Deploy Backend to Render
Push code to GitHub

Create new Web Service on Render

Connect GitHub repository

Set root directory: server

Build command: npm install

Start command: node server.js

Add environment variables

Deploy

Deploy Frontend to Vercel
Push code to GitHub

Import project on Vercel

Set root directory: client

Add environment variable: VITE_BACKEND_URL

Deploy

📸 Screenshots
Chat Interface	Posts Feed
https://via.placeholder.com/400x300?text=Chat+Screenshot	https://via.placeholder.com/400x300?text=Posts+Screenshot
Landing Page	Profile Page
https://via.placeholder.com/400x300?text=Landing+Page	https://via.placeholder.com/400x300?text=Profile+Page
🎯 Key Learnings
Real-time communication with Socket.io

State management using Context API

JWT authentication flow

Image upload with Cloudinary & Base64

RESTful API design principles

Responsive UI with TailwindCSS

Infinite scroll pagination

Git workflow & deployment

🚧 Future Enhancements
Group chats for study circles

Voice & video calling

End-to-end encryption

Push notifications

File sharing (PDF, documents)

Student verification with .edu email

Study group creation

Assignment reminders

Dark/light theme toggle

🤝 Contributing
Contributions, issues, and feature requests are welcome!

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

📧 Contact
Rashi Sanger

LinkedIn: rashi-sanger

GitHub: @rashisanger

Email: rashi.sanger09@gmail.com

LeetCode: @rashisanger1

🙏 Acknowledgments
MongoDB Atlas for database hosting

Cloudinary for image storage

Vercel & Render for deployment

All open-source libraries used

<p align="center"> Made with ❤️ by Rashi Sanger </p>
