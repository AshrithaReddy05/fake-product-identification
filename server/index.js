import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors'; // Import CORS middleware
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

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
  username: { type: String, unique: true },
  password: String,
  Role:{type: String ,default:"user"}
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
// Allow requests from specific origin
const corsOptions = {
  origin: ['http://localhost:3000'],  // Change this to your frontend URL
  credentials: true
};
app.use(cookieParser());

app.use(cors(corsOptions));


// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    // Extract token from cookies
    const token = req.cookies.token;
    // console.log("token please --  - - - -   ", token);
    
    if (!token) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
  
    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
  
      req.userId = decoded.userId; 
      // console.log("role ",decoded);// Attach userId to request object
      req.type=decoded.role;
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(403).json({ error: 'Invalid token' });
    }
  };
  
  // Register endpoint
  app.post('/api/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log(username + " " + password);
  
      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
  
      // Generate JWT
      const token = jwt.sign({ userId: newUser._id,role:newUser.Role }, JWT_SECRET, { expiresIn: '1d' }); // Change secret key and expiration as needed
      // localStorage.setItem('token', token);
      
  console.log('Generated token in registration:', token);
  
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
      const { username, password } = req.body;
      console.log("username ",username,"pasword ",password);
  
      // Find the user
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      console.log("in login ",user.Role);
      // Generate JWT
      const token = jwt.sign({ userId: user._id,role:user.Role }, 'your-secret-key', { expiresIn: '1d' }); // Change secret key and expiration as needed
  // Log the token to the console
  // localStorage.setItem('token', token);
  console.log('Generated token in login:', token);
  console.log("token = ",token);
      // Send JWT as a cookie
      res.cookie('token', token, { httpOnly: true });
      console.log("token genereated by man ",token);
  
      res.json({ message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Logout endpoint
  app.get('/api/logout',verifyToken,(req, res) => {
    res.clearCookie('token'); // Clear JWT cookie
    res.json({ message: 'Logout successful' });
  });