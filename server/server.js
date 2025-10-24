const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const http = require('http'); // HTTP module
const { Server } = require('socket.io'); // Socket.io Server
const jwt = require('jsonwebtoken'); // To verify tokens on socket connection

// Import Models for socket logic
const Message = require('./models/message.model.js');
const Conversation = require('./models/conversation.model.js');

// Import Routes
const authRoute = require('./routes/auth.route.js');
const projectRoute = require('./routes/project.route.js');
const proposalRoute = require('./routes/proposal.route.js');
const walletRoute = require('./routes/wallet.route.js');
const notificationRoute = require('./routes/notification.route.js');
const milestoneRoute = require('./routes/milestone.route.js');
const chatRoute = require('./routes/chat.route.js'); // 1. IMPORT CHAT ROUTE

dotenv.config();
const app = express();
const server = http.createServer(app); // Create HTTP server

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Route mounting
app.use('/api/auth', authRoute);
app.use('/api/projects', projectRoute);
app.use('/api/proposals', proposalRoute);
app.use('/api/wallet', walletRoute);
app.use('/api/notifications', notificationRoute);
app.use('/api/milestones', milestoneRoute);
app.use('/api/chat', chatRoute); // 2. MOUNT CHAT ROUTE

// --- SOCKET.IO LOGIC ---

// Map to store { userId: socketId }
const userSocketMap = {}; // { "userId123": "socketIdABC", ... }

const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Get userId from the socket handshake (sent from client)
  const userId = socket.handshake.query.userId;
  if (userId) {
    console.log(`User ${userId} mapped to socket ${socket.id}`);
    userSocketMap[userId] = socket.id;
  }

  // Emit 'getOnlineUsers' event to all clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  // Listen for 'joinRoom' event (when a user opens a chat window)
  socket.on('joinRoom', (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined room ${conversationId}`);
  });

  // Listen for 'sendMessage'
  socket.on('sendMessage', async (data) => {
    const { conversationId, senderId, recipientId, text } = data;

    try {
      // 1. Create and save the new message to the database
      const newMessage = new Message({
        conversationId,
        sender: senderId,
        text,
      });

      // 2. Update the 'lastMessage' in the conversation
      const conversation = await Conversation.findByIdAndUpdate(
        conversationId,
        {
          lastMessage: {
            text,
            sender: senderId,
          },
        },
        { new: true } // Return the updated document
      );

      // Save both in parallel
      await Promise.all([
        newMessage.save(),
        conversation.save(),
      ]);
      
      // --- START OF FIX ---
      // 3. We MUST populate the sender info before emitting
      // This adds the sender's username, avatar, etc., to the message object
      const populatedMessage = await Message.findById(newMessage._id)
        .populate('sender', 'username profile.fullName profile.avatar'); // Adjust fields as needed
      // --- END OF FIX ---


      // 4. Emit the populated message to the recipient
      const recipientSocketId = getRecipientSocketId(recipientId);

      if (recipientSocketId) {
        // If the recipient is online, send the message to their specific socket
        io.to(recipientSocketId).emit('receiveMessage', populatedMessage); // Send populated message
      }

      // 5. Emit the populated message back to the sender (so their UI updates)
      socket.emit('receiveMessage', populatedMessage); // Send populated message

    } catch (error) {
      console.error('Error handling sendMessage:', error);
      // You could emit an error event back to the sender
      socket.emit('messageError', { message: 'Failed to send message.' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Remove user from the map
    for (const [userId, socketId] of Object.entries(userSocketMap)) {
      if (socketId === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
    // Update online users list for everyone
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});
// --- END OF SOCKET.IO LOGIC ---

// Connect to MongoDB
const connectDB = async () => {
  try {
    const MONGODB_URI =
      process.env.MONGODB_URI ||
      'mongodb+srv://ajitesh:dbuser%40123@cluster0.04bem14.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  connectDB();
  console.log(`Backend server is running on port ${PORT}!`);
});