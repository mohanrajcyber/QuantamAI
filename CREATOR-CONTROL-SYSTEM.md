# Quantum AI - Creator Control System

## Overview
Secure administrative control system for Quantum AI creator: **Mohanraj** (Cybersecurity Researcher & AI Developer)

## Security Architecture

### Authentication
- Token-based authentication using `CREATOR_AUTH_TOKEN`
- All admin endpoints require valid creator token in header: `x-creator-token`
- Tokens stored securely in environment variables (never in code)

### Creator Information
- **Name**: Mohanraj
- **Email**: mohanraj.cyber@gmail.com (stored in `CREATOR_EMAIL`)
- **Phone**: +916383418971 (stored in `CREATOR_PHONE`)
- **Role**: Cybersecurity Researcher, AI Developer
- **Position**: Creator and Architect of Quantum AI

## Setup Instructions

### 1. Install Required Dependencies

```bash
cd backend
npm install nodemailer archiver
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Creator Authentication
CREATOR_AUTH_TOKEN=your-secure-random-token-here
CREATOR_EMAIL=mohanraj.cyber@gmail.com
CREATOR_PHONE=+916383418971

# Email Configuration (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

**Generate Secure Token:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Gmail App Password Setup

1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate App-Specific Password
4. Use that password in `EMAIL_PASSWORD`

## Available Commands

### `/quantum status`
Get current system status and metrics

**Response:**
```json
{
  "system": "Quantum AI",
  "creator": "Mohanraj",
  "status": "operational",
  "uptime": 3600,
  "memory": {...},
  "version": "1.0.0"
}
```

### `/quantum shutdown`
Initiate secure system shutdown

**Flow:**
1. Creates full system backup
2. Generates 6-digit verification code
3. Sends backup + code to creator email
4. Requires verification to complete

**Response:**
```json
{
  "message": "Shutdown initiated. Verification code sent to creator email.",
  "shutdownId": "uuid",
  "expiresIn": "5 minutes"
}
```

**Verification:**
```bash
POST /api/admin/quantum/shutdown/verify
{
  "shutdownId": "uuid",
  "verificationCode": "123456"
}
```

### `/quantum lockdown`
Activate lockdown mode - blocks all non-admin access

**Response:**
```json
{
  "message": "Lockdown mode activated",
  "status": "locked"
}
```

### `/quantum unlock`
Deactivate lockdown mode - restore normal operations

**Response:**
```json
{
  "message": "Lockdown mode deactivated",
  "status": "unlocked"
}
```

### `/quantum memory purge`
Clear cache and force garbage collection

**Response:**
```json
{
  "message": "Memory purge completed",
  "memoryUsage": {...}
}
```

### `/quantum restart`
Restart the system (requires process manager like PM2)

**Response:**
```json
{
  "message": "Restart initiated. System will restart in 5 seconds."
}
```

## API Usage Examples

### Using cURL

```bash
# Set your token
TOKEN="your-creator-token"

# Get status
curl -X POST http://localhost:3001/api/admin/quantum/status \
  -H "x-creator-token: $TOKEN" \
  -H "Content-Type: application/json"

# Initiate shutdown
curl -X POST http://localhost:3001/api/admin/quantum/shutdown \
  -H "x-creator-token: $TOKEN" \
  -H "Content-Type: application/json"

# Verify shutdown
curl -X POST http://localhost:3001/api/admin/quantum/shutdown/verify \
  -H "x-creator-token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"shutdownId":"uuid","verificationCode":"123456"}'

# Lockdown
curl -X POST http://localhost:3001/api/admin/quantum/lockdown \
  -H "x-creator-token: $TOKEN" \
  -H "Content-Type: application/json"
```

### Using Frontend Panel

1. Navigate to Creator Control Panel component
2. Enter your `CREATOR_AUTH_TOKEN`
3. Click command buttons to execute

## Security Features

### 1. Token Authentication
- All requests require valid creator token
- Tokens never exposed in client code
- Failed auth attempts return 403 Forbidden

### 2. Email Verification
- Shutdown requires 2-factor verification
- Verification codes expire in 5 minutes
- Codes are single-use only

### 3. System Backup
- Automatic backup before shutdown
- Excludes node_modules and large files
- Sent securely to creator email

### 4. Lockdown Mode
- Blocks all non-admin endpoints
- Only creator can access system
- Automatic email notification

### 5. Audit Logging
- All commands logged to console
- Email notifications for critical actions
- Timestamp and action tracking

## Backup System

### What Gets Backed Up
- All source code files
- Configuration files
- Database files (if any)

### What's Excluded
- node_modules/
- .git/
- dist/ and build/
- Log files
- Previous backups

### Backup Location
```
backend/backups/quantum-ai-backup-YYYY-MM-DD-HH-MM-SS.zip
```

## Email Notifications

Creator receives emails for:
- Shutdown initiated
- Shutdown confirmed
- Lockdown activated
- Lockdown deactivated
- System restart

## Production Deployment

### Using PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start backend/server.js --name quantum-ai

# Restart command will work with PM2
# /quantum restart will trigger PM2 auto-restart
```

### Environment Security

1. Never commit `.env` file
2. Use secure token generation
3. Rotate tokens periodically
4. Use app-specific passwords for email
5. Enable 2FA on all accounts

## Troubleshooting

### Email Not Sending
- Check `EMAIL_USER` and `EMAIL_PASSWORD`
- Verify Gmail App Password is correct
- Check firewall/network settings

### Authentication Failed
- Verify `CREATOR_AUTH_TOKEN` matches in `.env`
- Check token is being sent in header
- Ensure no extra spaces in token

### Backup Failed
- Check disk space
- Verify write permissions on `backups/` folder
- Check file paths are correct

## Future Enhancements

- [ ] Multi-factor authentication (SMS + Email)
- [ ] Audit log database
- [ ] Remote backup to cloud storage
- [ ] Scheduled automatic backups
- [ ] System health monitoring dashboard
- [ ] Alert system for anomalies

## Support

For issues or questions:
- Creator: Mohanraj
- Email: mohanraj.cyber@gmail.com
- Role: Cybersecurity Researcher & AI Developer

---

**⚠️ Security Notice**: This system is designed for creator use only. Unauthorized access attempts are logged and may be reported.
