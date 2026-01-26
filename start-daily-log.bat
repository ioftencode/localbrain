@echo off
REM Daily Log PWA Server Starter
REM This script starts the server and opens the app in your default browser

cd /d "%~dp0"

echo.
echo ╔════════════════════════════════════════╗
echo ║  📝 Daily Log - Desktop App            ║
echo ╚════════════════════════════════════════╝
echo.
echo Checking dependencies...

REM Check if node_modules exists
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
)

echo.
echo Building application...
call npm run build

echo.
echo Starting server...
echo.
echo ✨ Your app will open automatically in 3 seconds...
echo.
echo 🌐 Access: http://localhost:3000
echo 📱 To install on desktop, look for the Install button
echo.

timeout /t 3 /nobreak

REM Open browser
start http://localhost:3000

REM Start server
node local-server.js

pause
