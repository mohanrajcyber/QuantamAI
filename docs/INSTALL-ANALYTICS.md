# Install Real-Time Analytics System

## Quick Setup

### 1. Install Dependencies

```bash
cd backend
npm install geoip-lite ua-parser-js nodemailer archiver
```

### 2. Restart Backend Server

```bash
# Stop current server (Ctrl+C)
npm start
```

### 3. Test Analytics API

Open browser and visit:
```
http://localhost:3001/api/analytics/stats
```

You should see real-time statistics!

### 4. Access Master Control Dashboard

1. Open Quantum AI: `http://localhost:5173`
2. Type in chat: `/source code 17120105MOHANRAJ`
3. Dashboard loads with REAL data!

---

## What You Get

### Real Data Tracked:
✅ **Actual IP addresses** (anonymized with fake names)
✅ **Real device information** (from User-Agent)
✅ **Real location** (from IP geolocation)
✅ **Real browser** (Chrome, Firefox, Edge, etc.)
✅ **Real operating system** (Windows, Mac, Linux, Android, iOS)
✅ **Real timestamps** (last active time)
✅ **Real session tracking** (online/idle/offline status)

### Fake Data for Privacy:
🔒 **Names** - Random fake names from pool
🔒 **Emails** - Generated from fake names
🔒 **Phone numbers** - Random generated numbers

---

## API Endpoints

### Get System Stats
```bash
GET http://localhost:3001/api/analytics/stats
```

Response:
```json
{
  "activeUsers": 5,
  "totalDevices": 3,
  "processingPower": 42.3,
  "memoryUsage": 58.7,
  "dataLogs": 0.15,
  "activeSessions": 5
}
```

### Get All Users
```bash
GET http://localhost:3001/api/analytics/users
```

Response:
```json
{
  "users": [
    {
      "user_id": "user_1234567890_abc123",
      "name": "Ravi Kumar",
      "email": "ravi.kumar@email.com",
      "phone": "+91 9876543210",
      "device_type": "laptop",
      "device_os": "Windows 10",
      "browser": "Chrome 120.0",
      "ip_address": "192.168.1.100",
      "location": "Mumbai, IN",
      "country": "IN",
      "latitude": 19.0760,
      "longitude": 72.8777,
      "status": "online",
      "last_active": "2026-03-08T12:30:45.123Z"
    }
  ],
  "count": 1
}
```

### Get Map Data
```bash
GET http://localhost:3001/api/analytics/map
```

### Track Session Manually
```bash
POST http://localhost:3001/api/analytics/track
```

---

## How It Works

### 1. Automatic Tracking
Every request to the backend is automatically tracked:
- IP address captured
- User-Agent parsed for device info
- GeoIP lookup for location
- Session created/updated

### 2. Session Management
- **Online**: Active in last 5 minutes
- **Idle**: Active 5-15 minutes ago
- **Offline**: Inactive for 15+ minutes
- **Cleanup**: Sessions older than 1 hour are removed

### 3. Privacy Protection
- Real IP → Fake Name mapping
- Names randomly assigned from pool
- Emails generated from fake names
- Phone numbers randomly generated
- Real technical data preserved

---

## Testing

### Test with Multiple Devices

1. **Open on your phone**
   - Visit: `http://your-ip:5173`
   - Will show as "Mobile" device

2. **Open on laptop**
   - Visit: `http://localhost:5173`
   - Will show as "Laptop" device

3. **Open in different browsers**
   - Chrome, Firefox, Edge
   - Each tracked separately

4. **Check Master Dashboard**
   - Type: `/source code 17120105MOHANRAJ`
   - See all devices listed!

---

## Advanced Features

### Device Detection
Automatically detects:
- 📱 iPhone, Android phones
- 💻 Windows laptops, MacBooks
- 🖥️ Desktop computers
- 📱 iPads, Android tablets

### Location Detection
Uses GeoIP to find:
- City
- Country
- Latitude/Longitude
- Timezone

### Browser Detection
Identifies:
- Chrome, Firefox, Safari, Edge
- Version numbers
- Mobile vs Desktop

---

## Production Deployment

### Use Redis for Sessions
Replace in-memory Map with Redis:

```javascript
import Redis from 'redis';
const redis = Redis.createClient();

// Store session
await redis.set(`session:${ip}`, JSON.stringify(session));

// Get session
const session = JSON.parse(await redis.get(`session:${ip}`));
```

### Use Real Database
Store in MySQL/PostgreSQL:

```sql
CREATE TABLE user_sessions (
  session_id VARCHAR(100) PRIMARY KEY,
  ip_address VARCHAR(45),
  device_info JSON,
  location JSON,
  last_active TIMESTAMP,
  status ENUM('online', 'idle', 'offline')
);
```

### Add Authentication
Protect analytics endpoints:

```javascript
router.use((req, res, next) => {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
});
```

---

## Troubleshooting

### No Data Showing
**Problem**: Dashboard shows 0 users

**Solution**:
1. Check backend is running: `http://localhost:3001`
2. Visit any page to create session
3. Check API: `http://localhost:3001/api/analytics/stats`
4. Refresh dashboard

### Wrong Location
**Problem**: Shows wrong city/country

**Solution**:
- GeoIP is approximate
- Works best with public IPs
- Localhost shows as "Unknown"
- Use VPN to test different locations

### Device Not Detected
**Problem**: Shows "Unknown Device"

**Solution**:
- Check User-Agent header
- Some browsers block User-Agent
- Privacy extensions may interfere
- Try different browser

---

## Security Notes

### Data Privacy
- ✅ No personal data stored
- ✅ Names are fake
- ✅ Emails are fake
- ✅ Phone numbers are fake
- ⚠️ IP addresses are real (for tracking)
- ⚠️ Device info is real (for analytics)

### GDPR Compliance
To be GDPR compliant:
1. Add cookie consent banner
2. Allow users to opt-out
3. Provide data deletion
4. Hash IP addresses
5. Add privacy policy

### Production Security
1. Use HTTPS only
2. Encrypt sensitive data
3. Add rate limiting
4. Implement authentication
5. Log all admin actions

---

## Next Steps

### Phase 1 (Current)
✅ Real-time user tracking
✅ Device detection
✅ Location detection
✅ Session management

### Phase 2 (Next)
- [ ] Real world map integration
- [ ] User activity timeline
- [ ] Export data to CSV
- [ ] Email alerts for events

### Phase 3 (Future)
- [ ] Machine learning insights
- [ ] Predictive analytics
- [ ] Anomaly detection
- [ ] Advanced reporting

---

## Support

**Creator**: Mohanraj  
**Email**: mohanraj.cyber@gmail.com  
**Role**: Cybersecurity Researcher & AI Developer

---

🎉 **You now have a professional real-time analytics system!**

Every user who visits your Quantum AI will be tracked (with privacy protection) and displayed in your Master Control Dashboard.
