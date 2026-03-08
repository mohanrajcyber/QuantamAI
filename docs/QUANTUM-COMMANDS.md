# Quantum AI - Creator Commands Reference

## Overview
Special commands for controlling Quantum AI system. These commands work directly in the chat interface.

**Creator**: Mohanraj | Cybersecurity Researcher & AI Developer

---

## Available Commands

### 1. `/quantum shutdown` 🔴
**Description**: Completely shuts down Quantum AI and closes the browser

**What it does**:
- Displays shutdown message with creator information
- Shows current date and time
- Closes all browser tabs after 3 seconds
- Complete system termination

**Usage**:
```
quantum shutdown
```

**Response**:
```
✅ Shutdown complete.

Quantum AI was created and developed by Mohanraj, 
a Cybersecurity Researcher, AI Developer, and the 
architect of the Quantum AI platform.

Current date and time: [timestamp]

Closing all tabs in 3 seconds...
```

---

### 2. `/quantum restart` 🔄
**Description**: Restarts Quantum AI by reloading the page

**What it does**:
- Displays restart message
- Reloads the entire application after 2 seconds
- Returns to home page with fresh state
- All systems come back online

**Usage**:
```
quantum restart
```

**Response**:
```
🔄 Quantum AI is restarting...

All systems are now online. What can I assist you with today?

Created by: Mohanraj | Cybersecurity Researcher & AI Developer
```

---

### 3. `/quantum lockdown` 🔒
**Description**: Activates lockdown mode - blocks all non-creator access

**What it does**:
- Restricts all user interactions
- Only "quantum unlock" command works
- Stores lockdown state in session
- Prevents normal chat operations

**Usage**:
```
quantum lockdown
```

**Response**:
```
🔒 Lockdown Mode Activated

Quantum AI is now in lockdown mode. All user access has been restricted.

Only creator (Mohanraj) can access the system.

Use "quantum unlock" to restore normal operations.
```

**When locked down**:
- All messages except "quantum unlock" are blocked
- Users see: "System Lockdown Active - Access restricted to creator only"

---

### 4. `/quantum unlock` 🔓
**Description**: Deactivates lockdown mode - restores normal operations

**What it does**:
- Removes lockdown restrictions
- Restores full system access
- Clears lockdown state
- Returns to normal operations

**Usage**:
```
quantum unlock
```

**Response**:
```
🔓 Lockdown Mode Deactivated

Quantum AI lockdown has been lifted.

Normal operations resumed. All users can now access the system.

System Status: Operational ✅
```

---

### 5. `/quantum memory purge` 🗑️
**Description**: Clears all cache, storage, and conversation history

**What it does**:
- Clears session storage
- Clears local storage
- Clears conversation history
- Forces garbage collection (if available)
- Optimizes memory usage

**Usage**:
```
quantum memory purge
```

**Response**:
```
🗑️ Memory Purge Complete

Cache cleared ✅
Session storage cleared ✅
Local storage cleared ✅
Conversation history cleared ✅

Memory usage optimized. System is running fresh.

Quantum AI is ready for new tasks!
```

---

## Command Patterns

All commands follow this pattern:
```
quantum [command]
```

**Case insensitive**: Works with any capitalization
- `quantum shutdown` ✅
- `Quantum Shutdown` ✅
- `QUANTUM SHUTDOWN` ✅

**Flexible spacing**: Extra spaces are handled
- `quantum  shutdown` ✅
- `quantum    restart` ✅

---

## Security Features

### 1. Lockdown Protection
- When lockdown is active, only `quantum unlock` works
- All other commands and messages are blocked
- Prevents unauthorized access during maintenance

### 2. Session Persistence
- Lockdown state persists across page refreshes
- Stored in sessionStorage (cleared when browser closes)
- Automatic state restoration on reload

### 3. Creator Attribution
- All commands display creator information
- Reinforces system ownership
- Professional branding

---

## Use Cases

### Emergency Shutdown
```
User: quantum shutdown
AI: [Displays shutdown message and closes browser]
```

### System Maintenance
```
User: quantum lockdown
AI: [Activates lockdown mode]
[Perform maintenance]
User: quantum unlock
AI: [Restores normal operations]
```

### Performance Optimization
```
User: quantum memory purge
AI: [Clears all cache and storage]
```

### Quick Reset
```
User: quantum restart
AI: [Reloads application]
```

---

## Technical Details

### Browser Compatibility
- **Shutdown**: Works best in windows opened by JavaScript
- **Restart**: Works in all browsers (uses `window.location.reload()`)
- **Lockdown/Unlock**: Works in all browsers (uses sessionStorage)
- **Memory Purge**: Works in all browsers (uses storage APIs)

### Storage Used
- `sessionStorage.quantum_lockdown`: Lockdown state flag
- Cleared on browser close or manual purge

### Events Dispatched
- `aiStateChange`: Notifies other components of state changes
- Used for avatar animations and UI updates

---

## Examples

### Complete Workflow
```
1. User: quantum lockdown
   → System enters lockdown mode

2. User: hello
   → Blocked: "System Lockdown Active"

3. User: quantum unlock
   → System restored to normal

4. User: hello
   → AI responds normally

5. User: quantum memory purge
   → All data cleared, fresh start

6. User: quantum restart
   → Page reloads, back to home

7. User: quantum shutdown
   → Browser closes
```

---

## Troubleshooting

### Shutdown doesn't close browser
**Reason**: Browser security prevents closing user-opened tabs

**Solution**: 
- Use Creator Control Panel for proper shutdown
- Or manually close the tab after shutdown message

### Lockdown won't unlock
**Solution**: 
- Type exactly: `quantum unlock`
- Check for typos
- Refresh page if needed

### Memory purge didn't clear everything
**Note**: Some browser data (cookies, history) requires manual clearing

---

## Creator Control Panel

For advanced control with backend integration, use the Creator Control Panel:
- Navigate to `/creator-control` (if implemented)
- Requires authentication token
- Provides additional features:
  - Email notifications
  - System backups
  - Verification codes
  - Remote control

---

## Notes

- Commands are designed for creator use
- Can be used by anyone with chat access
- For production, implement authentication
- Consider adding rate limiting
- Log all command usage for audit

---

**Created by**: Mohanraj  
**Role**: Cybersecurity Researcher & AI Developer  
**System**: Quantum AI Platform  
**Version**: 1.0.0

🇮🇳 AI for Bharat
