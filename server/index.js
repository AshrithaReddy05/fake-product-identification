import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import CORS middleware
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 5000;

import dotenv from 'dotenv';
dotenv.config();

const DB_URL = process.env.MONGODB_URL;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(DB_URL)
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
// Allow requests from specific origin
const corsOptions = {
  origin: ['http://localhost:3000'], // Change this to your frontend URL
  credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOptions));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Extract token from cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1d' });

    // Send JWT as a cookie
    res.cookie('token', token, { httpOnly: true });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

    // Send JWT as a cookie
    res.cookie('token', token, { httpOnly: true });

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout endpoint
app.get('/api/logout', verifyToken, (req, res) => {
  res.clearCookie('token'); // Clear JWT cookie
  res.json({ message: 'Logout successful' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
