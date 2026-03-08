# 🔧 Fix PowerShell Script Execution Issue

## The Problem

```
npm : File D:\node\npm.ps1 cannot be loaded because running scripts is disabled
SecurityError: UnauthorizedAccess
```

Windows blocks PowerShell scripts by default for security.

---

## ✅ Quick Solution (Use CMD Instead)

**Just double-click this file:**
```
START-EVERYTHING.bat
```

This uses CMD instead of PowerShell and will work immediately! ✅

---

## 🔓 Permanent Fix (Enable PowerShell Scripts)

If you want to use PowerShell commands like `npm start`:

### Step 1: Open PowerShell as Administrator
1. Press `Windows + X`
2. Click **"Windows PowerShell (Admin)"** or **"Terminal (Admin)"**
3. Click **"Yes"** when asked for permission

### Step 2: Run This Command
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 3: Confirm
Type `Y` and press Enter

### Step 4: Test
```powershell
npm --version
```

Should work now! ✅

---

## What This Does

- **RemoteSigned**: Allows local scripts, requires signature for downloaded scripts
- **CurrentUser**: Only affects your user account (safe)
- **Does NOT**: Disable Windows security

---

## Alternative: Use CMD Commands

Instead of PowerShell, use CMD:

| PowerShell | CMD |
|------------|-----|
| `npm start` | `npm start` (same!) |
| `npm install` | `npm install` (same!) |
| `cd backend` | `cd backend` (same!) |

**Note:** npm commands work the same in both CMD and PowerShell!

---

## Quick Start (No PowerShell Fix Needed)

### Option 1: Use Batch File (Easiest)
Double-click: `START-EVERYTHING.bat`

### Option 2: Use CMD Manually
1. Press `Windows + R`
2. Type `cmd` and press Enter
3. Run:
```cmd
cd /d "D:\Quantum AI"
cd backend
npm install node-cache
npm start
```

4. Open another CMD window:
```cmd
cd /d "D:\Quantum AI"
npm run dev
```

---

## Success Checklist

- [ ] Backend starts on port 3001
- [ ] Frontend starts on port 5173
- [ ] Can open http://localhost:5173
- [ ] Chat works without 429 errors

---

## 🎉 You're Ready!

Choose your method:
1. **Quick:** Double-click `START-EVERYTHING.bat`
2. **Permanent:** Fix PowerShell (see above)
3. **Manual:** Use CMD commands

All methods work! Pick what's easiest for you. 🚀
