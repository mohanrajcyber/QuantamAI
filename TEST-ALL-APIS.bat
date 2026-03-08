@echo off
echo ========================================
echo Quantum AI - API Testing Script
echo ========================================
echo.

echo Step 1: Installing dependencies...
cd backend
call npm install node-cache
if %errorlevel% neq 0 (
    echo ERROR: Failed to install node-cache
    pause
    exit /b 1
)

echo.
echo Step 2: Starting backend server...
echo Please wait for server to start...
echo.
start "Quantum AI Backend" cmd /k "npm start"

echo Waiting 10 seconds for server to initialize...
timeout /t 10 /nobreak

echo.
echo Step 3: Running API tests...
echo.
node test-new-architecture.js

echo.
echo ========================================
echo Testing Complete!
echo ========================================
echo.
echo Check the results above.
echo Backend server is still running in another window.
echo.
pause
