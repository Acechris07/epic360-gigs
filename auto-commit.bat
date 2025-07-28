@echo off
echo 🚀 Starting automatic commit process...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if we're in a git repository
git status >nul 2>&1
if errorlevel 1 (
    echo ❌ Not in a git repository
    pause
    exit /b 1
)

REM Run the auto-commit script
echo 📝 Running auto-commit script...
node scripts/auto-commit.js

echo.
echo ✅ Auto-commit process completed!
pause 