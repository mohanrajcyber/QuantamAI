@echo off
color 0B
title Quantum AI - One-Click Startup

cls
echo.
echo  ========================================
echo     QUANTUM AI - ONE-CLICK STARTUP
echo  ========================================
echo.
echo  Starting both servers in one command...
echo.

REM Kill existing Node processes
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak > nul

echo  [*] Starting Backend + Frontend...
echo.

REM Start both servers using npm script
start "Quantum AI - All Servers" cmd /k "npm run start:all"

echo  [*] Waiting for servers to start...
timeout /t 8 /nobreak > nul

echo.
echo  [*] Opening Quantum AI in browser...
timeout /t 2 /nobreak > nul

REM Open the main link
start http://localhost:5173

cls
echo.
echo  ========================================
echo     QUANTUM AI IS READY! 
echo  ========================================
echo.
echo  ONE LINK FOR EVERYTHING:
echo.
echo     http://localhost:5173
echo.
echo  ========================================
echo.
echo  QUICK LINKS:
echo.
echo  - Main App:    http://localhost:5173
echo  - Login Page:  http://localhost:5173?logout=force
echo  - Backend API: http://localhost:3001
echo.
echo  ========================================
echo.
echo  MASTER CONTROL:
echo     Type: /source code 17120105MOHANRAJ
echo.
echo  QUANTUM COMMANDS:
echo     quantum shutdown
echo     quantum restart
echo     quantum lockdown
echo     quantum unlock
echo     quantum memory purge
echo.
echo  ========================================
echo.
echo  Both servers are running in one window!
echo  Check the "Quantum AI - All Servers" window
echo  for server logs.
echo.
echo  Press any key to close this window...
echo  (Servers will keep running)
echo.
pause > nul
