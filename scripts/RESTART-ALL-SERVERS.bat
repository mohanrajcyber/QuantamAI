@echo off
echo ========================================
echo Quantum AI - Complete System Restart
echo Creator: Mohanraj
echo ========================================
echo.

echo Stopping all running servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo Starting Backend Server...
echo ========================================
cd backend
start cmd /k "title Quantum AI Backend && npm start"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak

echo.
echo ========================================
echo Starting Frontend Server...
echo ========================================
cd ..
start cmd /k "title Quantum AI Frontend && npm run dev"

echo.
echo Waiting for frontend to start...
timeout /t 5 /nobreak

echo.
echo ========================================
echo All Servers Started Successfully!
echo ========================================
echo.
echo Backend API: http://localhost:3001
echo Frontend App: http://localhost:5173
echo.
echo Opening Quantum AI in browser...
timeout /t 3 /nobreak
start http://localhost:5173

echo.
echo ========================================
echo QUANTUM AI - ALL LINKS
echo ========================================
echo.
echo MAIN APPLICATION:
echo - Quantum AI: http://localhost:5173
echo.
echo BACKEND API:
echo - API Root: http://localhost:3001
echo - Health Check: http://localhost:3001/api/health
echo - Analytics Stats: http://localhost:3001/api/analytics/stats
echo - Active Users: http://localhost:3001/api/analytics/users
echo - Registered Users: http://localhost:3001/api/auth/users
echo.
echo AUTHENTICATION:
echo - Login/Signup: http://localhost:5173 (auto-shows)
echo.
echo MASTER CONTROL:
echo - Type in chat: /source code 17120105MOHANRAJ
echo.
echo ========================================
echo System Ready! Enjoy Quantum AI!
echo ========================================
echo.
pause
