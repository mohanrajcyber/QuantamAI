/**
 * Quantum AI - Authentication Routes
 * User registration, login, and OTP verification
 * 
 * Creator: Mohanraj
 * Role: Cybersecurity Researcher, AI Developer
 */

import express from 'express';
import crypto from 'crypto';

const router = express.Router();

// In-memory storage (use database in production)
const users = new Map();
const otpStore = new Map();

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { user_id, name, email, phone, location, auth_method } = req.body;

    // Validation
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Create user object
    const user = {
      user_id,
      name: name || 'User',
      email: email || '',
      phone: phone || '',
      location: location || { latitude: 0, longitude: 0, city: 'Unknown', country: 'Unknown' },
      auth_method: auth_method || 'email',
      created_at: new Date(),
      last_login: new Date(),
      status: 'active'
    };

    // Save user
    users.set(user_id, user);

    console.log(`✅ New user registered: ${name} (${email || phone})`);

    res.json({
      success: true,
      message: 'User registered successfully',
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login - Login existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    let user = null;
    for (const [id, u] of users.entries()) {
      if (u.email === email) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.last_login = new Date();
    users.set(user.user_id, user);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/send-otp - Send OTP to phone
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP (expires in 5 minutes)
    otpStore.set(phone, {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    });

    // In production, send SMS via Twilio/AWS SNS
    console.log(`📱 OTP for ${phone}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      // For testing only - remove in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// POST /api/auth/verify-otp - Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    const storedOtp = otpStore.get(phone);

    if (!storedOtp) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    if (Date.now() > storedOtp.expires) {
      otpStore.delete(phone);
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (storedOtp.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP verified - remove from store
    otpStore.delete(phone);

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// GET /api/auth/users - Get all registered users (admin only)
router.get('/users', (req, res) => {
  const userList = Array.from(users.values()).map(user => ({
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: user.location,
    auth_method: user.auth_method,
    created_at: user.created_at,
    last_login: user.last_login,
    status: user.status
  }));

  res.json({
    users: userList,
    count: userList.length
  });
});

// GET /api/auth/user/:userId - Get specific user
router.get('/user/:userId', (req, res) => {
  const user = users.get(req.params.userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      auth_method: user.auth_method,
      created_at: user.created_at,
      last_login: user.last_login
    }
  });
});

// DELETE /api/auth/user/:userId - Delete user (admin only)
router.delete('/user/:userId', (req, res) => {
  const deleted = users.delete(req.params.userId);

  if (!deleted) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

export default router;
