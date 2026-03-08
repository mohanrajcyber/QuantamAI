@echo off
title Quantum AI - One-Click Setup and Start
color 0A

echo.
echo  ========================================
echo   QUANTUM AI - ONE-CLICK SETUP
echo  ========================================
echo.
echo  This will:
echo  1. Install all dependencies
echo  2. Start backend server
echo  3. Start frontend server
echo  4. Open your browser
echo.
echo  Press any key to begin...
pause > nul

REM Get the directory where this batch file is located
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo.
echo [1/4] Installing Backend Dependencies...
echo ========================================
cd backend
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ERROR: Backend installation failed!
    echo Please check your internet connection
    echo.
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
echo.

echo [2/4] Installing Frontend Dependencies...
echo ========================================
cd ..
call npm install
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ERROR: Frontend installation failed!
    echo Please check your internet connection
    echo.
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed
echo.

echo [3/4] Starting Backend Server...
echo ========================================
cd backend
start "Quantum AI Backend" cmd /k "cd /d "%SCRIPT_DIR%backend" && npm start"
echo ✓ Backend server starting on port 3001
echo.

echo Waiting 8 seconds for backend to initialize...
timeout /t 8 /nobreak

echo [4/4] Starting Frontend Server...
echo ========================================
cd ..
start "Quantum AI Frontend" cmd /k "cd /d "%SCRIPT_DIR%" && npm run dev"
echo ✓ Frontend server starting on port 5173
echo.

echo Waiting 5 seconds for frontend to initialize...
timeout /t 5 /nobreak

echo.
echo  ========================================
echo   SUCCESS! QUANTUM AI IS RUNNING
echo  ========================================
echo.
echo  Backend:  http://localhost:3001
echo  Frontend: http://localhost:5173
echo.
echo  Opening browser in 3 seconds...
timeout /t 3 /nobreak

REM Open browser
start http://localhost:5173

echo.
echo  ✓ Browser opened!
echo.
echo  Two server windows are running:
echo  1. Backend Server (port 3001)
echo  2. Frontend Server (port 5173)
echo.
echo  To stop: Close both terminal windows
echo.
echo  Press any key to close this window...
pause > nul
