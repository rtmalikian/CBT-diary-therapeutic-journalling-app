const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Mock user database (in a real app, this would be a real database)
const users = [
  { id: 1, email: 'user@example.com', password: '$2a$10$8K1p/a0TBFxnUXa7J13e7.7hF.7hF.7hF.7hF.7hF.7hF.7hF.7hF' } // 'password' hashed
];

// Register route
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user (in a real app, save to database)
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword
    };
    
    users.push(newUser);
    
    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '7d'
    });
    
    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: { id: newUser.id, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '7d'
    });
    
    res.json({ 
      message: 'Login successful', 
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Get user profile
router.get('/profile', verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({ user: { id: user.id, email: user.email } });
});

module.exports = router;