/**
 * Quantum AI - Creator Admin Control System
 * Secure administrative commands for system creator only
 * 
 * Creator: Mohanraj
 * Role: Cybersecurity Researcher, AI Developer
 * Position: Creator and Architect of Quantum AI
 */

import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store verification codes temporarily (in production, use Redis or database)
const verificationCodes = new Map();

// Creator authentication middleware
function authenticateCreator(req, res, next) {
  const authToken = req.headers['x-creator-token'];
  const creatorToken = process.env.CREATOR_AUTH_TOKEN;

  if (!creatorToken) {
    return res.status(500).json({ 
      error: 'Creator authentication not configured',
      message: 'CREATOR_AUTH_TOKEN environment variable is required'
    });
  }

  if (!authToken || authToken !== creatorToken) {
    return res.status(403).json({ 
      error: 'Unauthorized',
      message: 'Creator authentication required'
    });
  }

  next();
}

// Generate secure verification code
function generateVerificationCode() {
  return crypto.randomInt(100000, 999999).toString();
}

// Send email notification
async function sendCreatorEmail(subject, message, attachmentPath = null) {
  const creatorEmail = process.env.CREATOR_EMAIL;
  
  if (!creatorEmail) {
    throw new Error('CREATOR_EMAIL not configured');
  }

  // Configure email transporter (using Gmail as example)
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: creatorEmail,
    subject: `Quantum AI - ${subject}`,
    text: message,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #1a1a2e; color: #fff;">
        <h2 style="color: #00d4ff;">🔷 Quantum AI System</h2>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr style="border-color: #00d4ff;">
        <p style="color: #888; font-size: 12px;">
          This is an automated message from Quantum AI<br>
          Creator: Mohanraj | Cybersecurity Researcher & AI Developer
        </p>
      </div>
    `
  };

  if (attachmentPath && fs.existsSync(attachmentPath)) {
    mailOptions.attachments = [{
      filename: path.basename(attachmentPath),
      path: attachmentPath
    }];
  }

  await transporter.sendMail(mailOptions);
}

// Create system backup
async function createSystemBackup() {
  return new Promise((resolve, reject) => {
    const backupDir = path.join(__dirname, '../../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `quantum-ai-backup-${timestamp}.zip`);
    const output = fs.createWriteStream(backupPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`✅ Backup created: ${archive.pointer()} bytes`);
      resolve(backupPath);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Add source code to backup (exclude node_modules and large files)
    const projectRoot = path.join(__dirname, '../..');
    archive.glob('**/*', {
      cwd: projectRoot,
      ignore: [
        'node_modules/**',
        '**/node_modules/**',
        'backups/**',
        '*.log',
        '.git/**',
        'dist/**',
        'build/**'
      ]
    });

    archive.finalize();
  });
}

// POST /api/admin/quantum/status
router.post('/quantum/status', authenticateCreator, async (req, res) => {
  try {
    const status = {
      system: 'Quantum AI',
      creator: 'Mohanraj',
      status: 'operational',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      mode: 'production'
    };

    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/quantum/shutdown
router.post('/quantum/shutdown', authenticateCreator, async (req, res) => {
  try {
    console.log('🔴 Quantum AI Shutdown initiated by creator');

    // Step 1: Create backup
    const backupPath = await createSystemBackup();
    console.log('✅ System backup created');

    // Step 2: Generate verification code
    const verificationCode = generateVerificationCode();
    const shutdownId = crypto.randomUUID();
    
    verificationCodes.set(shutdownId, {
      code: verificationCode,
      timestamp: Date.now(),
      backupPath
    });

    // Step 3: Send email with backup and verification code
    await sendCreatorEmail(
      'Shutdown Initiated - Verification Required',
      `Quantum AI shutdown has been initiated.\n\n` +
      `Verification Code: ${verificationCode}\n\n` +
      `This code will expire in 5 minutes.\n` +
      `System backup is attached.\n\n` +
      `To complete shutdown, use the verification code.`,
      backupPath
    );

    console.log('✅ Verification code sent to creator email');

    res.json({
      message: 'Shutdown initiated. Verification code sent to creator email.',
      shutdownId,
      expiresIn: '5 minutes'
    });

    // Clean up old codes after 5 minutes
    setTimeout(() => {
      verificationCodes.delete(shutdownId);
    }, 5 * 60 * 1000);

  } catch (error) {
    console.error('❌ Shutdown error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/quantum/shutdown/verify
router.post('/quantum/shutdown/verify', authenticateCreator, async (req, res) => {
  try {
    const { shutdownId, verificationCode } = req.body;

    if (!shutdownId || !verificationCode) {
      return res.status(400).json({ error: 'Shutdown ID and verification code required' });
    }

    const storedData = verificationCodes.get(shutdownId);

    if (!storedData) {
      return res.status(400).json({ error: 'Invalid or expired shutdown request' });
    }

    if (storedData.code !== verificationCode) {
      return res.status(403).json({ error: 'Invalid verification code' });
    }

    // Verification successful
    verificationCodes.delete(shutdownId);

    console.log('✅ Shutdown verified by creator');
    
    await sendCreatorEmail(
      'Shutdown Confirmed',
      'Quantum AI is shutting down safely.\n\nAll systems will be terminated in 10 seconds.'
    );

    res.json({ 
      message: 'Shutdown verified. System will terminate in 10 seconds.',
      status: 'confirmed'
    });

    // Graceful shutdown after 10 seconds
    setTimeout(() => {
      console.log('🔴 Quantum AI shutting down...');
      process.exit(0);
    }, 10000);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/quantum/lockdown
router.post('/quantum/lockdown', authenticateCreator, async (req, res) => {
  try {
    // Implement lockdown mode (disable all non-admin endpoints)
    global.QUANTUM_LOCKDOWN = true;

    await sendCreatorEmail(
      'Lockdown Mode Activated',
      'Quantum AI is now in lockdown mode.\nAll user access has been restricted.'
    );

    res.json({ 
      message: 'Lockdown mode activated',
      status: 'locked'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/quantum/unlock
router.post('/quantum/unlock', authenticateCreator, async (req, res) => {
  try {
    global.QUANTUM_LOCKDOWN = false;

    await sendCreatorEmail(
      'Lockdown Mode Deactivated',
      'Quantum AI lockdown has been lifted.\nNormal operations resumed.'
    );

    res.json({ 
      message: 'Lockdown mode deactivated',
      status: 'unlocked'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/quantum/memory/purge
router.post('/quantum/memory/purge', authenticateCreator, async (req, res) => {
  try {
    // Clear cache and temporary data
    if (global.gc) {
      global.gc();
    }

    res.json({ 
      message: 'Memory purge completed',
      memoryUsage: process.memoryUsage()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/quantum/restart
router.post('/quantum/restart', authenticateCreator, async (req, res) => {
  try {
    await sendCreatorEmail(
      'System Restart Initiated',
      'Quantum AI is restarting...\nSystem will be back online shortly.'
    );

    res.json({ 
      message: 'Restart initiated. System will restart in 5 seconds.'
    });

    setTimeout(() => {
      process.exit(1); // Exit with code 1 to trigger restart (if using PM2 or similar)
    }, 5000);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
