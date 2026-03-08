@echo off
echo ========================================
echo Quantum AI - Starting All Servers
echo ========================================
echo.

REM Get the directory where this batch file is located
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo Current directory: %CD%
echo.

echo Step 1: Installing dependencies...
cd backend
if not exist "node_modules" (
    echo Installing all backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed
    echo Installing node-cache...
    call npm install node-cache
)

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Could not install dependencies
    echo Please check your internet connection and try again
    echo.
    pause
    exit /b 1
)

echo.
echo Step 2: Starting Backend Server...
start "Quantum AI Backend" cmd /k "cd /d "%SCRIPT_DIR%backend" && npm start"

echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak

cd ..

echo.
echo Step 3: Starting Frontend Server...
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)
start "Quantum AI Frontend" cmd /k "cd /d "%SCRIPT_DIR%" && npm run dev"

echo.
echo ========================================
echo All Servers Started!
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Two new windows have opened:
echo 1. Backend Server (port 3001)
echo 2. Frontend Server (port 5173)
echo.
echo Wait 10-15 seconds, then open:
echo http://localhost:5173
echo.
echo To stop servers: Close both terminal windows
echo.
echo Press any key to close this window...
pause > nul
