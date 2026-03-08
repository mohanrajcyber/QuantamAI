@echo off
color 0B
title Quantum AI - One-Click Startup

echo.
echo ========================================
echo    QUANTUM AI - STARTING...
echo ========================================
echo.

REM Kill existing processes
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak > nul

echo [1/3] Starting Backend Server...
cd backend
start /MIN "Quantum AI Backend" cmd /c "npm start"
cd ..
echo     Backend starting on port 3001...
timeout /t 5 /nobreak > nul

echo.
echo [2/3] Starting Frontend Server...
start /MIN "Quantum AI Frontend" cmd /c "npm run dev"
echo     Frontend starting on port 5173...
timeout /t 5 /nobreak > nul

echo.
echo [3/3] Opening Quantum AI...
timeout /t 3 /nobreak > nul

REM Open the main link
start http://localhost:5173

echo.
echo ========================================
echo    QUANTUM AI IS READY!
echo ========================================
echo.
echo ONE LINK FOR EVERYTHING:
echo.
echo    http://localhost:5173
echo.
echo ========================================
echo.
echo TIPS:
echo - Login Page: http://localhost:5173?logout=force
echo - Master Control: Type /source code 17120105MOHANRAJ
echo - Backend runs automatically in background
echo.
echo Press any key to close this window...
echo (Servers will keep running)
pause > nul
