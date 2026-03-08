@echo off
echo ========================================
echo Quantum AI - Installation Script
echo ========================================
echo.

echo Installing backend dependencies...
cd backend
call npm install node-cache
if %errorlevel% neq 0 (
    echo ERROR: Failed to install node-cache
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure backend/.env file
echo 2. Run: npm start (in backend folder)
echo 3. Test: node test-new-architecture.js
echo.
echo See IMPLEMENTATION_GUIDE.md for details
echo.
pause
