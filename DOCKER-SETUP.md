# Quantum AI - Docker Deployment Guide

## Prerequisites
- Docker Desktop installed on Windows
- Docker Compose (comes with Docker Desktop)

## Quick Start (3 Commands!)

### 1. Build the Docker image
```bash
docker-compose build
```

### 2. Start Quantum AI
```bash
docker-compose up -d
```

### 3. Access your AI
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Features

### ✅ Auto-Cleanup (30 minutes)
The system automatically:
- Monitors activity every 30 minutes
- Stops container if no requests
- Cleans up unused resources
- Saves storage space

### ✅ Always Running
- Runs in background (`-d` flag)
- Survives laptop restarts (with Docker Desktop auto-start)
- Isolated from your system

### ✅ Easy Management

**View logs:**
```bash
docker-compose logs -f quantum-ai
```

**Stop Quantum AI:**
```bash
docker-compose down
```

**Restart:**
```bash
docker-compose restart
```

**Check status:**
```bash
docker-compose ps
```

**Manual cleanup:**
```bash
docker system prune -f --volumes
```

## Configuration

### Update API Keys
Edit `backend/.env` file, then restart:
```bash
docker-compose restart
```

### Change Ports
Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Frontend on port 8080
  - "8081:3001"  # Backend on port 8081
```

## Troubleshooting

### Container won't start
```bash
docker-compose logs quantum-ai
```

### Port already in use
```bash
# Stop other services using ports 3000/3001
docker-compose down
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

### Reset everything
```bash
docker-compose down -v
docker system prune -af --volumes
docker-compose up -d --build
```

## Production Deployment

### Deploy to Cloud (FREE options)

**1. Railway.app**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**2. Render.com**
- Push code to GitHub
- Connect Render to your repo
- It will auto-detect `render.yaml`
- Deploy automatically!

**3. Fly.io**
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Deploy
fly launch
fly deploy
```

## Auto-Cleanup Details

The cleanup monitor:
- Checks every 30 minutes
- Counts requests in last 30 minutes
- If zero requests → stops container
- Cleans up: stopped containers, unused images, volumes
- Saves disk space automatically

## Health Monitoring

Built-in health checks:
- Every 30 seconds
- Checks `/api/health` endpoint
- Auto-restarts if unhealthy
- 3 retries before marking as unhealthy

## Creator Information
- **Name:** Mohanraj
- **Role:** Cybersecurity Researcher & AI Developer
- **Email:** mohanraj.cyber@gmail.com
- **GitHub:** mohanrajcyber
- **Project:** Quantum AI - AI for Bharat Hackathon 2026
