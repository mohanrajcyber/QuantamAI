@echo off
echo ========================================
echo Fixing Analytics API Error
echo ========================================
echo.

echo Stopping backend to clear rate limit...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting backend with fixed rate limiting...
cd backend
start cmd /k "npm start"

echo.
echo ========================================
echo Backend restarted!
echo ========================================
echo.
echo Wait 5 seconds for backend to start...
timeout /t 5 /nobreak

echo.
echo Testing analytics API...
curl http://localhost:3001/api/analytics/stats

echo.
echo.
echo ========================================
echo If you see JSON data above, it's working!
echo ========================================
echo.
echo Now refresh your Master Control Dashboard!
echo Type: /source code 17120105MOHANRAJ
echo.
pause
