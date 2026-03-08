# 🔧 Fix YouTube API Error

## ❌ Current Issue

YouTube search is failing with error: "YouTube search failed. Please try again."

---

## 🔍 Possible Causes

1. **API Key Format Issue** - The API key might be incorrect
2. **API Not Enabled** - YouTube Data API v3 not enabled in Google Cloud
3. **API Key Restrictions** - Key might have restrictions
4. **Quota Exceeded** - Daily quota might be exceeded
5. **Network Issue** - Internet connection problem

---

## ✅ Solution Steps

### Step 1: Test Your API Key

**Open the test file:**
```
test-youtube-api.html
```

**How to open:**
1. Right-click on `test-youtube-api.html`
2. Select "Open with" → "Browser"
3. Or double-click the file

**What to do:**
1. Click "1. Test API Key" button
2. See if it says "✅ API Key is VALID!"
3. If error, read the error message

---

### Step 2: Verify API Key Format

**Your current API key:**
```
AIzaSyAQAb8RN6J8CNsdsJ-9gka_F_TUG3asD45hj4tJbb_LAoeX-8c9Zg
```

**Check:**
- [ ] Starts with "AIzaSy"
- [ ] Total length: 39 characters
- [ ] No spaces
- [ ] No extra characters

**If format looks wrong:**
1. Go to Google Cloud Console
2. Go to "APIs & Services" → "Credentials"
3. Find your API key
4. Copy it EXACTLY (no spaces, no line breaks)

---

### Step 3: Verify YouTube Data API v3 is Enabled

**Go to Google Cloud Console:**
1. Open: https://console.cloud.google.com
2. Select project: "Quantum-AI-YouTube"
3. Go to "APIs & Services" → "Library"
4. Search: "YouTube Data API v3"
5. Make sure it says "API ENABLED"
6. If not, click "ENABLE"

---

### Step 4: Check API Key Restrictions

**In Google Cloud Console:**
1. Go to "APIs & Services" → "Credentials"
2. Click on your API key
3. Check "API restrictions"
4. Make sure "YouTube Data API v3" is allowed
5. Check "Application restrictions"
6. For testing, set to "None" (can restrict later)

---

### Step 5: Check Quota

**In Google Cloud Console:**
1. Go to "APIs & Services" → "Dashboard"
2. Click "YouTube Data API v3"
3. Click "Quotas"
4. Check if you have quota remaining
5. Free tier: 10,000 units/day

---

### Step 6: Update API Key in Code

**If you got a new API key:**

1. Open: `src/app/services/youtubeService.ts`
2. Find line 7:
```typescript
const YOUTUBE_API_KEY = 'YOUR_OLD_KEY';
```
3. Replace with your NEW key:
```typescript
const YOUTUBE_API_KEY = 'YOUR_NEW_KEY_HERE';
```
4. Save file
5. Refresh browser (Ctrl+R or F5)

---

## 🧪 Test Again

### After fixing:

1. **Open Quantum AI:** http://localhost:5173
2. **Click YouTube** button
3. **Type:** "lofi music"
4. **Press:** Enter
5. **Should see:** 20 real videos!

---

## 🐛 Still Not Working?

### Check Browser Console:

1. Press **F12** to open DevTools
2. Click **Console** tab
3. Look for errors
4. Take screenshot
5. Share error message

### Common Errors:

**Error: "API key not valid"**
- Solution: Get new API key from Google Cloud

**Error: "YouTube Data API has not been used"**
- Solution: Enable YouTube Data API v3 in Google Cloud

**Error: "Quota exceeded"**
- Solution: Wait until tomorrow (resets daily)

**Error: "Access Not Configured"**
- Solution: Enable YouTube Data API v3

**Error: "Network error"**
- Solution: Check internet connection

---

## 📝 Get New API Key

### If you need a new API key:

1. **Go to:** https://console.cloud.google.com
2. **Select project** or create new one
3. **Enable API:**
   - Go to "APIs & Services" → "Library"
   - Search "YouTube Data API v3"
   - Click "ENABLE"
4. **Create API Key:**
   - Go to "APIs & Services" → "Credentials"
   - Click "CREATE CREDENTIALS"
   - Select "API key"
   - Copy the key
5. **Update code:**
   - Paste key in `src/app/services/youtubeService.ts`
   - Save and refresh

---

## ✅ Verification Checklist

Before testing again, verify:

- [ ] API key is correct (39 characters)
- [ ] YouTube Data API v3 is enabled
- [ ] API key has no restrictions (for testing)
- [ ] Quota is not exceeded
- [ ] Internet connection is working
- [ ] Browser console shows no errors
- [ ] Code is saved
- [ ] Browser is refreshed

---

## 🎬 Expected Result

**When working correctly:**

1. Click YouTube button
2. See trending videos load automatically
3. Type "lofi music" and press Enter
4. See 20 real YouTube videos
5. Click any video to play
6. Video plays in embedded player

---

## 📞 Need Help?

### Debug Information to Share:

1. **API Key format** (first 10 chars only): `AIzaSyAQAb...`
2. **API Key length:** 39 characters
3. **Browser console errors:** (screenshot)
4. **Test file results:** (screenshot of test-youtube-api.html)
5. **Google Cloud Console:** Is API enabled?

---

## 🚀 Quick Fix Commands

### If you have a new API key:

**Windows (PowerShell):**
```powershell
# Open the file
notepad src/app/services/youtubeService.ts

# Replace the API key on line 7
# Save and close

# Refresh browser
# Press Ctrl+R or F5
```

---

## 🎉 Success!

**When it works, you'll see:**
- ✅ Trending videos load automatically
- ✅ Search returns 20 real videos
- ✅ Videos play when clicked
- ✅ No error messages

**Then you can:**
- 🔍 Search MILLIONS of videos
- 📺 Watch ANY YouTube video
- 🎵 Listen to music while working
- 🎯 Use PiP mode

---

**Ippo test pannunga! Open `test-youtube-api.html` first to verify your API key!** 🚀
