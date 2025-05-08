const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Middleware to handle OPTIONS requests globally
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    res.status(200).send();
  } else {
    next();
  }
});

// Middleware to log requests and responses globally
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log('Request Body:', req.body);

  const originalSend = res.send;
  res.send = function (body) {
    console.log('Response Body:', body);
    originalSend.call(this, body);
  };

  next();
});

// Middleware to check for Bearer token and decode user ID
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, "lalala_hssnan");
      req.user = { id: decoded.id };
    } catch (err) {
      console.error('Invalid token:', err);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }
  next();
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://rama:7MR9oLpef122UCdy@cluster0.fquqway.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const taskRoutes = require('./src/routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

const notificationRoutes = require('./src/routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

// Sample route
app.get('/', (req, res) => {
  res.send('Task Management System API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;