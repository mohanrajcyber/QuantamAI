# 🧪 Quantum AI - Testing Guide

## Quick Test (Recommended)

Just double-click: **`QUICK-TEST.bat`**

This will test all your API keys and show which providers are working.

---

## What Gets Tested

### 1. **OpenAI** (Your Key)
- API Key: `sk-proj-UIQpONXczgWKy0H9b31c...`
- Model: `gpt-4o-mini`
- Status: Will check quota and validity

### 2. **Gemini** (Your Key)
- API Key: `AIzaSyCCIvBlunSN8glSkD97...`
- Model: `gemini-2.0-flash-exp`
- Status: Will check if key is valid

### 3. **Groq** (Your Key)
- API Key: `gsk_Gy5r72arNXiHEG4MG8lS...`
- Model: `llama-3.3-70b-versatile`
- Status: Will check free tier access

### 4. **Pollinations** (No Key Needed!)
- FREE, Unlimited
- Models: 6+ available
- Status: Should always work

### 5. **G4F** (No Key Needed!)
- FREE, 200+ models
- Unlimited usage
- Status: Should always work

### 6. **Ollama** (Local, No Key Needed!)
- FREE, 650+ models
- Runs on your computer
- Status: Only if installed

---

## Expected Results

### ✅ Best Case (All Working)
```
✅ OpenAI: Working!
✅ Gemini: Working!
✅ Groq: Working!
✅ Pollinations: Working!
✅ G4F: Working!
✅ Ollama: Working!

📊 Test Summary: 6/6 passed
```

### ⚠️ Typical Case (Some Working)
```
❌ OpenAI: Quota exceeded
✅ Gemini: Working!
✅ Groq: Working!
✅ Pollinations: Working!
✅ G4F: Working!
⚠️  Ollama: Not installed

📊 Test Summary: 4/6 passed
```

### 🎯 Minimum Required (At Least 1)
```
❌ OpenAI: Quota exceeded
❌ Gemini: Invalid key
❌ Groq: Rate limited
✅ Pollinations: Working!
✅ G4F: Working!
⚠️  Ollama: Not installed

📊 Test Summary: 2/6 passed
✅ You're good to go!
```

---

## Common Issues & Solutions

### Issue 1: OpenAI Quota Exceeded
```
❌ OpenAI: insufficient_quota
```

**Solution:**
- Don't worry! Use free alternatives:
  - Pollinations (unlimited)
  - G4F (200+ models)
  - Ollama (650+ models, local)

### Issue 2: Gemini API Error
```
❌ Gemini: API key not valid
```

**Solution:**
1. Go to: https://makersuite.google.com/app/apikey
2. Create new API key
3. Update `backend/.env`

### Issue 3: Groq Rate Limited
```
❌ Groq: Rate limit exceeded
```

**Solution:**
- Wait a few minutes
- Or use other providers (automatic fallback)

### Issue 4: Ollama Not Running
```
⚠️  Ollama: Not running
```

**Solution:**
1. Install: https://ollama.com/download
2. Run: `ollama pull llama3.2`
3. Start: `ollama serve`

### Issue 5: All Providers Failed
```
❌ All tests failed
```

**Solution:**
1. Check internet connection
2. Try: `QUICK-TEST.bat` again
3. At minimum, Pollinations and G4F should work

---

## Testing Steps

### Step 1: Test API Keys
```bash
# Double-click this file:
QUICK-TEST.bat

# Or manually:
cd backend
node test-api-keys.js
```

### Step 2: Install Dependencies
```bash
cd backend
npm install node-cache
```

### Step 3: Start Backend
```bash
cd backend
npm start
```

### Step 4: Test Full System
```bash
cd backend
node test-new-architecture.js
```

---

## Manual Testing

### Test Individual Provider

**OpenAI:**
```bash
curl -X POST https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}'
```

**Gemini:**
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

**Groq:**
```bash
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"Hello"}]}'
```

**Pollinations:**
```bash
curl "https://text.pollinations.ai/Hello?model=openai"
```

**G4F:**
```bash
curl -X POST https://api.g4f.dev/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}'
```

**Ollama:**
```bash
curl http://localhost:11434/api/version
```

---

## Test Your Quantum AI Responses

### Test 1: Simple Chat
```bash
curl -X POST http://localhost:3001/api/chat/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello, I am testing Quantum AI!"}'
```

Expected Response:
```json
{
  "choices": [{
    "message": {
      "content": "Hello! I'm Quantum AI...",
      "role": "assistant"
    }
  }],
  "provider": "pollinations",
  "responseTime": 1234,
  "cached": false
}
```

### Test 2: Check Which Provider Responded
```bash
curl -X POST http://localhost:3001/api/chat/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"What is your name?"}'
```

Look for `"provider"` in response:
- `"provider": "ollama"` - Using local Ollama
- `"provider": "pollinations"` - Using Pollinations
- `"provider": "g4f"` - Using G4F
- `"provider": "groq"` - Using Groq
- `"provider": "gemini"` - Using Gemini
- `"provider": "openai"` - Using OpenAI
- `"provider": "fallback"` - Using intelligent fallback

### Test 3: Multi-Turn Conversation
```bash
curl -X POST http://localhost:3001/api/chat/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role":"user","content":"My name is Mohanraj"},
      {"role":"assistant","content":"Nice to meet you, Mohanraj!"},
      {"role":"user","content":"What is my name?"}
    ]
  }'
```

Expected: Should remember your name is Mohanraj

### Test 4: Check Statistics
```bash
curl http://localhost:3001/api/chat/stats
```

Shows:
- Total requests
- Success rate
- Best performing provider
- Cache hit rates

---

## Verification Checklist

After running tests, verify:

- [ ] At least 1 provider is working
- [ ] Backend starts without errors
- [ ] Can send chat requests
- [ ] Receives AI responses
- [ ] Provider name is shown
- [ ] Response time is reasonable (<5s)
- [ ] Fallback works if all fail

---

## Success Criteria

### ✅ Minimum (Competition Ready)
- 2+ providers working
- Chat responses working
- Fallback system active

### ✅ Good (Production Ready)
- 4+ providers working
- Fast response times (<2s)
- Cache working (>50% hit rate)

### ✅ Excellent (Enterprise Ready)
- All 6 providers working
- Ollama installed (650+ models)
- Statistics tracking active
- Health monitoring working

---

## Next Steps After Testing

### If Tests Pass:
1. ✅ Start backend: `npm start`
2. ✅ Start frontend: `npm run dev`
3. ✅ Test in browser
4. ✅ Ready for submission!

### If Tests Fail:
1. Check error messages
2. Verify API keys in `.env`
3. Check internet connection
4. Try free providers (Pollinations, G4F)
5. Install Ollama for local models

---

## Support

### Quick Help
- Run: `QUICK-TEST.bat`
- Check: `backend/test-api-keys.js` output
- Read: Error messages carefully

### Detailed Help
- `IMPLEMENTATION_GUIDE.md` - Full setup
- `backend/ai/README.md` - API docs
- `ARCHITECTURE_INSIGHTS.md` - Design patterns

---

## 🎉 Ready to Test!

Just run: **`QUICK-TEST.bat`**

It will show you:
- ✅ Which API keys work
- ❌ Which ones have issues
- 💡 What to do next

Good luck! 🚀
