@echo off
cd /d "%~dp0"
echo ========================================
echo Starting Quantum AI Platform
echo ========================================
echo.
echo Current Directory: %CD%
echo.

echo Starting Backend Server...
start "Quantum AI Backend" cmd /k "cd /d "%~dp0backend" && node server.js"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Quantum AI Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
