@echo off
echo ========================================
echo    QUANTUM AI - FULL SYSTEM STARTUP
echo ========================================
echo.

echo [1/5] Starting Backend Server...
start "Quantum AI Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

echo [2/5] Starting Main Frontend...
start "Quantum AI Frontend" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo [3/5] Starting Hologram Server...
start "Quantum AI Hologram" cmd /k "cd sphere-main\QuantumAI-Hologram && npm install --legacy-peer-deps && npm run dev -- --port 5174"
timeout /t 3 /nobreak >nul

echo [4/5] Starting Avatar Server...
start "Quantum AI Avatar" cmd /k "cd TalkingHead-main\TalkingHead-main && npm install && npm start"
timeout /t 3 /nobreak >nul

echo [5/5] Opening Applications...
timeout /t 5 /nobreak >nul
start http://localhost:5173
echo.
echo ========================================
echo    ALL SYSTEMS RUNNING!
echo ========================================
echo.
echo Main App: http://localhost:5173
echo Backend:  http://localhost:3001  
echo Hologram: http://localhost:5174
echo Avatar:   http://localhost:8000
echo.
echo Click "Hologram" in sidebar for 3D interface!
echo Click "Avatar" button for 3D talking avatar!
echo.
pause