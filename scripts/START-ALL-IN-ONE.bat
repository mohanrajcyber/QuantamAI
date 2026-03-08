@echo off
color 0A
echo.
echo ========================================
echo    QUANTUM AI - ONE-CLICK STARTUP
echo ========================================
echo.
echo Starting all servers...
echo.

REM Kill any existing Node processes
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak > nul

echo [1/2] Starting Backend Server...
cd backend
start "Quantum AI Backend" cmd /k "npm start"
cd ..
timeout /t 5 /nobreak > nul

echo [2/2] Starting Frontend Server...
start "Quantum AI Frontend" cmd /k "npm run dev"
timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo    ALL SERVERS STARTED!
echo ========================================
echo.
echo IMPORTANT LINKS:
echo.
echo 1. LOGIN PAGE (Force Logout):
echo    http://localhost:5173?logout=force
echo.
echo 2. MAIN APP (Normal Access):
echo    http://localhost:5173
echo.
echo 3. BACKEND API:
echo    http://localhost:3001
echo.
echo 4. MASTER CONTROL:
echo    Type in chat: /source code 17120105MOHANRAJ
echo.
echo ========================================
echo    QUICK ACTIONS
echo ========================================
echo.
echo Press 1 to open LOGIN PAGE
echo Press 2 to open MAIN APP
echo Press 3 to open BACKEND API
echo Press 4 to see ALL LINKS
echo Press 5 to EXIT
echo.

:menu
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    start http://localhost:5173?logout=force
    echo.
    echo Opening LOGIN PAGE...
    echo.
    goto menu
)

if "%choice%"=="2" (
    start http://localhost:5173
    echo.
    echo Opening MAIN APP...
    echo.
    goto menu
)

if "%choice%"=="3" (
    start http://localhost:3001
    echo.
    echo Opening BACKEND API...
    echo.
    goto menu
)

if "%choice%"=="4" (
    echo.
    echo ========================================
    echo    ALL QUANTUM AI LINKS
    echo ========================================
    echo.
    echo LOGIN PAGE:
    echo http://localhost:5173?logout=force
    echo.
    echo MAIN APP:
    echo http://localhost:5173
    echo.
    echo BACKEND API:
    echo http://localhost:3001
    echo.
    echo MASTER CONTROL:
    echo Type: /source code 17120105MOHANRAJ
    echo.
    echo QUANTUM COMMANDS:
    echo - quantum shutdown
    echo - quantum restart
    echo - quantum lockdown
    echo - quantum unlock
    echo - quantum memory purge
    echo.
    echo ========================================
    echo.
    goto menu
)

if "%choice%"=="5" (
    echo.
    echo Exiting... Servers will continue running.
    echo To stop servers, close the terminal windows.
    echo.
    timeout /t 2 /nobreak > nul
    exit
)

echo Invalid choice! Please enter 1-5.
echo.
goto menu
