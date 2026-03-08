# Quantum AI - Master Control System

## Overview
Advanced monitoring and administration dashboard for Quantum AI creator.

**Creator**: Mohanraj  
**Role**: Cybersecurity Researcher, AI Developer  
**Position**: Creator and Architect of Quantum AI  
**Access Code**: `17120105MOHANRAJ`

---

## Master Access Command

### Activation
Type in chat:
```
/source code 17120105MOHANRAJ
```

**Case Insensitive**: Works with any capitalization
- `/source code 17120105MOHANRAJ` ✅
- `/SOURCE CODE 17120105MOHANRAJ` ✅
- `/Source Code 17120105mohanraj` ✅

### Access Flow
1. User types master access command in chat
2. System verifies the code
3. Access granted message displayed
4. Dashboard loads after 2 seconds
5. Full interface switches to Master Control Mode

---

## Dashboard Features

### 1. Real-Time System Statistics

**Metrics Displayed:**
- **Active Users**: Current number of online users (auto-updates every 3 seconds)
- **Total Devices**: Connected devices count
- **Processing Power**: System CPU usage percentage
- **Memory Usage**: RAM utilization percentage
- **Data Logs**: Total data storage in GB
- **Active Sessions**: Current active user sessions

**Auto-Refresh**: Stats update automatically every 3 seconds

---

### 2. Active Users Monitoring

**Database-Style Table View:**

| Column | Description | Example |
|--------|-------------|---------|
| Name | User's full name | Ravi Kumar |
| Device | Device type + OS | iPhone 12 Pro |
| Email | User's email address | ravi.kumar@email.com |
| IP Address | User's IP | 103.87.42.91082 |
| Last Active | Last activity timestamp | 12:30:45 PM |
| Status | Online/Idle/Offline | 🟢 ONLINE |

**Device Detection:**
- 📱 Mobile (Android/iPhone)
- 💻 Laptop (Windows/Mac/Linux)
- 🖥️ Desktop (Windows/Mac/Linux)
- 📱 Tablet (iPad/Android Tablet)

**Status Indicators:**
- 🟢 **Online**: Active in last 5 minutes
- 🟡 **Idle**: Active 5-15 minutes ago
- 🔴 **Offline**: Inactive for 15+ minutes

**Interactive Features:**
- Click any row to view detailed user information
- Auto-refresh toggle (ON/OFF)
- Real-time status updates

---

### 3. User Details Panel

When a user is selected, displays:

**Personal Information:**
- Full Name
- Email Address
- Phone Number

**Device Information:**
- Device Type (with icon)
- Operating System
- Device Model

**Location Data:**
- City, Country
- GPS Coordinates (Latitude/Longitude)
- IP Address

**Activity:**
- Last Active Time
- Current Status
- Session Duration

---

### 4. Live World Map 🌍

**Features:**
- Real-time visualization of user locations
- Glowing points for each active user
- Click points to see user details
- Auto-updates when new users connect
- Shows user distribution across countries

**Map Libraries (Integration Ready):**
- Leaflet.js
- Mapbox
- Google Maps API

**Current Display:**
- Active users count
- Countries represented
- Visual globe animation

---

### 5. Advanced Tools Panel

**Available Controls:**

#### 🗑️ Memory Flush
- Clears system cache
- Optimizes memory usage
- Forces garbage collection
- Improves performance

#### 💾 Source Backup
- Creates full system backup
- Includes all source code
- Excludes node_modules
- Saves to secure location

#### 🔧 AI Maintenance
- Runs system diagnostics
- Checks AI model health
- Updates configurations
- Optimizes performance

#### 🔒 Security Lockdown
- Activates lockdown mode
- Blocks all non-admin access
- Restricts user operations
- Emergency security measure

#### ⚡ System Shutdown
- Graceful system shutdown
- Saves all data
- Closes all connections
- Requires confirmation

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  user_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  device_type ENUM('mobile', 'laptop', 'desktop', 'tablet'),
  device_os VARCHAR(50),
  ip_address VARCHAR(45),
  location VARCHAR(100),
  country VARCHAR(50),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('online', 'idle', 'offline') DEFAULT 'offline',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### System Stats Table

```sql
CREATE TABLE system_stats (
  stat_id INT AUTO_INCREMENT PRIMARY KEY,
  active_users INT DEFAULT 0,
  total_devices INT DEFAULT 0,
  processing_power DECIMAL(5, 2),
  memory_usage DECIMAL(5, 2),
  data_logs DECIMAL(10, 2),
  active_sessions INT DEFAULT 0,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Activity Logs Table

```sql
CREATE TABLE activity_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50),
  action VARCHAR(100),
  details TEXT,
  ip_address VARCHAR(45),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

---

## Security Features

### 1. Access Control
- ✅ Master code required for access
- ✅ Code verification before dashboard load
- ✅ No access without correct code
- ✅ Single-use session (resets on logout)

### 2. Data Protection
- ✅ All user data encrypted
- ✅ Secure database connections
- ✅ IP address logging
- ✅ Activity monitoring

### 3. Admin Actions
- ✅ All actions logged
- ✅ Confirmation required for critical operations
- ✅ Audit trail maintained
- ✅ Rollback capability

### 4. Session Management
- ✅ Automatic timeout after inactivity
- ✅ Secure session tokens
- ✅ Single admin session at a time
- ✅ Force logout capability

---

## Visual Design

### Color Scheme
- **Primary**: Red (#DC2626) - Authority and power
- **Background**: Black with red gradient
- **Accents**: Red borders and glows
- **Text**: White with gray secondary
- **Status Colors**:
  - Green: Online/Success
  - Yellow: Idle/Warning
  - Red: Offline/Critical

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  Header: Access Granted - Welcome Master Mohanraj       │
├─────────────────────────────────────────────────────────┤
│  System Stats (6 cards in grid)                         │
├──────────────────────────────────┬──────────────────────┤
│                                  │                      │
│  Active Users Table              │  User Details Panel  │
│  (Database-style view)           │  (Selected user)     │
│                                  │                      │
│                                  ├──────────────────────┤
│                                  │                      │
│                                  │  Advanced Tools      │
│                                  │  (Admin buttons)     │
│                                  │                      │
├──────────────────────────────────┴──────────────────────┤
│  Live World Map - Users System 🌍                       │
│  (Global user distribution)                             │
├─────────────────────────────────────────────────────────┤
│  Footer: Version info & Creator details                 │
└─────────────────────────────────────────────────────────┘
```

---

## Usage Examples

### Example 1: Monitoring Active Users
```
1. Enter master access code
2. Dashboard loads
3. View active users table
4. Click on user "Ravi Kumar"
5. See detailed information:
   - Device: iPhone 12 Pro
   - Location: Chennai, India
   - Status: Online
   - Last Active: Just now
```

### Example 2: System Maintenance
```
1. Access master dashboard
2. Check system stats:
   - Memory Usage: 61.4%
   - Processing: 39.9%
3. Click "Memory Flush"
4. Confirm action
5. Memory optimized
6. Stats update automatically
```

### Example 3: Security Lockdown
```
1. Detect suspicious activity
2. Access master dashboard
3. Click "Security Lockdown"
4. System enters lockdown mode
5. All user access blocked
6. Only admin can operate
7. Use "quantum unlock" to restore
```

---

## API Endpoints (Backend Integration)

### Get System Stats
```javascript
GET /api/admin/stats
Response: {
  activeUsers: 1121,
  totalDevices: 485,
  processingPower: 39.9,
  memoryUsage: 61.4,
  dataLogs: 3.9,
  activeSessions: 129
}
```

### Get Active Users
```javascript
GET /api/admin/users/active
Response: [
  {
    user_id: "1",
    name: "Ravi Kumar",
    email: "ravi.kumar@email.com",
    device_type: "mobile",
    status: "online",
    ...
  }
]
```

### Execute Admin Action
```javascript
POST /api/admin/action
Body: {
  action: "memory_flush",
  creator_token: "17120105MOHANRAJ"
}
Response: {
  success: true,
  message: "Memory flush completed"
}
```

---

## Future Enhancements

### Phase 2 Features
- [ ] Real-time chat with users
- [ ] Remote device control
- [ ] System performance graphs
- [ ] User behavior analytics
- [ ] Automated threat detection
- [ ] AI model performance metrics

### Phase 3 Features
- [ ] Multi-admin support
- [ ] Role-based access control
- [ ] Advanced reporting system
- [ ] Export data to CSV/PDF
- [ ] Mobile app for dashboard
- [ ] Voice commands for admin

### Phase 4 Features
- [ ] Machine learning insights
- [ ] Predictive analytics
- [ ] Automated scaling
- [ ] Cloud integration
- [ ] Blockchain audit logs
- [ ] Quantum encryption

---

## Troubleshooting

### Access Code Not Working
**Problem**: Master access code rejected

**Solutions**:
1. Check spelling: `17120105MOHANRAJ`
2. Ensure format: `/source code 17120105MOHANRAJ`
3. Try different capitalization
4. Clear browser cache
5. Refresh page and try again

### Dashboard Not Loading
**Problem**: Stuck on "Initializing..."

**Solutions**:
1. Wait 5 seconds for full load
2. Check internet connection
3. Verify backend is running
4. Check browser console for errors
5. Try different browser

### Stats Not Updating
**Problem**: Numbers frozen

**Solutions**:
1. Check "Auto Refresh" toggle is ON
2. Refresh page
3. Verify backend connection
4. Check database connectivity

---

## Best Practices

### Security
1. Never share master access code
2. Log out after each session
3. Monitor activity logs regularly
4. Use lockdown for emergencies
5. Keep backup of all data

### Performance
1. Enable auto-refresh only when needed
2. Close dashboard when not in use
3. Run memory flush periodically
4. Monitor system stats regularly
5. Optimize database queries

### Monitoring
1. Check active users daily
2. Review suspicious activity
3. Monitor system resources
4. Track user growth trends
5. Analyze usage patterns

---

## Technical Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- Lucide Icons
- Real-time updates

### Backend (Integration Ready)
- Node.js + Express
- MySQL/PostgreSQL database
- WebSocket for real-time
- JWT authentication

### Maps Integration
- Leaflet.js (recommended)
- Mapbox API
- Google Maps API
- OpenStreetMap

---

## Support

**Creator**: Mohanraj  
**Email**: mohanraj.cyber@gmail.com  
**Role**: Cybersecurity Researcher & AI Developer  
**System**: Quantum AI Platform

---

## Version History

**v1.0.0** - Initial Release
- Master access code system
- Real-time monitoring dashboard
- Active users table
- System stats display
- Admin control panel
- World map placeholder

**v1.1.0** - Planned
- Database integration
- Live world map
- Advanced analytics
- Export functionality

---

**🔒 Classified System - Creator Access Only**

*This dashboard is restricted to the system creator. Unauthorized access attempts are logged and may result in system lockdown.*

---

🇮🇳 **Quantum AI - AI for Bharat**
