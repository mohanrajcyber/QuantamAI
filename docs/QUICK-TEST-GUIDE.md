# ⚡ Quick Test Guide - 30 Minutes

## 🚀 Step 1: Start Servers (2 minutes)

```bash
# Double-click this file:
START.bat

# Wait 10 seconds
# Browser should open automatically
```

**Check:**
- ✅ Backend terminal shows: "Initialized 6 AI providers"
- ✅ Frontend terminal shows: "Local: http://localhost:5173"
- ✅ Browser opens automatically

---

## 🔐 Step 2: Test Login (5 minutes)

### Test 2.1: Force Logout
```
URL: http://localhost:5173?logout=force
```
**Expected:** Login page appears with gradient background

**✅ Pass** | **❌ Fail**

### Test 2.2: Create Account
```
1. Click "Don't have an account? Sign up"
2. Fill:
   - Name: Test User
   - Email: test@test.com
   - Password: test123
3. Click "Create Account"
```
**Expected:** Login successful, main page loads

**✅ Pass** | **❌ Fail**

### Test 2.3: Auto-Login
```
1. Close browser
2. Open: http://localhost:5173
```
**Expected:** Automatically logged in

**✅ Pass** | **❌ Fail**

---

## 💬 Step 3: Test AI Chat (10 minutes)

### Test 3.1: Basic Chat
```
1. Type: "Hello, who are you?"
2. Click Send
```
**Expected:** AI responds with introduction

**✅ Pass** | **❌ Fail**

### Test 3.2: Creator Info
```
1. Type: "Who created you?"
2. Click Send
```
**Expected:** AI says "Mohanraj"

**✅ Pass** | **❌ Fail**

### Test 3.3: Multi-Provider
```
1. Check if AI provider selector is visible
2. Try switching providers
```
**Expected:** Can switch between providers

**✅ Pass** | **❌ Fail**

---

## 🎨 Step 4: Test Image Generator (3 minutes)

### Test 4.1: Generate Image
```
1. Click "Image Generator" in sidebar
2. Enter prompt: "A futuristic AI robot"
3. Click "Generate Images"
```
**Expected:** Image generates and displays

**✅ Pass** | **❌ Fail**

---

## 🎤 Step 5: Test Voice Assistant (3 minutes)

### Test 5.1: Voice Interface
```
1. Click "Voice Assistant" in sidebar
2. Check if microphone button is visible
```
**Expected:** Voice interface loads

**✅ Pass** | **❌ Fail**

---

## 📄 Step 6: Test Document Analyzer (2 minutes)

### Test 6.1: Document Upload
```
1. Click "Document Analyzer" in sidebar
2. Check if upload area is visible
```
**Expected:** Upload interface loads

**✅ Pass** | **❌ Fail**

---

## 👑 Step 7: Test Master Control (5 minutes)

### Test 7.1: Access Dashboard
```
1. In chat, type: /source code 17120105MOHANRAJ
2. Press Enter
```
**Expected:** Master Control Dashboard appears

**✅ Pass** | **❌ Fail**

### Test 7.2: Real-Time Analytics
```
1. Check if system stats are visible
2. Check if user table is visible
3. Wait 3 seconds
```
**Expected:** Data auto-refreshes

**✅ Pass** | **❌ Fail**

---

## ⚡ Step 8: Test Quantum Commands (3 minutes)

### Test 8.1: Status Command
```
1. Type: quantum status
2. Send
```
**Expected:** System status displayed

**✅ Pass** | **❌ Fail**

### Test 8.2: Restart Command
```
1. Type: quantum restart
2. Send
```
**Expected:** Page reloads

**✅ Pass** | **❌ Fail**

---

## 🌐 Step 9: Test Language Selector (2 minutes)

### Test 9.1: Switch Language
```
1. Click Globe icon in header
2. Select "தமிழ்" (Tamil)
```
**Expected:** Language changes to Tamil

**✅ Pass** | **❌ Fail**

### Test 9.2: Switch Back
```
1. Click Globe icon
2. Select "English"
```
**Expected:** Language changes to English

**✅ Pass** | **❌ Fail**

---

## 📊 Test Results Summary

### Critical Features (Must Work!)
- [ ] Login system
- [ ] AI chat responds
- [ ] Creator info correct
- [ ] Master control accessible
- [ ] At least 1 AI provider working

### Important Features
- [ ] Image generation
- [ ] Voice assistant
- [ ] Document analyzer
- [ ] Quantum commands
- [ ] Language selector

### Total Tests: 15
### Passed: ___
### Failed: ___

---

## 🐛 If Something Fails

### AI Chat Not Working?
```
1. Check backend terminal for errors
2. Check browser console (F12)
3. Try different AI provider
4. Check API keys in backend/.env
```

### Login Not Working?
```
1. Clear browser cache
2. Use: http://localhost:5173?logout=force
3. Try "Skip Login (Demo Mode)"
```

### Master Control Not Working?
```
1. Make sure you're logged in
2. Type exact command: /source code 17120105MOHANRAJ
3. Check spelling
```

---

## ✅ Quick Pass/Fail Checklist

**Critical (Must Pass):**
- [ ] Can login
- [ ] Can send chat message
- [ ] AI responds
- [ ] Says "Mohanraj" when asked
- [ ] Master control accessible

**If all 5 critical tests pass → Ready for submission! 🎉**

---

**Time Taken:** ___ minutes  
**Status:** ✅ Ready | ⚠️ Needs Fixes | ❌ Not Ready

---

**Next Step:** Take screenshots of working features!
