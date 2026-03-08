@echo off
echo ========================================
echo  QUANTUM AI - CLEAR LOGIN & RESTART
echo ========================================
echo.
echo This will:
echo 1. Clear your browser localStorage (logout)
echo 2. Restart both backend and frontend servers
echo.
echo INSTRUCTIONS:
echo 1. Close ALL browser tabs with Quantum AI
echo 2. Press any key to continue...
pause > nul

echo.
echo [1/3] Stopping any running servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak > nul

echo.
echo [2/3] Starting Backend Server...
cd backend
start "Quantum AI Backend" cmd /k "npm start"
cd ..
timeout /t 3 /nobreak > nul

echo.
echo [3/3] Starting Frontend Server...
start "Quantum AI Frontend" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo  SERVERS STARTED!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo IMPORTANT: 
echo - Open http://localhost:5173 in your browser
echo - You will see the LOGIN/SIGNUP page
echo - If you still see the main page, press Ctrl+Shift+Delete
echo   and clear "Cookies and site data" for localhost
echo.
echo Press any key to exit...
pause > nul
