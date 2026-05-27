@echo off
title Launching University Guide System

echo ===================================================
echo   Releasing Port 3000 if it is occupied...
echo ===================================================
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Found process %%a on Port 3000. Killing it...
    taskkill /F /PID %%a
)
echo.
echo ===================================================
echo   Starting Next.js server and opening browser...
echo ===================================================
echo.

:: Launch browser in 3 seconds (using ping for delay)
start /b cmd /c "ping 127.0.0.1 -n 4 >nul && start http://localhost:3000"

:: Start Next.js dev server
call npm.cmd run dev

pause
