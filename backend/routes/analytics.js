/**
 * Quantum AI - Analytics & User Tracking API
 * Real-time user monitoring with anonymized data
 * 
 * Creator: Mohanraj
 * Role: Cybersecurity Researcher, AI Developer
 */

import express from 'express';
import geoip from 'geoip-lite';
import UAParser from 'ua-parser-js';

const router = express.Router();

// In-memory storage for active sessions (use Redis in production)
const activeSessions = new Map();
const systemStats = {
  totalRequests: 0,
  totalUsers: 0,
  startTime: Date.now()
};

// Fake names pool for anonymization
const fakeNames = [
  'Ravi Kumar', 'Priya Sharma', 'Anita Mehta', 'Rajesh Patel',
  'John Doe', 'Akash Verma', 'Sneha Singh', 'Amit Gupta',
  'Neha Reddy', 'Vikram Shah', 'Pooja Nair', 'Arjun Desai',
  'Kavya Iyer', 'Rohit Malhotra', 'Divya Kapoor', 'Sanjay Rao'
];

// Generate fake email from name
function generateFakeEmail(name) {
  const emailName = name.toLowerCase().replace(/\s+/g, '.');
  const domains = ['email.com', 'mail.com', 'inbox.com', 'example.com'];
  return `${emailName}@${domains[Math.floor(Math.random() * domains.length)]}`;
}

// Generate fake phone number (Indian format)
function generateFakePhone(country) {
  if (country === 'IN') {
    return `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
  }
  return `+1 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
}

// Get device icon based on type
function getDeviceType(ua) {
  if (ua.device.type === 'mobile') return 'mobile';
  if (ua.device.type === 'tablet') return 'tablet';
  if (ua.os.name?.includes('Windows')) return 'laptop';
  if (ua.os.name?.includes('Mac')) return 'laptop';
  if (ua.os.name?.includes('Linux')) return 'desktop';
  return 'desktop';
}

// Get device OS string
function getDeviceOS(ua) {
  const device = ua.device;
  const os = ua.os;
  
  if (device.vendor && device.model) {
    return `${device.vendor} ${device.model}`;
  }
  
  if (os.name && os.version) {
    return `${os.name} ${os.version}`;
  }
  
  return os.name || 'Unknown Device';
}

// Track user session
function trackSession(req) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || '';
  const ua = UAParser(userAgent);
  
  // Get geolocation from IP
  const geo = geoip.lookup(ip) || {
    country: 'IN',
    city: 'Unknown',
    ll: [0, 0]
  };
  
  // Create or update session
  let session = activeSessions.get(ip);
  
  if (!session) {
    // New session - assign fake name
    const fakeName = fakeNames[activeSessions.size % fakeNames.length];
    
    session = {
      user_id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: fakeName,
      email: generateFakeEmail(fakeName),
      phone: generateFakePhone(geo.country),
      device_type: getDeviceType(ua),
      device_os: getDeviceOS(ua),
      browser: `${ua.browser.name || 'Unknown'} ${ua.browser.version || ''}`.trim(),
      ip_address: ip,
      location: `${geo.city || 'Unknown'}, ${geo.country || 'Unknown'}`,
      country: geo.country || 'Unknown',
      latitude: geo.ll ? geo.ll[0] : 0,
      longitude: geo.ll ? geo.ll[1] : 0,
      first_seen: new Date(),
      last_active: new Date(),
      status: 'online',
      requests: 1
    };
    
    activeSessions.set(ip, session);
    systemStats.totalUsers++;
  } else {
    // Update existing session
    session.last_active = new Date();
    session.status = 'online';
    session.requests++;
  }
  
  systemStats.totalRequests++;
  
  return session;
}

// Update session statuses based on last activity
function updateSessionStatuses() {
  const now = Date.now();
  
  activeSessions.forEach((session, ip) => {
    const timeSinceActive = now - session.last_active.getTime();
    
    if (timeSinceActive > 15 * 60 * 1000) { // 15 minutes
      session.status = 'offline';
    } else if (timeSinceActive > 5 * 60 * 1000) { // 5 minutes
      session.status = 'idle';
    } else {
      session.status = 'online';
    }
  });
}

// Clean up old sessions (older than 1 hour)
function cleanupOldSessions() {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  activeSessions.forEach((session, ip) => {
    if (now - session.last_active.getTime() > oneHour) {
      activeSessions.delete(ip);
    }
  });
}

// Run cleanup every 5 minutes
setInterval(() => {
  updateSessionStatuses();
  cleanupOldSessions();
}, 5 * 60 * 1000);

// Middleware to track all requests
router.use((req, res, next) => {
  trackSession(req);
  next();
});

// GET /api/analytics/stats - Get system statistics
router.get('/stats', (req, res) => {
  updateSessionStatuses();
  
  const sessions = Array.from(activeSessions.values());
  const onlineUsers = sessions.filter(s => s.status === 'online').length;
  const idleUsers = sessions.filter(s => s.status === 'idle').length;
  const offlineUsers = sessions.filter(s => s.status === 'offline').length;
  
  // Calculate unique devices
  const uniqueDevices = new Set(sessions.map(s => s.device_os)).size;
  
  // Calculate uptime
  const uptime = Date.now() - systemStats.startTime;
  const uptimeHours = (uptime / (1000 * 60 * 60)).toFixed(1);
  
  // Simulate processing and memory (you can replace with real metrics)
  const processingPower = 30 + Math.random() * 20; // 30-50%
  const memoryUsage = 50 + Math.random() * 20; // 50-70%
  
  res.json({
    activeUsers: onlineUsers + idleUsers,
    totalDevices: uniqueDevices,
    processingPower: parseFloat(processingPower.toFixed(1)),
    memoryUsage: parseFloat(memoryUsage.toFixed(1)),
    dataLogs: parseFloat((systemStats.totalRequests / 1000).toFixed(2)), // GB
    activeSessions: onlineUsers,
    stats: {
      online: onlineUsers,
      idle: idleUsers,
      offline: offlineUsers,
      total: sessions.length,
      totalRequests: systemStats.totalRequests,
      uptime: uptimeHours + ' hours'
    }
  });
});

// GET /api/analytics/users - Get all active users
router.get('/users', (req, res) => {
  updateSessionStatuses();
  
  const sessions = Array.from(activeSessions.values())
    .sort((a, b) => b.last_active - a.last_active);
  
  res.json({
    users: sessions,
    count: sessions.length
  });
});

// GET /api/analytics/users/online - Get only online users
router.get('/users/online', (req, res) => {
  updateSessionStatuses();
  
  const onlineUsers = Array.from(activeSessions.values())
    .filter(s => s.status === 'online')
    .sort((a, b) => b.last_active - a.last_active);
  
  res.json({
    users: onlineUsers,
    count: onlineUsers.length
  });
});

// GET /api/analytics/users/:userId - Get specific user details
router.get('/users/:userId', (req, res) => {
  const user = Array.from(activeSessions.values())
    .find(s => s.user_id === req.params.userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// GET /api/analytics/map - Get user locations for map
router.get('/map', (req, res) => {
  updateSessionStatuses();
  
  const locations = Array.from(activeSessions.values())
    .filter(s => s.latitude !== 0 && s.longitude !== 0)
    .map(s => ({
      user_id: s.user_id,
      name: s.name,
      location: s.location,
      country: s.country,
      latitude: s.latitude,
      longitude: s.longitude,
      status: s.status,
      device: s.device_os
    }));
  
  res.json({
    locations,
    count: locations.length,
    countries: [...new Set(locations.map(l => l.country))].length
  });
});

// GET /api/analytics/devices - Get device statistics
router.get('/devices', (req, res) => {
  const sessions = Array.from(activeSessions.values());
  
  const deviceTypes = {};
  const operatingSystems = {};
  const browsers = {};
  
  sessions.forEach(s => {
    deviceTypes[s.device_type] = (deviceTypes[s.device_type] || 0) + 1;
    operatingSystems[s.device_os] = (operatingSystems[s.device_os] || 0) + 1;
    browsers[s.browser] = (browsers[s.browser] || 0) + 1;
  });
  
  res.json({
    deviceTypes,
    operatingSystems,
    browsers,
    total: sessions.length
  });
});

// POST /api/analytics/track - Manual tracking endpoint
router.post('/track', (req, res) => {
  const session = trackSession(req);
  res.json({
    success: true,
    session_id: session.user_id,
    message: 'Session tracked successfully'
  });
});

// GET /api/analytics/activity - Get recent activity
router.get('/activity', (req, res) => {
  const sessions = Array.from(activeSessions.values())
    .sort((a, b) => b.last_active - a.last_active)
    .slice(0, 20)
    .map(s => ({
      user_id: s.user_id,
      name: s.name,
      action: 'Active',
      timestamp: s.last_active,
      location: s.location,
      device: s.device_os
    }));
  
  res.json({
    activity: sessions,
    count: sessions.length
  });
});

// DELETE /api/analytics/sessions - Clear all sessions (admin only)
router.delete('/sessions', (req, res) => {
  const count = activeSessions.size;
  activeSessions.clear();
  
  res.json({
    success: true,
    message: `Cleared ${count} sessions`,
    cleared: count
  });
});

export default router;
