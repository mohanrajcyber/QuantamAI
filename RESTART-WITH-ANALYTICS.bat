@echo off
echo ========================================
echo Restarting Quantum AI Backend
echo With Real-Time Analytics
echo ========================================
echo.

echo Stopping any running backend servers...
taskkill /F /IM node.exe 2>nul

echo.
echo Starting backend with analytics...
cd backend
start cmd /k "npm start"

echo.
echo ========================================
echo Backend restarted!
echo ========================================
echo.
echo Analytics API available at:
echo http://localhost:3001/api/analytics/stats
echo.
echo Now refresh your Master Control Dashboard!
echo.
pause
