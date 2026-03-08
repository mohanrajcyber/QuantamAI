@echo off
echo ========================================
echo Quantum AI - Real Data Analytics Setup
echo Creator: Mohanraj
echo ========================================
echo.

echo Installing analytics dependencies...
cd backend
call npm install geoip-lite ua-parser-js nodemailer archiver

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Restart backend: npm start
echo 2. Open Quantum AI: http://localhost:5173
echo 3. Type: /source code 17120105MOHANRAJ
echo 4. See REAL data in dashboard!
echo.
echo Press any key to exit...
pause >nul
