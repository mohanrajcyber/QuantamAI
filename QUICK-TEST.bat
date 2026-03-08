@echo off
echo ========================================
echo Quantum AI - Quick API Test
echo ========================================
echo.

cd backend

echo Testing API Keys...
echo.
node test-api-keys.js

echo.
echo ========================================
echo Test Complete!
echo ========================================
echo.
pause
