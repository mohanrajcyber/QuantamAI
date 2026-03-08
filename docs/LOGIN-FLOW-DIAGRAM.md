# Quantum AI - Login Flow Diagram

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    USER VISITS QUANTUM AI                    │
│                  http://localhost:5173                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │ Check Storage │
              │ quantum_user? │
              └───────┬───────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼ YES                       ▼ NO
┌───────────────┐           ┌──────────────┐
│  AUTO-LOGIN   │           │  SHOW LOGIN  │
│  (Like ChatGPT)│          │     PAGE     │
└───────┬───────┘           └──────┬───────┘
        │                           │
        │                           ▼
        │                   ┌──────────────┐
        │                   │ User Chooses │
        │                   └──────┬───────┘
        │                           │
        │         ┌─────────────────┼─────────────────┐
        │         │                 │                 │
        │         ▼                 ▼                 ▼
        │   ┌──────────┐    ┌──────────┐    ┌──────────┐
        │   │  Google  │    │  Email/  │    │   Skip   │
        │   │ Sign-In  │    │ Password │    │  Login   │
        │   └────┬─────┘    └────┬─────┘    └────┬─────┘
        │        │               │               │
        │        └───────────────┴───────────────┘
        │                        │
        │                        ▼
        │                ┌──────────────┐
        │                │ Save to      │
        │                │ localStorage │
        │                └──────┬───────┘
        │                        │
        └────────────────────────┘
                                 │
                                 ▼
                        ┌────────────────┐
                        │  QUANTUM AI    │
                        │   MAIN PAGE    │
                        └────────┬───────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
        ┌──────────┐    ┌──────────┐    ┌──────────┐
        │   Chat   │    │  Master  │    │  Logout  │
        │   with   │    │ Control  │    │  Button  │
        │    AI    │    │ /source  │    │          │
        └──────────┘    └──────────┘    └────┬─────┘
                                              │
                                              ▼
                                      ┌──────────────┐
                                      │ Clear Storage│
                                      │ Show Login   │
                                      └──────────────┘
```

## Force Logout Flow

```
┌─────────────────────────────────────────────────────────────┐
│         USER VISITS WITH ?logout=force PARAMETER             │
│           http://localhost:5173?logout=force                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │ Check URL for │
              │ logout=force  │
              └───────┬───────┘
                      │
                      ▼ YES
              ┌───────────────┐
              │ Clear Storage │
              │ quantum_user  │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   Redirect    │
              │   to Home     │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │  SHOW LOGIN   │
              │     PAGE      │
              └───────────────┘
```

## Master Control Access Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER LOGGED IN                            │
│                  Using Quantum AI                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │  User Types   │
              │  in Chat:     │
              │  /source code │
              │ 17120105...   │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ Verify Code   │
              │ Correct?      │
              └───────┬───────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼ YES                       ▼ NO
┌───────────────┐           ┌──────────────┐
│  ACTIVATE     │           │  Show Error  │
│  MASTER MODE  │           │   Message    │
└───────┬───────┘           └──────────────┘
        │
        ▼
┌───────────────────────────────────────────┐
│      MASTER CONTROL DASHBOARD             │
│                                           │
│  • Real-time User Activity                │
│  • System Statistics                      │
│  • Active Users Table                     │
│  • Admin Controls                         │
│  • World Map (Coming Soon)                │
└───────────────────────────────────────────┘
```

## Authentication Methods

```
┌─────────────────────────────────────────────────────────────┐
│                   AUTHENTICATION METHODS                     │
└─────────────────────────────────────────────────────────────┘

1. GOOGLE SIGN-IN (Demo Mode)
   ┌──────────────────────────────────────┐
   │ Click "Continue with Google"         │
   │ → Instant login (demo)               │
   │ → Real OAuth coming soon             │
   └──────────────────────────────────────┘

2. EMAIL/PASSWORD
   ┌──────────────────────────────────────┐
   │ Enter: Name, Email, Password         │
   │ → Validate (min 6 chars)             │
   │ → Save to backend + localStorage     │
   │ → Login success                      │
   └──────────────────────────────────────┘

3. PHONE OTP (Coming Soon)
   ┌──────────────────────────────────────┐
   │ Enter: Phone Number                  │
   │ → Send OTP                           │
   │ → Verify OTP                         │
   │ → Login success                      │
   └──────────────────────────────────────┘

4. SKIP LOGIN (Demo Mode)
   ┌──────────────────────────────────────┐
   │ Click "Skip Login (Demo Mode)"       │
   │ → Create demo user                   │
   │ → Instant access                     │
   │ → For testing only                   │
   └──────────────────────────────────────┘
```

## Data Storage Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER CREATES ACCOUNT                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │ Collect Data: │
              │ • Name        │
              │ • Email       │
              │ • Phone       │
              │ • Location    │
              └───────┬───────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌───────────────┐           ┌──────────────┐
│  BACKEND DB   │           │ localStorage │
│  (Optional)   │           │  (Always)    │
└───────┬───────┘           └──────┬───────┘
        │                           │
        │ If backend fails          │
        │ ↓                         │
        │ Continue anyway           │
        │                           │
        └───────────────┬───────────┘
                        │
                        ▼
                ┌──────────────┐
                │ User Logged  │
                │     In       │
                └──────────────┘
```

## Session Management

```
┌─────────────────────────────────────────────────────────────┐
│                    SESSION LIFECYCLE                         │
└─────────────────────────────────────────────────────────────┘

FIRST VISIT
   │
   ▼
[Login Page] → [Create Account] → [Save Session] → [Main Page]
                                        │
                                        ▼
                                  localStorage:
                                  quantum_user = {
                                    user_id: "...",
                                    name: "...",
                                    email: "...",
                                    ...
                                  }

NEXT VISIT
   │
   ▼
[Check localStorage] → [Found Session] → [Auto-Login] → [Main Page]
                            │
                            ▼
                      No login needed!
                      (Like ChatGPT)

LOGOUT
   │
   ▼
[Click Logout] → [Clear localStorage] → [Redirect] → [Login Page]
```

## Quick Reference

| Action | Method |
|--------|--------|
| **See Login Page** | `http://localhost:5173?logout=force` |
| **Auto-Login** | Just visit `http://localhost:5173` |
| **Logout** | Click user icon → Logout |
| **Master Control** | Type: `/source code 17120105MOHANRAJ` |
| **Clear Session** | `localStorage.clear()` in console |

---

**Created by:** Mohanraj  
**Role:** Cybersecurity Researcher, AI Developer
