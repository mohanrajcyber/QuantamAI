# Clean Start Plan

## Problem
Too many old files, backend dependencies, and conflicts causing build errors.

## Solution
Create a minimal, clean version with ONLY essential files:

### Keep These Files:
1. Frontend (src/) - All UI components
2. API function (api/chat.js) - AI serverless function
3. Config files (package.json, vite.config.ts, vercel.json)

### Remove/Ignore These:
1. backend/ folder - Not needed for Vercel deployment
2. BackendTest component - Causing build errors
3. backendService.ts - Not needed (using serverless function)
4. All test files

## Steps to Clean

1. Update .gitignore to exclude backend/
2. Remove backendService imports
3. Ensure only /api/chat endpoint is used
4. Deploy clean version

This will give us a working deployment with:
- Frontend ✅
- AI Chat ✅ (via /api/chat serverless function)
- No backend conflicts ✅
